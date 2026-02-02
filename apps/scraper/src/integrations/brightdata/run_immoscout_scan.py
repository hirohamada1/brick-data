# scraping/run_immoscout_scan.py
from __future__ import annotations

import os
import json
import httpx
from dotenv import load_dotenv

from integrations.brightdata.brightdata_client import BrightDataConfig, BrightDataUnlockerClient
from integrations.brightdata.immoscout_search_scraper import ImmoScoutSearchScraper
from integrations.brightdata.immoscout_expose_scraper import ImmoScoutExposeScraper


def post_discord(webhook_url: str, payload: dict) -> None:
    # simple webhook message (you can format embeds later)
    content = "New listing:\n```json\n" + json.dumps(payload, ensure_ascii=False, indent=2)[:1800] + "\n```"
    with httpx.Client(timeout=20.0) as client:
        r = client.post(webhook_url, json={"content": content})
        r.raise_for_status()


def run() -> None:
    load_dotenv()
    
    # Optional: still allow override or check for existence
    if not os.getenv("BRIGHTDATA_API_KEY"):
         print("Warning: BRIGHTDATA_API_KEY not set in env")

    discord_webhook = os.environ.get("DISCORD_WEBHOOK_URL")

    # Config now defaults to loading from env
    client = BrightDataUnlockerClient(BrightDataConfig())

    search_url = os.getenv("IMMOSCOUT_SEARCH_URL")
    if not search_url:
        print("Error: IMMOSCOUT_SEARCH_URL not set.")
        return

    search_scraper = ImmoScoutSearchScraper(client=client)
    expose_scraper = ImmoScoutExposeScraper(client=client)

    expose_ids = search_scraper.scrape_expose_ids(search_url)
    expose_ids = expose_ids[:10]  # MVP test: only first 10

    print(f"Found {len(expose_ids)} expose IDs")

    for expose_id in expose_ids:
        try:
            listing, html = expose_scraper.scrape_expose(expose_id)

            # Convert your Listing model to dict — adapt based on your implementation
            listing_dict = listing.model_dump() if hasattr(listing, "model_dump") else listing.__dict__
            
            # Basic validation check
            is_valid = listing.price > 0 and listing.title and "ImmoScout Listing" not in listing.title
            
            if not is_valid:
                debug_path = f"debug/scraper/html/{expose_id}.html"
                os.makedirs(os.path.dirname(debug_path), exist_ok=True)
                with open(debug_path, "w") as f:
                    f.write(html)
                print(f"[INFO] Extraction seemed incomplete for {expose_id}, saved HTML to {debug_path}")

            if discord_webhook and is_valid:
                post_discord(discord_webhook, listing_dict)
            elif not is_valid:
                 print(f"Skipping Discord post for {expose_id} (incomplete extraction)")
            else:
                 print(f"Skipping Discord post for {expose_id} (no webhook set)")

        except Exception as e:
            print(f"[WARN] expose_id={expose_id} failed: {e}")


if __name__ == "__main__":
    run()
