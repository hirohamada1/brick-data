#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

try:
    from dotenv import load_dotenv
except Exception:  # pragma: no cover
    load_dotenv = None

try:
    from src.scraper.is24_client import IS24Client, IS24ClientSettings
    from src.scraper.services.playwright_client import PlaywrightFetchClient
except Exception:  # pragma: no cover
    from scraper.is24_client import IS24Client, IS24ClientSettings  # type: ignore
    from scraper.services.playwright_client import PlaywrightFetchClient  # type: ignore


DEFAULT_URL = (
    "https://www.immobilienscout24.de/Suche/de/sachsen-anhalt/magdeburg/wohnung-kaufen"
    "?numberofrooms=4.0-&livingspace=-75.0&enteredFrom=result_list"
)


def _load_env(repo_root: Path) -> None:
    if load_dotenv is None:
        return
    env_file = repo_root / ".env.local"
    if env_file.exists():
        load_dotenv(env_file)


def _probe_playwright(url: str, use_proxy: bool) -> dict[str, Any]:
    out: dict[str, Any] = {"use_proxy": use_proxy}
    client = PlaywrightFetchClient(
        use_proxy=use_proxy,
        headful=False,
        timeout_ms=45000,
        min_delay_s=1,
        max_delay_s=2,
    )
    try:
        artifact = client.fetch_search_page(url, session_id="diag")
        out.update(
            {
                "status": artifact.status.value,
                "http_status": artifact.http_status,
                "provider": artifact.provider,
                "block_reason": artifact.block_reason,
                "challenge_type": artifact.challenge_type,
                "challenge_title": artifact.challenge_title,
                "challenge_markers": artifact.challenge_markers,
                "contains_resultlistEntries": bool((artifact.raw_html or "").lower().find("resultlistentries") >= 0),
                "html_len": len(artifact.raw_html or ""),
                "captcha_attempted": artifact.captcha_attempted,
                "captcha_solved": artifact.captcha_solved,
                "captcha_skipped_reason": artifact.captcha_skipped_reason,
                "captcha_error_code": artifact.captcha_error_code,
            }
        )
    except Exception as exc:
        out.update({"error_type": type(exc).__name__, "error": str(exc)})
    return out


def _probe_http(url: str, provider: str) -> dict[str, Any]:
    out: dict[str, Any] = {"provider": provider}
    base = IS24ClientSettings.from_env()
    settings = IS24ClientSettings(
        provider=provider,
        timeout_s=base.timeout_s,
        country=base.country,
        brightdata_api_key=base.brightdata_api_key,
        zone=base.zone,
        base_url=base.base_url,
        brightdata_proxy_username=base.brightdata_proxy_username,
        brightdata_proxy_password=base.brightdata_proxy_password,
        brightdata_proxy_host=base.brightdata_proxy_host,
        brightdata_proxy_port=base.brightdata_proxy_port,
        proxy_ssl_verify=base.proxy_ssl_verify,
        proxy_ca_bundle=base.proxy_ca_bundle,
    )
    client = IS24Client(settings=settings)
    try:
        html = client.fetch_search_page(url)
        lowered = html.lower()
        out.update(
            {
                "html_len": len(html),
                "contains_resultlistEntries": "resultlistentries" in lowered,
                "contains_robot": "ich bin kein roboter" in lowered,
                "contains_captcha": "captcha" in lowered,
            }
        )
    except Exception as exc:
        out.update({"error_type": type(exc).__name__, "error": str(exc)})
    return out


def main() -> int:
    parser = argparse.ArgumentParser(description="IS24 blocking/proxy diagnostics")
    parser.add_argument("--url", default=DEFAULT_URL)
    parser.add_argument("--skip-playwright", action="store_true")
    parser.add_argument("--skip-http", action="store_true")
    parser.add_argument("--include-legacy-brightdata-api", action="store_true")
    args = parser.parse_args()

    repo_root = Path(__file__).resolve().parents[3]
    _load_env(repo_root)

    report: dict[str, Any] = {
        "timestamp_utc": datetime.now(timezone.utc).isoformat(),
        "url": args.url,
        "playwright": [],
        "http_client": [],
    }

    if not args.skip_playwright:
        report["playwright"] = [_probe_playwright(args.url, False), _probe_playwright(args.url, True)]

    if not args.skip_http:
        http_probes = [
            _probe_http(args.url, "direct"),
            _probe_http(args.url, "residential_proxy"),
        ]
        if args.include_legacy_brightdata_api:
            http_probes.append(_probe_http(args.url, "brightdata_api"))
        report["http_client"] = http_probes

    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
