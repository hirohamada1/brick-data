# scraping/brightdata_client.py
from __future__ import annotations

import os
import time
from dataclasses import dataclass
from typing import Any, Optional

import httpx


@dataclass(frozen=True)
class BrightDataConfig:
    api_key: str = os.getenv("BRIGHTDATA_API_KEY", "")
    zone: str = os.getenv("BRIGHTDATA_ZONE", "immo_scan1")
    base_url: str = "https://api.brightdata.com"
    country: Optional[str] = os.getenv("BRIGHTDATA_COUNTRY", "DE")
    timeout_s: float = 60.0


class BrightDataUnlockerClient:
    """
    Direct API access via Bright Data Unlocker API.
    Uses the unified /request endpoint to fetch unblocked HTML/JSON.
    Docs: Unlocker API /request. :contentReference[oaicite:1]{index=1}
    """

    def __init__(self, cfg: BrightDataConfig) -> None:
        self.cfg = cfg

    def fetch_html(self, url: str, *, render: bool = True) -> str:
        """
        Returns unblocked HTML for a target URL.
        For many sites you may need JS rendering; keep render=True for MVP.
        """
        endpoint = f"{self.cfg.base_url}/request"
        headers = {
            "Authorization": f"Bearer {self.cfg.api_key}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        }

        payload: dict[str, Any] = {
            "zone": self.cfg.zone,
            "url": url,
            "format": "raw",     # get raw body back
            "method": "GET",
        }
        if self.cfg.country:
            payload["country"] = self.cfg.country

        # Bright Data supports browser rendering features; many integrations pass flags here.
        # Keep this minimal; you can extend (headers, cookies, premium domains, etc.) later. :contentReference[oaicite:2]{index=2}
        if render:
            payload["render"] = True

        with httpx.Client(timeout=self.cfg.timeout_s) as client:
            # DEBUG: print payload
            debug_payload = {k: v for k, v in payload.items()}
            print(f"DEBUG: sending payload to {endpoint}: {debug_payload}")
            r = client.post(endpoint, headers=headers, json=payload)
            if r.status_code != 200:
                print(f"DEBUG: Error response: {r.text}")
            r.raise_for_status()

            r.raise_for_status()

            # DEBUG: check content type
            ct = r.headers.get("content-type", "")
            if "application/json" not in ct:
                # If format=raw, we might get direct HTML
                print(f"DEBUG: Content-Type is {ct}, returning raw text")
                return r.text

            data = r.json()
            body = data.get("body") or data.get("response") or data.get("content")
            if not isinstance(body, str) or not body.strip():
                raise RuntimeError(f"Unlocker returned no HTML body. Keys: {list(data.keys())}")

            return body
