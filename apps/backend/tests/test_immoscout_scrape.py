# scripts/test_immoscout_scrape.py
from __future__ import annotations

import os
import logging
print("DEBUG: Script started")
from pprint import pprint

from integrations.brightdata.brightdata_client import BrightDataConfig, BrightDataUnlockerClient
from integrations.brightdata.immoscout_search_scraper import ImmoScoutSearchScraper
from integrations.brightdata.immoscout_expose_scraper import ImmoScoutExposeScraper


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
)


def main() -> None:
    logging.info("Starting ImmoScout test scrape")

    bright_key = os.environ.get("BRIGHTDATA_API_KEY")
    if not bright_key:
        raise RuntimeError("BRIGHTDATA_API_KEY missing")

    bright_zone = os.environ.get("BRIGHTDATA_ZONE", "web_unlocker1")

    client = BrightDataUnlockerClient(
        BrightDataConfig(
            api_key=bright_key,
            zone=bright_zone,
            country="DE",
        )
    )

    search_url = (
        "https://www.immobilienscout24.de/Suche/de/"
        "sachsen-anhalt/magdeburg/wohnung-kaufen"
        "?sorting=2&enteredFrom=one_step_search"
    )

    search_scraper = ImmoScoutSearchScraper(client)
    expose_scraper = ImmoScoutExposeScraper(client)

    # ---- STEP 1: scrape expose IDs
    expose_ids = search_scraper.scrape_expose_ids(search_url)
    logging.info(f"Found {len(expose_ids)} expose IDs")

    # limit for test
    expose_ids = expose_ids[:3]
    logging.info(f"Testing first {len(expose_ids)} exposes: {expose_ids}")

    # ---- STEP 2: scrape exposes
    for expose_id in expose_ids:
        logging.info(f"Scraping expose {expose_id}")

        try:
            listing = expose_scraper.scrape_expose(expose_id)

            logging.info("Mapped Listing object:")
            pprint(listing.__dict__)  # or model_dump()

        except Exception as e:
            logging.exception(f"Expose {expose_id} failed: {e}")


if __name__ == "__main__":
    main()
