import sys
import unittest
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[2]))

from scraper.models.listing_schema import FetchArtifact, FetchStatus  # type: ignore  # noqa: E402
from scraper.scraper import IS24SearchResultScraper  # type: ignore  # noqa: E402


SEARCH_URL = "https://www.immobilienscout24.de/Suche/de/baden-wuerttemberg/stuttgart/wohnung-kaufen"


class _BlockedClient:
    def fetch_search_page(self, url: str) -> FetchArtifact:
        return FetchArtifact(
            url=url,
            status=FetchStatus.BLOCKED,
            raw_html="<html>captcha</html>",
            challenge_type="recaptcha_v2",
            challenge_title="Verify",
        )


class _JsonClient:
    def __init__(self) -> None:
        self.calls = 0

    def fetch_search_page(self, url: str) -> dict:
        self.calls += 1
        if self.calls > 1:
            return {"url": url, "status": "success", "raw_html": "<html><script>{\"resultlistEntries\":[{\"resultlistEntry\":[]}]}</script></html>"}
        return {
            "url": url,
            "status": "success",
            "extracted_json_text": (
                '{"resultlistEntries":[{"resultlistEntry":[{"realEstateId":3001,'
                '"resultlist.realEstate":{"title":"JSON1","livingSpace":66,'
                '"price":{"value":333000},"address":{"city":"Berlin","postcode":"10115"}}}]}]}'
            ),
        }


class IS24ScraperFetchArtifactTests(unittest.TestCase):
    def test_scraper_stops_immediately_when_blocked(self) -> None:
        scraper = IS24SearchResultScraper(client=_BlockedClient(), max_pages=5)
        listings, pages = scraper.scrape_all_listings(SEARCH_URL)
        self.assertEqual(listings, [])
        self.assertEqual(pages, 0)

    def test_scraper_rejects_html_fallback_when_disabled(self) -> None:
        class _FallbackClient:
            def fetch_search_page(self, url: str) -> dict:
                return {
                    "url": url,
                    "status": "success",
                    "raw_html": (
                        "<html><body><script>"
                        "{resultlistEntries:[{resultlistEntry:[{realEstateId:999,"
                        "resultlist.realEstate:{title:'Fallback',livingSpace:70,"
                        "price:{value:380000},address:{city:'Leipzig',postcode:'04109'}}}]}]}"
                        "</script></body></html>"
                    ),
                }

        scraper = IS24SearchResultScraper(client=_FallbackClient(), max_pages=1, allow_html_fallback=False)
        listings, pages = scraper.scrape_all_listings(SEARCH_URL)
        self.assertEqual(listings, [])
        self.assertEqual(pages, 0)

    def test_scraper_accepts_dict_artifact_response(self) -> None:
        scraper = IS24SearchResultScraper(client=_JsonClient(), max_pages=3)
        listings, pages = scraper.scrape_all_listings(SEARCH_URL)
        self.assertEqual(pages, 1)
        self.assertEqual(len(listings), 1)
        self.assertEqual(listings[0]["external_id"], "3001")


if __name__ == "__main__":
    unittest.main()
