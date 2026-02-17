import sys
import unittest
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[2]))

from scraper.parser import parse_search_results  # type: ignore  # noqa: E402


FIXTURE_HTML = """
<html>
  <body>
    <script>
      window.__INITIAL_STATE__ = {
        "resultlistEntries": [
          {
            "resultlistEntry": [
              {
                "realEstateId": 1111,
                "@modification": "MODIFIED",
                "resultlist.realEstate": {
                  "title": "Grosse Wohnung Stuttgart",
                  "livingSpace": 74.5,
                  "price": {"value": 420000},
                  "address": {
                    "city": "Stuttgart",
                    "postcode": "70173",
                    "quarter": "Mitte"
                  }
                }
              },
              {
                "realEstateId": 2222,
                "resultlist.realEstate": {
                  "title": "Kapitalanlage Stuttgart",
                  "livingSpace": "70",
                  "price": {"value": "398000"},
                  "address": {
                    "street": "Beispielstrasse",
                    "houseNumber": "5",
                    "city": "Stuttgart",
                    "postcode": "70180",
                    "quarter": "Sued"
                  }
                }
              }
            ]
          }
        ]
      };
    </script>
  </body>
</html>
"""


class IS24SearchParserTests(unittest.TestCase):
    def test_parse_search_results_returns_normalized_listing_fields(self) -> None:
        listings = parse_search_results(FIXTURE_HTML)

        self.assertEqual(len(listings), 2)

        first = listings[0]
        self.assertEqual(first["listing_id"], 1111)
        self.assertEqual(first["title"], "Grosse Wohnung Stuttgart")
        self.assertEqual(first["living_space_sqm"], 74.5)
        self.assertEqual(first["price_eur"], 420000)
        self.assertEqual(first["street"], None)
        self.assertEqual(first["house_number"], None)
        self.assertEqual(first["city"], "Stuttgart")
        self.assertEqual(first["postcode"], "70173")
        self.assertEqual(first["quarter"], "Mitte")

        second = listings[1]
        self.assertEqual(second["listing_id"], 2222)
        self.assertEqual(second["street"], "Beispielstrasse")
        self.assertEqual(second["house_number"], "5")

    def test_parse_search_results_returns_empty_for_missing_embed(self) -> None:
        listings = parse_search_results("<html><body>No embedded data</body></html>")
        self.assertEqual(listings, [])


if __name__ == "__main__":
    unittest.main()
