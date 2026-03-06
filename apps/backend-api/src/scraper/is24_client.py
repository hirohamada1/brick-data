from __future__ import annotations

import logging
import os
from dataclasses import dataclass
from typing import Any, Optional
from urllib.parse import parse_qsl, urlencode, urlparse, urlunparse

import httpx

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class IS24ClientSettings:
    provider: str = "direct"
    timeout_s: float = 60.0
    country: Optional[str] = "DE"

    # BrightData API compatibility fields (legacy/optional)
    brightdata_api_key: str = ""
    zone: str = ""
    base_url: str = "https://api.brightdata.com"

    # Residential proxy routing
    brightdata_proxy_username: str = ""
    brightdata_proxy_password: str = ""
    brightdata_proxy_host: str = "brd.superproxy.io"
    brightdata_proxy_port: int = 7777
    proxy_ssl_verify: bool = True
    proxy_ca_bundle: str = ""

    @staticmethod
    def _normalize_provider(raw_provider: str) -> str:
        provider = (raw_provider or "direct").strip().lower()
        if provider in {
            "residential_proxy",
            "brightdata_residential",
            "oxylabs",
            "oxylabs_residential",
            "proxy",
            "proxy_residential",
        }:
            return "residential_proxy"
        if provider in {"brightdata", "brightdata_api", "brightdata_unlocker", "legacy_api"}:
            return "brightdata_api"
        return "direct"

    @classmethod
    def from_env(cls) -> "IS24ClientSettings":
        provider_raw = (
            os.getenv("IS24_PROVIDER")
            or os.getenv("BRIGHTDATA_PROVIDER")
            or "direct"
        )
        proxy_ssl_verify = os.getenv("IS24_PROXY_SSL_VERIFY", "true").strip().lower() in {"1", "true", "yes", "on"}
        return cls(
            provider=cls._normalize_provider(provider_raw),
            timeout_s=float(os.getenv("IS24_TIMEOUT_SECONDS", "60")),
            country=os.getenv("IS24_COUNTRY", "DE").strip() or None,
            brightdata_api_key=os.getenv("BRIGHTDATA_API_KEY", "").strip(),
            zone=os.getenv("BRIGHTDATA_ZONE", "").strip(),
            base_url=os.getenv("BRIGHTDATA_BASE_URL", "https://api.brightdata.com").strip(),
            brightdata_proxy_username=os.getenv("BRIGHTDATA_PROXY_USERNAME", "").strip(),
            brightdata_proxy_password=os.getenv("BRIGHTDATA_PROXY_PASSWORD", "").strip(),
            brightdata_proxy_host=os.getenv("BRIGHTDATA_PROXY_HOST", "brd.superproxy.io").strip() or "brd.superproxy.io",
            brightdata_proxy_port=int(os.getenv("BRIGHTDATA_PROXY_PORT", "7777")),
            proxy_ssl_verify=proxy_ssl_verify,
            proxy_ca_bundle=os.getenv("IS24_PROXY_CA_BUNDLE", "").strip(),
        )


class IS24Client:
    """Fetches IS24 search-result HTML via direct HTTP, residential proxy, or legacy BrightData API."""

    def __init__(
        self,
        settings: Optional[IS24ClientSettings] = None,
        http_client: Optional[httpx.Client] = None,
    ) -> None:
        self.settings = settings or IS24ClientSettings.from_env()
        timeout = httpx.Timeout(max(self.settings.timeout_s, 1.0))
        self._http = http_client or httpx.Client(timeout=timeout)

    def build_page_url(self, base_url: str, page: int) -> str:
        if page < 1:
            raise ValueError("page must be >= 1")

        parsed = urlparse(base_url)
        params = parse_qsl(parsed.query, keep_blank_values=True)

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
        provider = self.settings.provider.lower()
        if provider == "brightdata_api":
            return self._fetch_via_brightdata_api(url)
        if provider == "residential_proxy":
            return self._fetch_via_residential_proxy(url)
        return self._fetch_direct(url)

    def _fetch_direct(self, url: str) -> str:
        response = self._http.get(url, headers=self._browser_headers())
        response.raise_for_status()
        return response.text

    def _fetch_via_residential_proxy(self, url: str) -> str:
        if not self.settings.brightdata_proxy_username or not self.settings.brightdata_proxy_password:
            raise RuntimeError(
                "BRIGHTDATA_PROXY_USERNAME and BRIGHTDATA_PROXY_PASSWORD must be configured"
            )

        proxy = (
            f"http://{self.settings.brightdata_proxy_username}:{self.settings.brightdata_proxy_password}"
            f"@{self.settings.brightdata_proxy_host}:{self.settings.brightdata_proxy_port}"
        )
        verify: bool | str = self.settings.proxy_ssl_verify
        if self.settings.proxy_ca_bundle:
            verify = self.settings.proxy_ca_bundle
        with httpx.Client(timeout=self._http.timeout, proxy=proxy, verify=verify) as client:
            response = client.get(url, headers=self._browser_headers())
            response.raise_for_status()
            return response.text

    def _fetch_via_brightdata_api(self, url: str) -> str:
        if not self.settings.brightdata_api_key:
            raise RuntimeError("BRIGHTDATA_API_KEY is not configured")
        if not self.settings.zone:
            raise RuntimeError("BRIGHTDATA_ZONE is not configured")

        endpoint = f"{self.settings.base_url.rstrip('/')}/request"
        headers = {"Authorization": f"Bearer {self.settings.brightdata_api_key}"}
        payload: dict[str, Any] = {
            "zone": self.settings.zone,
            "url": url,
            "method": "GET",
            "headers": self._browser_headers(),
            "format": "raw",
        }
        if self.settings.country:
            payload["country"] = self.settings.country

        response = self._http.post(endpoint, headers=headers, json=payload)
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

    @staticmethod
    def _browser_headers() -> dict[str, str]:
        return {
            "User-Agent": (
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/122.0 Safari/537.36"
            ),
            "Accept-Language": "de-DE,de;q=0.9,en;q=0.8",
        }
