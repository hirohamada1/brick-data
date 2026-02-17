from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import Any, Optional
from urllib.parse import parse_qsl, urlencode, urlparse, urlunparse

from scraper.parser import parse_search_results

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class ScrapePageResult:
    page: int
    url: str
    listings: list[dict]


@dataclass
class IS24SearchResultScraper:
    """
    Scrapes ImmoScout24 search result pages via a BrightData-compatible client.

    Required client API:
      fetch_html(url: str, render: bool = False) -> str
    """

    client: Any
    max_pages: int = 50

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

    def scrape_page(self, base_url: str, page: int) -> ScrapePageResult:
        page_url = self.build_page_url(base_url, page)
        html = self.client.fetch_html(page_url, render=False)
        listings = parse_search_results(html)
        return ScrapePageResult(page=page, url=page_url, listings=listings)

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
