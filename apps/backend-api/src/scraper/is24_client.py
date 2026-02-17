from __future__ import annotations

import logging
import os
from dataclasses import dataclass
from typing import Any, Optional
from urllib.parse import parse_qsl, urlencode, urlparse, urlunparse

import httpx

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class BrightDataSettings:
    api_key: str
    zone: str
    base_url: str = "https://api.brightdata.com"
    country: Optional[str] = "DE"
    timeout_s: float = 60.0
    format: str = "raw"

    @classmethod
    def from_env(cls) -> "BrightDataSettings":
        return cls(
            api_key=os.getenv("BRIGHTDATA_API_KEY", "").strip(),
            zone=os.getenv("BRIGHTDATA_ZONE", "").strip(),
            base_url=os.getenv("BRIGHTDATA_BASE_URL", "https://api.brightdata.com").strip(),
            country=os.getenv("BRIGHTDATA_COUNTRY", "DE").strip() or None,
            timeout_s=float(os.getenv("BRIGHTDATA_TIMEOUT_SECONDS", "60")),
            format="raw",
        )


class IS24Client:
    """Fetches IS24 search-result HTML through BrightData."""

    def __init__(
        self,
        settings: Optional[BrightDataSettings] = None,
        http_client: Optional[httpx.Client] = None,
    ) -> None:
        self.settings = settings or BrightDataSettings.from_env()
        timeout = httpx.Timeout(120.0)
        self._http = http_client or httpx.Client(timeout=timeout)

    def build_page_url(self, base_url: str, page: int) -> str:
        if page < 1:
            raise ValueError("page must be >= 1")

        parsed = urlparse(base_url)
        params = parse_qsl(parsed.query, keep_blank_values=True)

        # IS24 accepts pageNumber/pagenumber. Preserve existing style if present.
        page_key = "pagenumber"
        filtered_params: list[tuple[str, str]] = []
        for key, value in params:
            if key.lower() in {"pagenumber", "enteredfrom"}:
                continue
            filtered_params.append((key, value))

        filtered_params.append((page_key, str(page)))

        updated_query = urlencode(filtered_params, doseq=True)
        return urlunparse(parsed._replace(query=updated_query))

    def fetch_search_page(self, url: str) -> str:
        if not self.settings.api_key:
            raise RuntimeError("BRIGHTDATA_API_KEY is not configured")
        if not self.settings.zone:
            raise RuntimeError("BRIGHTDATA_ZONE is not configured")

        print("Posting to BrightData:", url)


        endpoint = f"{self.settings.base_url.rstrip('/')}/request"
        

        headers = {
            "Authorization": f"Bearer {self.settings.api_key}",
        }
        payload: dict[str, Any] = {
            "zone": self.settings.zone,
            "url": url,
            "method": "GET",
            "headers": {
                "User-Agent": (
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/122.0 Safari/537.36"
                )
            },
            "format": "raw",
        }
        if self.settings.country:
            payload["country"] = self.settings.country

        response = self._http.post(endpoint, headers=headers, json=payload)

        print("Status:", response.status_code)
        print("Content-Type:", response.headers.get("content-type"))
        print("Response length:", len(response.text))

        response.raise_for_status()


        content_type = response.headers.get("content-type", "")
        if "application/json" not in content_type:
            return response.text

        data = response.json()
        body = data.get("body") or data.get("response") or data.get("content")
        if isinstance(body, str) and body.strip():
            return body

        logger.debug("Unexpected BrightData payload keys: %s", list(data.keys()))
        raise RuntimeError("BrightData response did not contain HTML body")
