import sys
import unittest
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[1] / "src"))

import services.run_service as run_service  # type: ignore  # noqa: E402


class _FakeL1Result:
    def __init__(self, id="l1-1"):
        self.id = id


class _FakeL1Upserter:
    def __init__(self, *args, **kwargs):
        self.calls = []

    def upsert_listing(self, *, listing):
        self.calls.append(listing)
        return _FakeL1Result(id="l1-1")


class _FakeHit:
    def __init__(
        self,
        external_id,
        expose_url,
        title=None,
        price_eur=None,
        living_space_sqm=None,
        rooms=None,
        city=None,
        postcode=None,
    ):
        self.source = "immoscout"
        self.external_id = external_id
        self.expose_url = expose_url
        self.title = title
        self.price_eur = price_eur
        self.living_space_sqm = living_space_sqm
        self.rooms = rooms
        self.city = city
        self.postcode = postcode


class _RecordingRunService(run_service.RunService):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.status_updates = []
        self.link_calls = []
        self.seed_calls = []

    def _update_run_status(self, **kwargs):  # type: ignore[override]
        self.status_updates.append(kwargs)

    def _get_watchlist(self, watchlist_id):  # type: ignore[override]
        return {
            "id": watchlist_id,
            "user_id": "user-1",
            "name": "Watchlist A",
            "search_url": "https://example.com/search",
            "defaults": {
                "notarkosten": 1.5,
                "grunderwerbssteuer": 3.5,
                "grundbuchkosten": 0.5,
                "mietausfall": 3.0,
                "kaltmieteProQm": 12.0,
                "hausgeld": {"umlagefaehig": 50, "nichtUmlagefaehig": 25},
            },
        }

    def _link_listing_to_watchlist(self, **kwargs):  # type: ignore[override]
        self.link_calls.append(kwargs)
        return True

    def _seed_manual_inputs_if_missing(self, **kwargs):  # type: ignore[override]
        self.seed_calls.append(kwargs)
        return True


class RunServiceTests(unittest.TestCase):
    def setUp(self):
        self._orig_l1 = run_service.L1Upserter
        self._orig_get_client = run_service._get_brightdata_client
        self._orig_search = run_service._scrape_search_hits

        run_service.L1Upserter = _FakeL1Upserter
        run_service._get_brightdata_client = lambda: object()
        run_service._scrape_search_hits = lambda _url, client: [
            _FakeHit("e1", "https://example.com/expose/1", title="Listing 1", price_eur=100000, living_space_sqm=50, rooms=2, city="Test", postcode="12345"),
            _FakeHit("e2", "https://example.com/expose/2", title="Listing 2", price_eur=120000, living_space_sqm=60, rooms=3, city="Test", postcode="12345"),
        ]

    def tearDown(self):
        run_service.L1Upserter = self._orig_l1
        run_service._get_brightdata_client = self._orig_get_client
        run_service._scrape_search_hits = self._orig_search

    def test_run_watchlist_happy_path(self):
        service = _RecordingRunService(database_url="postgres://test")

        stats = service.run_watchlist("watch-1", "run-1")

        self.assertEqual(stats["total_hits"], 2)
        self.assertEqual(stats["scraped"], 2)
        self.assertEqual(stats["l0_inserted"], 0)
        self.assertEqual(stats["l1_upserted"], 2)
        self.assertEqual(stats["linked"], 2)
        self.assertEqual(stats["manual_inputs_seeded"], 0)

        self.assertEqual(service.status_updates[0]["status"], "running")
        self.assertEqual(service.status_updates[-1]["status"], "done")

    def test_run_watchlist_marks_failed_on_error(self):
        def _boom(*_args, **_kwargs):
            raise RuntimeError("boom")

        run_service._scrape_search_hits = _boom
        service = _RecordingRunService(database_url="postgres://test")

        with self.assertRaises(RuntimeError):
            service.run_watchlist("watch-1", "run-1")

        self.assertEqual(service.status_updates[0]["status"], "running")
        self.assertEqual(service.status_updates[-1]["status"], "failed")
        self.assertIn("boom", service.status_updates[-1]["error"])


if __name__ == "__main__":
    unittest.main()
