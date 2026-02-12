from __future__ import annotations

import re
from dataclasses import dataclass
from typing import List, Set

from scraper.integrations.brightdata.brightdata_client import BrightDataUnlockerClient

EXPOSE_ID_RE = re.compile(r"/expose/(\d+)", re.IGNORECASE)


@dataclass(frozen=True)
class ImmoScoutSearchScraper:
    client: BrightDataUnlockerClient

    def scrape_expose_ids(self, search_url: str) -> List[str]:
        html = self.client.fetch_html(search_url, render=False)
        ids: List[str] = []
        seen: Set[str] = set()

        for m in EXPOSE_ID_RE.finditer(html):
            expose_id = m.group(1)
            if expose_id not in seen:
                seen.add(expose_id)
                ids.append(expose_id)

        return ids
