#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import sys
import time
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from dotenv import load_dotenv
import psycopg2

REAL_URL = (
    "https://www.immobilienscout24.de/Suche/de/sachsen-anhalt/magdeburg/wohnung-kaufen"
    "?numberofrooms=4.0-&livingspace=-75.0&enteredFrom=result_list"
)

ENV_FILE_MAP = {
    "local": ".env.local",
    "staging": ".env.staging",
    "prod": ".env.prod",
    "test": ".env.test",
}


def _load_app_env() -> Path:
    env_name = (os.getenv("APP_ENV", "local").strip() or "local").lower()
    env_file_name = ENV_FILE_MAP.get(env_name, ".env.local")
    repo_root = Path(__file__).resolve().parents[3]
    env_file = repo_root / env_file_name

    if env_file.exists():
        load_dotenv(env_file)
        print(f"Loaded env file: {env_file}")
    else:
        print(f"Env file not found (continuing with process env): {env_file}")
    return env_file


def _http_json(method: str, url: str, payload: dict[str, Any] | None = None) -> dict[str, Any]:
    data = None
    if payload is not None:
        data = json.dumps(payload).encode("utf-8")

    req = Request(
        url,
        data=data,
        method=method,
        headers={"Content-Type": "application/json"},
    )

    try:
        with urlopen(req, timeout=30) as response:
            return json.loads(response.read().decode("utf-8"))
    except HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"HTTP {exc.code} for {url}: {body}") from exc
    except URLError as exc:
        raise RuntimeError(f"Request failed for {url}: {exc}") from exc


def _check_env(strict: bool) -> list[str]:
    required_env = ["DATABASE_URL"]
    proxy_enabled = str(os.getenv("BRIGHTDATA_PROXY_ENABLED", "true")).strip().lower() in {
        "1",
        "true",
        "yes",
        "on",
    }
    if proxy_enabled:
        required_env.extend(
            [
                "BRIGHTDATA_PROXY_USERNAME",
                "BRIGHTDATA_PROXY_PASSWORD",
            ]
        )
    solver_enabled = str(os.getenv("CAPTCHA_SOLVER_ENABLED", "false")).strip().lower() in {
        "1",
        "true",
        "yes",
        "on",
    }
    if solver_enabled:
        required_env.append("CAPTCHA_API_KEY")

    missing = [key for key in required_env if not os.getenv(key)]

    if missing:
        print("Missing env keys:")
        for key in missing:
            print(f"  - {key}")
        if strict:
            raise SystemExit(2)
    return missing


def _poll_latest_run(base_url: str, watchlist_id: str, timeout_s: int, interval_s: int) -> dict[str, Any]:
    deadline = time.time() + timeout_s
    latest_url = f"{base_url}/api/watchlists/{watchlist_id}/runs/latest"

    while time.time() < deadline:
        latest = _http_json("GET", latest_url)
        status = str(latest.get("status") or "").lower()
        print(f"latest status={status}")
        if status in {"done", "failed"}:
            return latest
        time.sleep(interval_s)

    raise TimeoutError(f"Timed out waiting for terminal run status after {timeout_s}s")


def _read_run_stats(run_id: str) -> dict[str, Any]:
    database_url = os.getenv("DATABASE_URL", "").strip()
    if not database_url:
        raise RuntimeError("DATABASE_URL is required to validate acceptance stats")

    with psycopg2.connect(database_url) as conn:
        with conn.cursor() as cur:
            cur.execute(
                "select stats from public.watchlist_runs where id = %s",
                (run_id,),
            )
            row = cur.fetchone()
            if not row or not isinstance(row[0], dict):
                return {}
            return row[0]


def main() -> int:
    parser = argparse.ArgumentParser(description="Run real URL watchlist queue smoke test")
    parser.add_argument("--base-url", default=os.getenv("BACKEND_BASE_URL", "http://127.0.0.1:3002"))
    parser.add_argument("--search-url", default=REAL_URL)
    parser.add_argument("--timeout", type=int, default=600)
    parser.add_argument("--interval", type=int, default=5)
    parser.add_argument("--preflight-only", action="store_true")
    parser.add_argument("--no-strict-env", action="store_true")
    args = parser.parse_args()

    _load_app_env()
    _check_env(strict=not args.no_strict_env)

    if args.preflight_only:
        print("Preflight OK")
        return 0

    payload = {
        "name": "Real URL Proxy Smoke Test",
        "search_url": args.search_url,
        "defaults": {},
    }

    watchlist = _http_json("POST", f"{args.base_url}/api/watchlists", payload)
    watchlist_id = watchlist.get("id")
    if not watchlist_id:
        raise RuntimeError(f"watchlist response missing id: {watchlist}")
    print(f"watchlist_id={watchlist_id}")

    run_start = _http_json("POST", f"{args.base_url}/api/watchlists/{watchlist_id}/runs")
    run_id = run_start.get("run_id")
    if not run_id:
        raise RuntimeError(f"run start response missing run_id: {run_start}")
    print(f"run_id={run_id}")

    latest = _poll_latest_run(args.base_url, watchlist_id, args.timeout, args.interval)
    print("latest:", json.dumps(latest, ensure_ascii=False))

    status = str(latest.get("status") or "").lower()
    if status != "done":
        raise RuntimeError(f"Run ended with non-success status: {status}")

    run_stats = _read_run_stats(run_id)
    print("run_stats:", json.dumps(run_stats, ensure_ascii=False))
    l1_upserted = int(run_stats.get("l1_upserted", 0) or 0)
    if l1_upserted < 1:
        raise RuntimeError(
            "Acceptance failed: expected at least one l1 listing insertion, "
            f"got l1_upserted={l1_upserted}"
        )

    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"FAIL: {exc}")
        raise
