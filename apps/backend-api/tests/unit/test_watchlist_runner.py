import sys
import unittest
from pathlib import Path
from typing import Any, Optional

sys.path.append(str(Path(__file__).resolve().parents[1] / "src"))

from pipelines.watchlist_runner import WatchlistRunner  # type: ignore  # noqa: E402


PAGE_1_HTML = """
<html><body><script>
{
  "resultlistEntries": [
    {
      "resultlistEntry": [
        {
          "realEstateId": 101,
          "@modification": "MODIFIED",
          "resultlist.realEstate": {
            "title": "Wohnung A neu",
            "livingSpace": 50,
            "price": {"value": 110000},
            "address": {"city": "Magdeburg", "postcode": "39104", "quarter": "Altstadt"}
          }
        },
        {
          "realEstateId": 202,
          "resultlist.realEstate": {
            "title": "Wohnung B",
            "livingSpace": 70,
            "price": {"value": 180000},
            "address": {"city": "Magdeburg", "postcode": "39106", "quarter": "Neue Neustadt"}
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
        self.calls: list[str] = []

    def build_page_url(self, base_url: str, page: int) -> str:
        sep = "&" if "?" in base_url else "?"
        return f"{base_url}{sep}pagenumber={page}"

    def fetch_search_page(self, url: str) -> str:
        self.calls.append(url)
        if len(self.calls) == 1:
            return PAGE_1_HTML
        return PAGE_2_EMPTY_HTML


class _FakeRepository:
    def __init__(self, schema: str = "sandbox") -> None:
        self.schema = schema
        self.load_calls: list[str] = []
        self.persist_calls: list[dict[str, Any]] = []

    def load_previous_snapshot(self, watchlist_id: str) -> dict[int, dict]:
        self.load_calls.append(watchlist_id)
        return {
            101: {
                "listing_id": 101,
                "title": "Wohnung A alt",
                "price_eur": 100000,
                "living_space_sqm": 50,
                "postcode": "39104",
                "city": "Magdeburg",
                "quarter": "Altstadt",
                "street": None,
                "house_number": None,
            },
            999: {
                "listing_id": 999,
                "title": "Entfallen",
                "price_eur": 80000,
                "living_space_sqm": 45,
                "postcode": "39108",
                "city": "Magdeburg",
                "quarter": "Stadtfeld",
                "street": None,
                "house_number": None,
            },
        }

    def persist_run_results(
        self,
        *,
        watchlist_id: str,
        user_id: Optional[str],
        current_listings: list[dict],
        deltas: dict,
    ) -> dict:
        self.persist_calls.append(
            {
                "watchlist_id": watchlist_id,
                "user_id": user_id,
                "current_listings": current_listings,
                "deltas": deltas,
            }
        )
        return {"upserted": len(current_listings), "linked": len(current_listings), "removed_links": len(deltas.get("removed_listing_ids", []))}


class WatchlistRunnerTests(unittest.TestCase):
    def test_runner_stops_pagination_and_persists_expected_counts(self) -> None:
        fake_client = _FakeClient()
        fake_repo = _FakeRepository(schema="sandbox")
        runner = WatchlistRunner(client=fake_client, repository=fake_repo, max_pages=10)

        summary = runner.run_watchlist(
            {
                "watchlist_id": "watch-1",
                "search_url": "https://www.immobilienscout24.de/Suche/de/sachsen-anhalt/magdeburg/wohnung-kaufen",
                "user_id": "user-1",
            }
        )

        self.assertEqual(len(fake_client.calls), 2)
        self.assertEqual(summary["watchlist_id"], "watch-1")
        self.assertEqual(summary["pages"], 1)
        self.assertEqual(summary["total"], 2)
        self.assertEqual(summary["new"], 1)
        self.assertEqual(summary["updated"], 1)
        self.assertEqual(summary["removed"], 1)

        self.assertEqual(fake_repo.load_calls, ["watch-1"])
        self.assertEqual(len(fake_repo.persist_calls), 1)
        persist_call = fake_repo.persist_calls[0]
        self.assertEqual(persist_call["watchlist_id"], "watch-1")
        self.assertEqual(persist_call["user_id"], "user-1")
        self.assertEqual(len(persist_call["current_listings"]), 2)
        self.assertEqual(len(persist_call["deltas"]["new_listings"]), 1)
        self.assertEqual(len(persist_call["deltas"]["updated_listings"]), 1)
        self.assertEqual(len(persist_call["deltas"]["removed_listing_ids"]), 1)

        # Unit-level sandbox assertion for DB orchestration layer.
        self.assertEqual(fake_repo.schema, "sandbox")

    def test_runner_rejects_non_sandbox_repository(self) -> None:
        runner = WatchlistRunner(client=_FakeClient(), repository=_FakeRepository(schema="public"))
        with self.assertRaises(RuntimeError):
            runner.run_watchlist(
                {
                    "watchlist_id": "watch-1",
                    "search_url": "https://www.immobilienscout24.de/Suche/de/sachsen-anhalt/magdeburg/wohnung-kaufen",
                }
            )


if __name__ == "__main__":
    unittest.main()
