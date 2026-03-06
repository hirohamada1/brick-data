from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path

import requests
from dotenv import dotenv_values


DEFAULT_TEST_URL = "https://geo.brdtest.com/welcome.txt?product=unlocker&method=api"


def _load_env_file(app_env: str) -> dict:
    root = Path(__file__).resolve().parents[3]
    env_file = root / f".env.{app_env}"
    if not env_file.exists():
        raise RuntimeError(f"env file not found: {env_file}")
    return dotenv_values(env_file)


def main() -> int:
    parser = argparse.ArgumentParser(description="BrightData Web Unlocker preflight check")
    parser.add_argument("--app-env", default=os.getenv("APP_ENV", "test"))
    parser.add_argument("--url", default=DEFAULT_TEST_URL)
    args = parser.parse_args()

    env_map = _load_env_file(args.app_env)
    api_key = (env_map.get("BRIGHTDATA_API_KEY") or "").strip()
    zone = (env_map.get("BRIGHTDATA_ZONE") or "immo_scan1").strip() or "immo_scan1"
    base_url = (env_map.get("BRIGHTDATA_BASE_URL") or "https://api.brightdata.com").strip() or "https://api.brightdata.com"

    if not api_key:
        print("FAILED: BRIGHTDATA_API_KEY missing")
        return 2

    endpoint = f"{base_url.rstrip('/')}/request"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}",
    }
    payload = {"zone": zone, "url": args.url, "format": "raw"}

    print(f"endpoint={endpoint}")
    print(f"zone={zone}")
    print(f"url={args.url}")

    resp = requests.post(endpoint, headers=headers, data=json.dumps(payload), timeout=(10, 60))
    print(f"status={resp.status_code}")
    print(f"x-brd-error-code={resp.headers.get('x-brd-error-code', '')}")
    print(f"x-brd-error={resp.headers.get('x-brd-error', '')}")
    print(f"content-type={resp.headers.get('content-type', '')}")
    print(f"body-len={len(resp.text or '')}")

    if resp.status_code >= 400:
        print("FAILED: http error")
        return 3

    body = (resp.text or "").strip()
    if body:
        print("SUCCESS: non-empty body returned")
        return 0

    try:
        data = resp.json()
    except Exception:
        data = {}

    request_id = ""
    if isinstance(data, dict):
        request_id = str(data.get("request_id") or data.get("id") or "").strip()

    if request_id:
        print(f"INFO: async request id returned ({request_id})")
        return 0

    print("FAILED: empty body and no request id")
    return 4


if __name__ == "__main__":
    raise SystemExit(main())
