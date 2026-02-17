import sys
import unittest
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[2]))

from services.run_service import _build_l1_listing_from_search_hit  # type: ignore  # noqa: E402


class RunServiceSearchMappingTests(unittest.TestCase):
    def test_build_l1_listing_from_search_result_payload(self) -> None:
        search_hit = {
            "listing_id": 123456,
            "title": "4-Zimmer Wohnung Stuttgart",
            "living_space_sqm": 74.5,
            "price_eur": 420000,
            "street": None,
            "house_number": None,
            "city": "Stuttgart",
            "postcode": "70173",
            "quarter": "Mitte",
        }

        listing = _build_l1_listing_from_search_hit(search_hit)
        self.assertEqual(listing["source"], "immoscout")
        self.assertEqual(listing["external_id"], "123456")
        self.assertEqual(listing["url"], "https://www.immobilienscout24.de/expose/123456")
        self.assertEqual(listing["title"], "4-Zimmer Wohnung Stuttgart")
        self.assertEqual(listing["living_space_sqm"], 74.5)
        self.assertEqual(listing["price_eur"], 420000.0)
        self.assertEqual(listing["city"], "Stuttgart")
        self.assertEqual(listing["postcode"], "70173")
        self.assertEqual(listing["quarter"], "Mitte")


if __name__ == "__main__":
    unittest.main()
