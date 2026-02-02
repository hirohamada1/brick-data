from __future__ import annotations
import re
from typing import List
from scrapers.immoscout_search_scraper import SearchHit

_EXPOSE_RE = re.compile(r'href="(/expose/\d+)"')

def parse_search_hits(html: str) -> List[SearchHit]:
    seen = set()
    hits: List[SearchHit] = []

    for rel in _EXPOSE_RE.findall(html):
        # rel looks like "/expose/165145415"
        external_id = rel.split("/")[-1]
        expose_url = f"https://www.immobilienscout24.de{rel}"

        if external_id in seen:
            continue
        seen.add(external_id)

        hits.append(SearchHit(
            source="immoscout",
            external_id=external_id,
            expose_url=expose_url
        ))

    return hits