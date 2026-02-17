from __future__ import annotations
import requests
import os
import time
import re

from dataclasses import dataclass
from typing import Any, Dict, List, Optional

class BrightDataClient:
    def __init__(self, api_key: str, zone: str, *, base_url: str = "https://api.brightdata.com", country: str | None = None):
        self.api_key = api_key
        self.zone = zone
        self.base_url = base_url.rstrip("/")
        self.country = country or os.getenv("BRIGHTDATA_COUNTRY", "DE")
        self.poll_interval_seconds = float(os.getenv("BRIGHTDATA_POLL_INTERVAL_SECONDS", "1.2"))
        self.max_poll_seconds = int(os.getenv("BRIGHTDATA_MAX_POLL_SECONDS", "60"))

    def fetch_html(self, url: str, *, render: bool = False) -> str:
        print("BRIGHTDATA.fetch_html ENTERED")
        print("BEFORE REQUEST")
        base_payload: Dict[str, Any] = {"zone": self.zone, "url": url, "method": "GET"}
        if self.country:
            base_payload["country"] = self.country

        browser_ua_payload: Dict[str, Any] = {
            **base_payload,
            "headers": {
                "User-Agent": (
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/122.0 Safari/537.36"
                )
            },
        }

        headers: Dict[str, str] = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        }

        print("TOKEN:", self.api_key)
        print("HEADERS:", headers)
        print("PAYLOAD:", {**base_payload, "format": "raw", "render": bool(render)})

        payload_variants: list[Dict[str, Any]] = [{**base_payload, "format": "raw", "render": bool(render)}]
        if not render:
            payload_variants.append({**base_payload, "format": "raw", "render": True})
        payload_variants.append({**browser_ua_payload, "format": "raw", "render": bool(render)})
        if not render:
            payload_variants.append({**browser_ua_payload, "format": "raw", "render": True})

        last_attempt_error: Optional[str] = None
        for idx, payload in enumerate(payload_variants, start=1):
            response = self._post_request(payload=payload, headers=headers, async_mode=False)
            print(f"AFTER REQUEST (attempt {idx}/{len(payload_variants)})")
            print("STATUS:", response.status_code)
            print("LENGTH:", len(response.text))
            print(response.text[:1500])
            if response.status_code >= 400:
                last_attempt_error = f"{response.status_code}: {response.text[:300]}"
                print("ATTEMPT FAILED, CONTINUING TO NEXT VARIANT")
                continue

            html_body, request_id = self._extract_html_and_request_id(response)
            if html_body:
                return html_body
            if request_id:
                polled_html = self._poll_for_body(request_id=request_id, headers=headers)
                if polled_html:
                    return polled_html

        async_submit_payload = payload_variants[-1]
        print("DIRECT PATH EMPTY, TRYING ASYNC FALLBACK")
        async_submit = self._post_request(payload=async_submit_payload, headers=headers, async_mode=True)
        print("ASYNC SUBMIT STATUS:", async_submit.status_code)
        print("ASYNC SUBMIT LENGTH:", len(async_submit.text))
        print("ASYNC SUBMIT URL:", async_submit.url)
        print("ASYNC SUBMIT HEADERS:", dict(async_submit.headers))
        async_submit.raise_for_status()
        _, async_request_id = self._extract_html_and_request_id(async_submit)
        if async_request_id:
            print("ASYNC REQUEST ID:", async_request_id)
            polled_html = self._poll_for_body(request_id=async_request_id, headers=headers)
            if polled_html:
                return polled_html

        raise RuntimeError(
            "BrightData returned an empty response body for search page request "
            f"(url={url}, zone={self.zone}, render={render}, last_attempt_error={last_attempt_error})."
        )

    def _post_request(self, *, payload: Dict[str, Any], headers: Dict[str, str], async_mode: bool) -> requests.Response:
        endpoint = f"{self.base_url}/request"
        if async_mode:
            endpoint += "?async=true"
        return requests.post(
            endpoint,
            headers=headers,
            json=payload,
            timeout=(10, 120),
        )

    def _extract_html_and_request_id(self, response: requests.Response) -> tuple[Optional[str], Optional[str]]:
        text = (response.text or "").strip()
        content_type = (response.headers.get("content-type") or "").lower()
        location_request_id = _extract_request_id_from_location(response.headers.get("location"))
        response_url = str(getattr(response, "url", "") or "")
        url_request_id = _extract_request_id_from_location(response_url)
        header_request_id = (
            response.headers.get("x-request-id")
            or response.headers.get("x-brd-request-id")
            or response.headers.get("request-id")
            or location_request_id
            or url_request_id
        )
        header_request_id = str(header_request_id).strip() if header_request_id else None
        if header_request_id == "":
            header_request_id = None

        if "application/json" not in content_type:
            if not text:
                return None, header_request_id
            if text.startswith("<"):
                return text, header_request_id
            if _looks_like_request_id(text):
                return None, text
            return text, header_request_id

        try:
            data = response.json()
        except Exception:
            if not text:
                return None, header_request_id
            if text.startswith("<"):
                return text, header_request_id
            if _looks_like_request_id(text):
                return None, text
            return text, header_request_id

        if not isinstance(data, dict):
            if text and text.startswith("<"):
                return text, header_request_id
            if _looks_like_request_id(text):
                return None, text
            return (text or None), header_request_id

        body: Any = data.get("body")
        nested_response = data.get("response")
        if isinstance(nested_response, dict):
            body = body or nested_response.get("body") or nested_response.get("content")
        else:
            body = body or nested_response
        body = body or data.get("content")

        request_id = data.get("request_id") or data.get("id")
        if request_id is None and isinstance(data.get("request"), dict):
            request_id = data["request"].get("id")
        request_id_text = str(request_id).strip() if request_id is not None else header_request_id
        if request_id_text == "":
            request_id_text = header_request_id

        if isinstance(body, str):
            body_text = body.strip()
            if body_text:
                return body_text, request_id_text

        return None, request_id_text

    def _poll_for_body(self, *, request_id: str, headers: Dict[str, str]) -> Optional[str]:
        deadline = time.monotonic() + max(1, self.max_poll_seconds)
        endpoint = f"{self.base_url}/request/{request_id}"
        poll_count = 0

        while time.monotonic() < deadline:
            poll_count += 1
            response = requests.get(endpoint, headers=headers, timeout=(10, 120))
            response.raise_for_status()

            html_body, _ = self._extract_html_and_request_id(response)
            if html_body:
                print(f"ASYNC POLL #{poll_count}: HTML BODY RECEIVED")
                return html_body

            try:
                data = response.json()
            except Exception:
                data = None

            if isinstance(data, dict):
                status = str(data.get("status") or "").strip().lower()
                print(f"ASYNC POLL #{poll_count}: status={status!r}")
                if status in {"failed", "error"}:
                    raise RuntimeError(f"BrightData async request failed (request_id={request_id}): {data}")
                if status in {"done", "completed", "success"}:
                    return None

            time.sleep(self.poll_interval_seconds)

        raise RuntimeError(
            f"BrightData async polling timed out after {self.max_poll_seconds}s (request_id={request_id})"
        )


def _looks_like_request_id(value: str) -> bool:
    text = value.strip()
    if not text:
        return False
    if " " in text or "\n" in text or "\r" in text or "/" in text:
        return False
    if len(text) < 8:
        return False
    has_alpha = any(ch.isalpha() for ch in text)
    has_num = any(ch.isdigit() for ch in text)
    allowed = all(ch.isalnum() or ch in {"-", "_"} for ch in text)
    return allowed and (has_alpha or has_num)


def _extract_request_id_from_location(value: Optional[str]) -> Optional[str]:
    if not value:
        return None
    text = str(value).strip()
    if not text:
        return None
    match = re.search(r"/request/([^/?#]+)", text)
    if not match:
        return None
    request_id = match.group(1).strip()
    return request_id or None


class ImmoScoutExposeScraper:
    def __init__(self, brightdata_client):
        self.client = brightdata_client

    async def fetch_expose_html(self, expose_url: str) -> str:
        return await self.client.fetch_html(expose_url)

    async def scrape(self, external_id: str, expose_url: str) -> Dict[str, Any]:
        html = await self.fetch_expose_html(expose_url)
        from scraper.mapping.immoscout_expose_mapper import map_expose_html_to_listing
        return map_expose_html_to_listing(
            external_id=external_id,
            expose_url=expose_url,
            html=html,
        )

@dataclass
class SearchHit:
    source: str
    external_id: str
    expose_url: str

class ImmoScoutSearchScraper:
    def __init__(self, brightdata_client):
        self.client = brightdata_client

    async def fetch_search_html(self, search_url: str) -> str:
        # Reuse your existing BrightData request method.
        # IMPORTANT: This must return the *HTML* of the search page.
        return await self.client.fetch_html(search_url)

    async def scrape(self, search_url: str) -> List[SearchHit]:
        html = await self.fetch_search_html(search_url)
        from scraper.mapping.immoscout_search_mapper import parse_search_hits
        return parse_search_hits(html)
