from __future__ import annotations

import argparse
import json

try:
    from src.scraper.is24_client import IS24Client
    from src.scraper.scraper import IS24SearchResultScraper
except Exception:  # pragma: no cover
    from scraper.is24_client import IS24Client  # type: ignore
    from scraper.scraper import IS24SearchResultScraper  # type: ignore


def main() -> int:
    parser = argparse.ArgumentParser(description="Manual IS24 scrape probe")
    parser.add_argument(
        "--url",
        default=(
            "https://www.immobilienscout24.de/Suche/de/baden-wuerttemberg/stuttgart/wohnung-kaufen"
            "?numberofrooms=4.0-&livingspace=-75.0&enteredFrom=result_list"
        ),
    )
    parser.add_argument("--max-pages", type=int, default=1)
    args = parser.parse_args()

    client = IS24Client()
    scraper = IS24SearchResultScraper(client=client, ingestion_mode="json_first")
    listings, pages = scraper.scrape_all_listings(args.url, max_pages=args.max_pages)
    report = {
        "url": args.url,
        "ingestion_mode": "json_first",
        "pages": pages,
        "listings_count": len(listings),
        "listings_preview": listings[:3],
    }
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
