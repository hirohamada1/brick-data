# scraping/immoscout_search_scraper.py
from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Iterable, List, Set

from integrations.brightdata.brightdata_client import BrightDataUnlockerClient


EXPOSE_ID_RE = re.compile(r"/expose/(\d+)", re.IGNORECASE)


@dataclass(frozen=True)
class ImmoScoutSearchScraper:
    client: BrightDataUnlockerClient

    def scrape_expose_ids(self, search_url: str) -> List[str]:
        """
        Fetch search page HTML and extract unique expose IDs.
        MVP parsing strategy:
          - regex match for /expose/{id}
          - dedupe while preserving numeric ids
        """
        html = self.client.fetch_html(search_url, render=True)

        ids: List[str] = []
        seen: Set[str] = set()

        for m in EXPOSE_ID_RE.finditer(html):
            expose_id = m.group(1)
            if expose_id not in seen:
                seen.add(expose_id)
                ids.append(expose_id)

        return ids

def scrape_expose_ids(self, search_url: str) -> list[str]:
    html = self.client.fetch_html(search_url, render=True)

    logging.info(f"Search HTML length: {len(html)}")

    ids = list(dict.fromkeys(EXPOSE_ID_RE.findall(html)))
    return ids
