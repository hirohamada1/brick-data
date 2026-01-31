import requests

from __future__ import annotations
from typing import Dict, Any

from dataclasses import dataclass
from typing import List, Optional

class BrightDataClient:
    def __init__(self, api_key: str, zone: str):
        self.api_key = api_key
        self.zone = zone

    def fetch_html(self, url: str) -> str:
        response = requests.post(
            "https://api.brightdata.com/request",
            headers={
                "Authorization": f"Bearer {self.api_key}"
            },
            json={
                "zone": self.zone,
                "url": url,
                "format": "raw"
            },
            timeout=30
        )
        response.raise_for_status()
        return response.text


class ImmoScoutExposeScraper:
    def __init__(self, brightdata_client):
        self.client = brightdata_client

    async def fetch_expose_html(self, expose_url: str) -> str:
        return await self.client.fetch_html(expose_url)

    async def scrape(self, external_id: str, expose_url: str) -> Dict[str, Any]:
        html = await self.fetch_expose_html(expose_url)
        from app.mappers.immoscout_expose_mapper import map_expose_html_to_listing
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
        from app.mappers.immoscout_search_mapper import parse_search_hits
        return parse_search_hits(html)