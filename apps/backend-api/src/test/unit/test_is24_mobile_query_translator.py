import sys
import unittest
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[2]))

from scraper.is24_mobile_query_translator import (  # type: ignore  # noqa: E402
    UnsupportedSearchError,
    translate_watchlist_to_mobile_search,
)


class IS24MobileQueryTranslatorTests(unittest.TestCase):
    def test_translates_structured_watchlist_fields_first(self) -> None:
        watchlist = {
            "location_path": "baden-wuerttemberg/stuttgart",
            "rooms_min": 4.0,
            "rooms_max": None,
            "area_min": None,
            "area_max": 75.0,
            "price_min": 250000,
            "price_max": 500000,
            "search_url": "https://www.immobilienscout24.de/Suche/de/baden-wuerttemberg/stuttgart/wohnung-kaufen",
        }

        translated = translate_watchlist_to_mobile_search(watchlist)

        self.assertEqual(translated.source, "structured_fields")
        self.assertFalse(translated.fallback_used)
        self.assertEqual(translated.search_params["searchType"], "region")
        self.assertEqual(translated.search_params["realestatetype"], "apartmentbuy")
        self.assertEqual(
            translated.search_params["geocodes"],
            "/de/baden-wuerttemberg/stuttgart",
        )
        self.assertEqual(translated.search_params["numberofrooms"], "4.0-")
        self.assertEqual(translated.search_params["livingspace"], "-75")
        self.assertEqual(translated.search_params["price"], "250000-500000")

    def test_falls_back_to_legacy_search_url(self) -> None:
        watchlist = {
            "location_path": None,
            "search_url": (
                "https://www.immobilienscout24.de/Suche/de/berlin/berlin/wohnung-kaufen"
                "?numberofrooms=3.0-&livingspace=50-90&price=150000-"
            ),
        }

        translated = translate_watchlist_to_mobile_search(watchlist)

        self.assertEqual(translated.source, "search_url")
        self.assertTrue(translated.fallback_used)
        self.assertEqual(translated.search_params["geocodes"], "/de/berlin/berlin")
        self.assertEqual(translated.search_params["numberofrooms"], "3.0-")
        self.assertEqual(translated.search_params["livingspace"], "50-90")
        self.assertEqual(translated.search_params["price"], "150000-")

    def test_falls_back_to_legacy_search_url_with_open_lower_bound(self) -> None:
        watchlist = {
            "location_path": None,
            "search_url": (
                "https://www.immobilienscout24.de/Suche/de/baden-wuerttemberg/stuttgart/wohnung-kaufen"
                "?numberofrooms=4.0-&livingspace=-80.0"
            ),
        }

        translated = translate_watchlist_to_mobile_search(watchlist)

        self.assertEqual(translated.source, "search_url")
        self.assertTrue(translated.fallback_used)
        self.assertEqual(
            translated.search_params["geocodes"],
            "/de/baden-wuerttemberg/stuttgart",
        )
        self.assertEqual(translated.search_params["numberofrooms"], "4.0-")
        self.assertEqual(translated.search_params["livingspace"], "-80.0")

    def test_rejects_unsupported_search_kind(self) -> None:
        watchlist = {
            "search_url": "https://www.immobilienscout24.de/Suche/de/berlin/berlin/haus-kaufen",
        }

        with self.assertRaises(UnsupportedSearchError):
            translate_watchlist_to_mobile_search(watchlist)


if __name__ == "__main__":
    unittest.main()
