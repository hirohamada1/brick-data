from __future__ import annotations

import asyncio
import time
from dataclasses import dataclass
from typing import Any, Optional

import httpx

import json


@dataclass
class BrightDataConfig:
    api_key: str
    zone: str
    country: str = "DE"
    fmt: str = "raw"  # "raw" or "markdown"
    poll_interval_ms: int = 1200
    max_poll_seconds: int = 60


class BrightDataError(RuntimeError):
    pass


class BrightDataClient:
    """
    Minimal Bright Data Web Unlocker async client:
    POST /request?async=true -> request_id
    GET  /request/{request_id} -> status + response.body
    """

    def __init__(self, cfg: BrightDataConfig, base_url: str = "https://api.brightdata.com"):
        self.cfg = cfg
        self.base_url = base_url.rstrip("/")
        self._headers = {
            "Authorization": f"Bearer {cfg.api_key}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        }

    async def fetch(self, url: str, method: str = "GET") -> str:
        result = await self._submit(url=url, method=method)

        # Always normalize to string
        if result is None:
            return ""

        if isinstance(result, str):
            s = result.strip()

            # 1) direct HTML
            if s.startswith("<"):
                return s

            # 2) submit might sometimes return JSON text (rare, but your _submit can do this)
            if s.startswith("{") or s.startswith("["):
                try:
                    data = json.loads(s)
                    # try to pull body/content if present
                    if isinstance(data, dict):
                        resp = data.get("response") or {}
                        body = resp.get("body") or resp.get("content") or data.get("content") or data.get("body")
                        if isinstance(body, str) and body.strip().startswith("<"):
                            return body.strip()
                except Exception:
                    pass

            # 3) otherwise: treat it as request_id and poll
            return await self._poll(s)

        # fallback: stringify unexpected types
        return str(result)

    async def fetch_html(self, url: str, method: str = "GET") -> str:
        html = await self.fetch(url, method)
        html = html.strip()

        if not html.startswith("<"):
            raise ValueError(
                "fetch_html() did not return HTML. "
                f"Got first 200 chars:\n{html[:200]}"
            )

        return html

    async def _submit(self, url: str, method: str) -> str:
        payload = {
            "zone": self.cfg.zone,
            "url": url,
            "format": self.cfg.fmt,
            "method": method,
            "country": self.cfg.country,
        }

        async with httpx.AsyncClient(timeout=60) as client:
            r = await client.post(
                f"{self.base_url}/request?async=true",
                headers=self._headers,
                json=payload,
            )
            
            # If we get HTML/Text instead of JSON, it might be the Direct response
            content_type = r.headers.get("content-type", "")
            if "application/json" not in content_type:
                return r.text

            try:
                data = r.json()
            except Exception:
                return r.text

            if r.status_code >= 400:
                raise BrightDataError(f"BrightData submit failed {r.status_code}: {r.text}")

            request_id = data.get("request_id") or data.get("id")
            if not request_id:
                # If it's valid JSON but not a request_id, it might be the actual data in JSON format
                return r.text
            return str(request_id)

    async def _poll(self, request_id: str) -> str:
        deadline = time.time() + self.cfg.max_poll_seconds

        async with httpx.AsyncClient(timeout=60) as client:
            while time.time() < deadline:
                r = await client.get(
                    f"{self.base_url}/request/{request_id}",
                    headers=self._headers,
                )
                if r.status_code >= 400:
                    raise BrightDataError(f"BrightData poll failed {r.status_code}: {r.text}")

                data = r.json()
                status = (data.get("status") or "").lower()

                if status in {"done", "completed", "success"}:
                    resp = data.get("response") or {}
                    body = resp.get("body")
                    if body is None:
                        # some variants may return response -> "content"
                        body = resp.get("content")
                    if body is None:
                        raise BrightDataError(f"BrightData done but no body. Response: {data}")
                    return body

                if status in {"failed", "error"}:
                    raise BrightDataError(f"BrightData request failed: {data}")

                await asyncio.sleep(self.cfg.poll_interval_ms / 1000)

        raise BrightDataError(f"BrightData poll timeout after {self.cfg.max_poll_seconds}s (request_id={request_id})")