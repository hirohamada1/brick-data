from __future__ import annotations
from dataclasses import dataclass
from typing import List, Optional

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
        from mapping.immoscout_search_mapper import parse_search_hits
        return parse_search_hits(html)