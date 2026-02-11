from bs4 import BeautifulSoup
from typing import List
from scrapers.immoscout_search_scraper import SearchHit

def parse_search_hits(html: str) -> List[SearchHit]:
    soup = BeautifulSoup(html, "html.parser")
    hits: List[SearchHit] = []

    cards = soup.select("article[data-qa='result-list-entry']")

    print("CARDS FOUND:", len(cards))


    for card in cards:
        link = card.select_one("a[href*='/expose/']")
        if not link:
            continue

        href = link["href"]
        external_id = href.split("/")[-1]
        expose_url = f"https://www.immobilienscout24.de{href}"

        title = link.get_text(strip=True)

        price_el = card.select_one("[data-qa='price']")
        price = price_el.get_text(strip=True) if price_el else None

        sqm_el = card.select_one("[data-qa='living-space']")
        sqm = sqm_el.get_text(strip=True) if sqm_el else None

        rooms_el = card.select_one("[data-qa='rooms']")
        rooms = rooms_el.get_text(strip=True) if rooms_el else None

        hits.append({
            "external_id": external_id,
            "url": expose_url,
            "title": title,
            "price": price,
            "living_space": sqm,
            "rooms": rooms,
        })

    return hits