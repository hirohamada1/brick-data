from __future__ import annotations
from dataclasses import dataclass
from typing import List, Optional

@dataclass
class SearchHit:
    source: str
    external_id: str
    expose_url: str
    title: str | None
    price_eur: float | None
    living_space_sqm: float | None
    rooms: float | None
    city: str | None
    postcode: str | None

class ImmoScoutSearchScraper:
    def __init__(self, brightdata_client):
        self.client = brightdata_client

    def fetch_search_html(self, search_url: str) -> str:
        return self.client.fetch_html(search_url, render=False)

    def scrape(self, search_url: str) -> List[SearchHit]:
        html = self.fetch_search_html(search_url)
        from scraper.mapping.immoscout_search_mapper import parse_search_hits
        return parse_search_hits(html)
