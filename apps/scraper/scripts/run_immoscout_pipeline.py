import os
import asyncio
import sys

# Ensure apps/scraper/src is on sys.path when running this script directly.
_script_dir = os.path.dirname(os.path.abspath(__file__))
_scraper_src = os.path.abspath(os.path.join(_script_dir, "..", "src"))
if _scraper_src not in sys.path:
    sys.path.insert(0, _scraper_src)
from dotenv import load_dotenv
from integrations.brightdata.brightdata_async import BrightDataClient, BrightDataConfig
from scrapers.immoscout_search_scraper import ImmoScoutSearchScraper
from scrapers.immoscout_expose_scraper import ImmoScoutExposeScraper
from integrations.storage.l0_writer import from_env as l0_from_env
from integrations.storage.l1_upserter import from_env as l1_from_env

# Load .env from project root
base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv, find_dotenv

dotenv_path = find_dotenv(".env.local", usecwd=True)
if not dotenv_path:
    raise SystemExit("Could not find .env.local")

load_dotenv(dotenv_path, override=True)

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

    base_url = os.getenv("BRIGHTDATA_BASE_URL", "https://api.brightdata.com")
    client = BrightDataClient(cfg, base_url=base_url)
    search_scraper = ImmoScoutSearchScraper(client)
    expose_scraper = ImmoScoutExposeScraper(client)
    l0_writer = l0_from_env()
    l1_upserter = l1_from_env()

    search_url = "https://www.immobilienscout24.de/Suche/de/sachsen-anhalt/magdeburg/wohnung-kaufen"
    hits = await search_scraper.scrape(search_url)
    hits = hits[:3]

    print(f"Found {len(hits)} expose links")

    pool = SemaphorePool(5)  # start with 3-5; increase later carefully

    async def scrape_one(hit):
        listing = await expose_scraper.scrape(hit.external_id, hit.expose_url)
        l0_res = l0_writer.insert_expose(expose=listing)
        if not l0_res.id:
            print(f"L0 dedupe: external_id={listing.get('external_id')} hash={l0_res.raw_hash}")
            return None
        listing["latest_l0_id"] = l0_res.id
        l1_res = l1_upserter.upsert_listing(listing=listing)
        print(f"L0 inserted id={l0_res.id} L1 upserted id={l1_res.id}")
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
