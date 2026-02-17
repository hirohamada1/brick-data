import sys
import unittest
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[2]))

from scraper.scraper import IS24SearchResultScraper  # type: ignore  # noqa: E402


SEARCH_URL = "https://www.immobilienscout24.de/Suche/de/baden-wuerttemberg/stuttgart/wohnung-kaufen?numberofrooms=4.0-&livingspace=-75.0&enteredFrom=result_list"

PAGE_1_HTML = """
<html><body><script>
{
  "resultlistEntries": [
    {
      "resultlistEntry": [
        {
          "realEstateId": 9001,
          "resultlist.realEstate": {
            "title": "Wohnung A",
            "livingSpace": 75,
            "price": {"value": 499000},
            "address": {"city": "Stuttgart", "postcode": "70173", "quarter": "Mitte"}
          }
        },
        {
          "realEstateId": 9002,
          "resultlist.realEstate": {
            "title": "Wohnung B",
            "livingSpace": 73,
            "price": {"value": 459000},
            "address": {"city": "Stuttgart", "postcode": "70174", "quarter": "West"}
          }
        }
      ]
    }
  ]
}
</script></body></html>
"""

PAGE_2_EMPTY_HTML = """
<html><body><script>
{"resultlistEntries":[{"resultlistEntry":[]}]}
</script></body></html>
"""


class _FakeClient:
    def __init__(self) -> None:
        self.urls: list[str] = []

    def fetch_html(self, url: str, render: bool = False) -> str:
        self.urls.append(url)
        if len(self.urls) == 1:
            return PAGE_1_HTML
        return PAGE_2_EMPTY_HTML


class IS24SearchScraperTests(unittest.TestCase):
    def test_scrape_all_listings_stops_on_empty_next_page(self) -> None:
        client = _FakeClient()
        scraper = IS24SearchResultScraper(client=client, max_pages=5)

        listings, pages = scraper.scrape_all_listings(SEARCH_URL)

        self.assertEqual(pages, 1)
        self.assertEqual(len(listings), 2)
        self.assertEqual(len(client.urls), 2)
        self.assertIn("pagenumber=1", client.urls[0].lower())
        self.assertIn("pagenumber=2", client.urls[1].lower())
        self.assertIn("numberofrooms=4.0-", client.urls[0])
        self.assertIn("livingspace=-75.0", client.urls[0])
        self.assertIn("enteredFrom=result_list", client.urls[0])


if __name__ == "__main__":
    unittest.main()
