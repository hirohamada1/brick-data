import sys
import unittest
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[1] / "src"))

from services.delta_detector import compute_deltas  # type: ignore  # noqa: E402


class DeltaDetectorTests(unittest.TestCase):
    def test_unchanged_listing_has_no_update(self) -> None:
        previous = {
            101: {
                "listing_id": 101,
                "title": "Wohnung A",
                "price_eur": 100000,
                "living_space_sqm": 50,
                "postcode": "39104",
                "city": "Magdeburg",
                "quarter": "Altstadt",
            }
        }
        current = [
            {
                "listing_id": 101,
                "title": "Wohnung A",
                "price_eur": 100000,
                "living_space_sqm": 50,
                "postcode": "39104",
                "city": "Magdeburg",
                "quarter": "Altstadt",
                "street": None,
                "house_number": None,
            }
        ]

        deltas = compute_deltas(previous, current)
        self.assertEqual(deltas["new_listings"], [])
        self.assertEqual(deltas["updated_listings"], [])
        self.assertEqual(deltas["removed_listing_ids"], [])

    def test_changed_price_and_new_listing_are_detected(self) -> None:
        previous = {
            101: {
                "listing_id": 101,
                "title": "Wohnung A",
                "price_eur": 100000,
                "living_space_sqm": 50,
                "postcode": "39104",
                "city": "Magdeburg",
                "quarter": "Altstadt",
            }
        }
        current = [
            {
                "listing_id": 101,
                "title": "Wohnung A",
                "price_eur": 110000,
                "living_space_sqm": 50,
                "postcode": "39104",
                "city": "Magdeburg",
                "quarter": "Altstadt",
                "street": None,
                "house_number": None,
            },
            {
                "listing_id": 202,
                "title": "Wohnung B",
                "price_eur": 190000,
                "living_space_sqm": 72,
                "postcode": "39106",
                "city": "Magdeburg",
                "quarter": "Neue Neustadt",
                "street": None,
                "house_number": None,
            },
        ]

        deltas = compute_deltas(previous, current)

        self.assertEqual(len(deltas["new_listings"]), 1)
        self.assertEqual(deltas["new_listings"][0]["listing_id"], 202)

        self.assertEqual(len(deltas["updated_listings"]), 1)
        updated = deltas["updated_listings"][0]
        self.assertEqual(updated["listing_id"], 101)
        self.assertIn("price_eur", updated["changes"])
        self.assertEqual(updated["changes"]["price_eur"]["previous"], 100000)
        self.assertEqual(updated["changes"]["price_eur"]["current"], 110000)
        self.assertEqual(deltas["removed_listing_ids"], [])


if __name__ == "__main__":
    unittest.main()
