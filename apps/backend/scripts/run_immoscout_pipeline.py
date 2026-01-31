import os
import asyncio
from dotenv import load_dotenv
from integrations.brightdata_async import BrightDataClient, BrightDataConfig
from scrapers.immoscout_search_scraper import ImmoScoutSearchScraper
from scrapers.immoscout_expose_scraper import ImmoScoutExposeScraper

# Load .env from project root
base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
load_dotenv(os.path.join(base_dir, ".env"))

# simple concurrency limiter
class SemaphorePool:
    def __init__(self, n: int):
        self.sem = asyncio.Semaphore(n)

    async def run(self, coro):
        async with self.sem:
            return await coro

async def main():
    cfg = BrightDataConfig(
        api_key=os.getenv("BRIGHTDATA_API_KEY", ""),
        zone=os.getenv("BRIGHTDATA_ZONE", "immo_scan1"),
        country=os.getenv("BRIGHTDATA_COUNTRY", "DE"),
        fmt=os.getenv("BRIGHTDATA_FORMAT", "raw"),
        poll_interval_ms=int(os.getenv("BRIGHTDATA_POLL_INTERVAL_MS", "1200")),
        max_poll_seconds=int(os.getenv("BRIGHTDATA_MAX_POLL_SECONDS", "60")),
    )
    
    if not cfg.api_key:
        raise SystemExit("Missing BRIGHTDATA_API_KEY in .env")

    client = BrightDataClient(cfg)
    search_scraper = ImmoScoutSearchScraper(client)
    expose_scraper = ImmoScoutExposeScraper(client)

    search_url = "https://www.immobilienscout24.de/Suche/de/sachsen-anhalt/magdeburg/wohnung-kaufen"
    hits = await search_scraper.scrape(search_url)
    hits = hits[:3]

    print(f"Found {len(hits)} expose links")

    pool = SemaphorePool(5)  # start with 3-5; increase later carefully

    async def scrape_one(hit):
        listing = await expose_scraper.scrape(hit.external_id, hit.expose_url)
        print(listing)
        return listing

    results = await asyncio.gather(*[
        pool.run(scrape_one(h)) for h in hits
    ], return_exceptions=True)

    # Optional: filter exceptions
    ok = []
    for r in results:
        if isinstance(r, Exception):
            print("ERROR:", repr(r))
        else:
            ok.append(r)

    print(f"Done. Success={len(ok)} / Total={len(hits)}")

if __name__ == "__main__":
    asyncio.run(main())
