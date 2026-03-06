from __future__ import annotations

import logging
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any, Optional
from urllib.parse import parse_qsl, urlencode, urlparse, urlunparse

try:
    from src.scraper.is24_parser import parse_search_payload
    from src.scraper.models.listing_schema import FetchArtifact, FetchStatus
    from src.scraper.parser import parse_search_results as parse_search_results_fallback
except Exception:
    from scraper.is24_parser import parse_search_payload  # type: ignore
    from scraper.models.listing_schema import FetchArtifact, FetchStatus  # type: ignore
    from scraper.parser import parse_search_results as parse_search_results_fallback  # type: ignore

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class ScrapePageResult:
    page: int
    url: str
    listings: list[dict]
    fetch_status: str = "success"


@dataclass
class IS24SearchResultScraper:
    """
    Scrapes ImmoScout24 search result pages and parses listing payloads.

    Required client API (one of):
      fetch_html(url: str, render: bool = False) -> str
      fetch_search_page(url: str, ...) -> str | FetchArtifact | dict
    """

    client: Any
    max_pages: int = 50
    ingestion_mode: str = "json_first"
    session_id: Optional[str] = None
    allow_html_fallback: bool = True

    def build_page_url(self, base_url: str, page: int) -> str:
        if page < 1:
            raise ValueError("page must be >= 1")

        parsed = urlparse(base_url)
        params = parse_qsl(parsed.query, keep_blank_values=True)

        page_key = "pagenumber"
        next_params: list[tuple[str, str]] = []
        for key, value in params:
            if key.lower() == "pagenumber":
                page_key = key
                continue
            next_params.append((key, value))
        next_params.append((page_key, str(page)))

        query = urlencode(next_params, doseq=True)
        return urlunparse(parsed._replace(query=query))

    def _fetch_artifact(self, page_url: str) -> FetchArtifact:
        if hasattr(self.client, "fetch_search_page"):
            try:
                if self.session_id:
                    response = self.client.fetch_search_page(page_url, session_id=self.session_id)
                else:
                    response = self.client.fetch_search_page(page_url)
            except TypeError:
                response = self.client.fetch_search_page(page_url)
            if isinstance(response, FetchArtifact):
                return response
            if all(hasattr(response, key) for key in ("status", "raw_html", "url")):
                status_raw = str(getattr(response, "status", "success")).lower()
                if "fetchstatus." in status_raw:
                    status_raw = status_raw.split(".", 1)[1]
                return FetchArtifact(
                    url=getattr(response, "url", page_url),
                    fetched_at=getattr(response, "fetched_at", datetime.now(timezone.utc)),
                    status=FetchStatus(status_raw) if status_raw in {"success", "blocked", "error"} else FetchStatus.ERROR,
                    http_status=getattr(response, "http_status", None),
                    final_url=getattr(response, "final_url", None),
                    raw_html=getattr(response, "raw_html", None),
                    extracted_json_text=getattr(response, "extracted_json_text", None),
                    error_message=getattr(response, "error_message", None),
                    block_reason=getattr(response, "block_reason", None),
                    error_code=getattr(response, "error_code", None),
                    attempt=getattr(response, "attempt", 1),
                    session_id=getattr(response, "session_id", self.session_id or "default"),
                    provider=getattr(response, "provider", "direct"),
                    challenge_title=getattr(response, "challenge_title", None),
                    challenge_type=getattr(response, "challenge_type", None),
                    challenge_markers=getattr(response, "challenge_markers", []) or [],
                    captcha_attempted=getattr(response, "captcha_attempted", 0) or 0,
                    captcha_solved=bool(getattr(response, "captcha_solved", False)),
                    captcha_task_id=getattr(response, "captcha_task_id", None),
                    captcha_cost=getattr(response, "captcha_cost", None),
                    captcha_skipped_reason=getattr(response, "captcha_skipped_reason", None),
                    captcha_error_code=getattr(response, "captcha_error_code", None),
                    captcha_error_message=getattr(response, "captcha_error_message", None),
                )
            if isinstance(response, dict):
                status = str(response.get("status") or "success").lower()
                return FetchArtifact(
                    url=page_url,
                    fetched_at=response.get("timestamp") or datetime.now(timezone.utc),
                    status=FetchStatus(status) if status in {"success", "blocked", "error"} else FetchStatus.ERROR,
                    http_status=response.get("http_status"),
                    final_url=response.get("final_url"),
                    raw_html=response.get("raw_html"),
                    extracted_json_text=response.get("extracted_json_text"),
                    error_message=response.get("error_message"),
                    block_reason=response.get("block_reason"),
                    error_code=response.get("error_code"),
                    attempt=int(response.get("attempt", 1) or 1),
                    session_id=str(response.get("session_id") or self.session_id or "default"),
                    provider=str(response.get("provider") or "direct"),  # type: ignore[arg-type]
                    challenge_title=response.get("challenge_title"),
                    challenge_type=response.get("challenge_type"),
                    challenge_markers=list(response.get("challenge_markers") or []),
                    captcha_attempted=int(response.get("captcha_attempted", 0) or 0),
                    captcha_solved=bool(response.get("captcha_solved", False)),
                    captcha_task_id=response.get("captcha_task_id"),
                    captcha_cost=response.get("captcha_cost"),
                    captcha_skipped_reason=response.get("captcha_skipped_reason"),
                    captcha_error_code=response.get("captcha_error_code"),
                    captcha_error_message=response.get("captcha_error_message"),
                )
            if isinstance(response, str):
                return FetchArtifact(url=page_url, raw_html=response)

            raise RuntimeError("Unsupported fetch_search_page response type")

        if hasattr(self.client, "fetch_html"):
            html = self.client.fetch_html(page_url, render=False)
            return FetchArtifact(url=page_url, raw_html=html)

        raise RuntimeError("Scraper client must implement fetch_html() or fetch_search_page()")

    def scrape_page(self, base_url: str, page: int) -> ScrapePageResult:
        page_url = self.build_page_url(base_url, page)
        artifact = self._fetch_artifact(page_url)

        if artifact.status != FetchStatus.SUCCESS:
            logger.warning("Fetch status=%s for page=%s url=%s", artifact.status.value, page, page_url)
            return ScrapePageResult(page=page, url=page_url, listings=[], fetch_status=artifact.status.value)

        payload = parse_search_payload(artifact)
        if (self.ingestion_mode == "json_only" or not self.allow_html_fallback) and payload.source == "html_fallback":
            logger.warning("JSON-only mode rejected HTML fallback for page=%s url=%s", page, page_url)
            listings: list[dict] = []
        else:
            listings = payload.listings

        if self.ingestion_mode == "html_only" and payload.source != "html_fallback":
            # Force legacy html parser path in html-only mode.
            listings = parse_search_results_fallback(artifact.raw_html or "")

        return ScrapePageResult(
            page=page,
            url=page_url,
            listings=listings,
            fetch_status=artifact.status.value,
        )

    def scrape_all_listings(self, base_url: str, max_pages: Optional[int] = None) -> tuple[list[dict], int]:
        upper_bound = max_pages if max_pages is not None else self.max_pages
        if upper_bound < 1:
            raise ValueError("max_pages must be >= 1")

        all_listings: list[dict] = []
        seen_ids: set[int] = set()
        pages_with_results = 0
        first_page_size: Optional[int] = None

        for page in range(1, upper_bound + 1):
            page_result = self.scrape_page(base_url, page)
            page_listings = page_result.listings

            if page_result.fetch_status == "blocked":
                logger.warning("Stopping pagination due to block at page=%s", page)
                break

            if not page_listings:
                logger.info("Stopping pagination at page=%s (empty page)", page)
                break

            pages_with_results += 1

            for listing in page_listings:
                listing_id = listing.get("listing_id")
                if isinstance(listing_id, int) and listing_id in seen_ids:
                    continue
                if isinstance(listing_id, int):
                    seen_ids.add(listing_id)
                all_listings.append(listing)

            if first_page_size is None:
                first_page_size = len(page_listings)
            elif first_page_size > 0 and len(page_listings) < first_page_size:
                logger.info(
                    "Stopping pagination at page=%s (%s < %s)",
                    page,
                    len(page_listings),
                    first_page_size,
                )
                break

        return all_listings, pages_with_results
