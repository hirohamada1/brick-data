from __future__ import annotations
from typing import Dict, Any

class ImmoScoutExposeScraper:
    def __init__(self, brightdata_client):
        self.client = brightdata_client

    async def fetch_expose_html(self, expose_url: str) -> str:
        return await self.client.fetch_html(expose_url)

    async def scrape(self, external_id: str, expose_url: str) -> Dict[str, Any]:
        html = await self.fetch_expose_html(expose_url)
        from mapping.immoscout_expose_mapper import map_expose_html_to_listing
        return map_expose_html_to_listing(
            external_id=external_id,
            expose_url=expose_url,
            html=html,
        )