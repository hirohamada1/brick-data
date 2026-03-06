import sys
import unittest
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[2]))

from scraper.is24_mobile_mapper import normalize_mobile_search_payload  # type: ignore  # noqa: E402


class IS24MobileMapperTests(unittest.TestCase):
    def test_normalizes_result_list_items_shape(self) -> None:
        payload = {
            "resultListItems": [
                {
                    "type": "EXPOSE_RESULT",
                    "item": {
                        "id": "162901326",
                        "title": "Wohnung C",
                        "address": {"line": "Rohrackerstr. 73, 70329 Stuttgart / Hedelfingen, Hedelfingen"},
                        "attributes": [
                            {"value": "565.000 €"},
                            {"value": "78 m²"},
                            {"value": "4 Zi."},
                        ],
                    },
                },
                {
                    "type": "ADVERTISING_RESULT",
                    "item": {"id": "ad-1"},
                },
            ]
        }

        listings = normalize_mobile_search_payload(payload)

        self.assertEqual(len(listings), 1)
        first = listings[0]
        self.assertEqual(first["listing_id"], 162901326)
        self.assertEqual(first["external_id"], "162901326")
        self.assertEqual(first["price_eur"], 565000)
        self.assertEqual(first["living_space_sqm"], 78)
        self.assertEqual(first["rooms"], 4)
        self.assertEqual(first["postcode"], "70329")
        self.assertEqual(first["city"], "Stuttgart")
        self.assertEqual(first["quarter"], "Hedelfingen")
        self.assertEqual(first["street"], "Rohrackerstr.")
        self.assertEqual(first["house_number"], "73")
        self.assertEqual(first["expose_url"], "https://www.immobilienscout24.de/expose/162901326")

    def test_normalizes_resultlist_entries_and_skips_non_listings(self) -> None:
        payload = {
            "resultlistEntries": [
                {
                    "resultlistEntry": [
                        {
                            "realEstateId": 123456,
                            "resultlist.realEstate": {
                                "title": "Wohnung A",
                                "livingSpace": 72.5,
                                "numberOfRooms": 3,
                                "price": {"value": 410000},
                                "address": {
                                    "city": "Stuttgart",
                                    "postcode": "70173",
                                    "quarter": "Mitte",
                                },
                            },
                        },
                        {
                            "someAdUnit": True,
                        },
                    ]
                }
            ]
        }

        listings = normalize_mobile_search_payload(payload)

        self.assertEqual(len(listings), 1)
        first = listings[0]
        self.assertEqual(first["listing_id"], 123456)
        self.assertEqual(first["external_id"], "123456")
        self.assertEqual(first["title"], "Wohnung A")
        self.assertEqual(first["price_eur"], 410000)
        self.assertEqual(first["living_space_sqm"], 72.5)
        self.assertEqual(first["rooms"], 3)
        self.assertEqual(first["city"], "Stuttgart")
        self.assertEqual(first["postcode"], "70173")

    def test_normalizes_generic_results_shape(self) -> None:
        payload = {
            "results": [
                {
                    "id": "777",
                    "title": "Wohnung B",
                    "price": {"value": "250000"},
                    "livingSpace": "60",
                    "numberOfRooms": "2",
                    "address": {"postalCode": "10115", "addressLocality": "Berlin"},
                }
            ]
        }

        listings = normalize_mobile_search_payload(payload)

        self.assertEqual(len(listings), 1)
        self.assertEqual(listings[0]["external_id"], "777")
        self.assertEqual(listings[0]["city"], "Berlin")
        self.assertEqual(listings[0]["postcode"], "10115")


if __name__ == "__main__":
    unittest.main()
