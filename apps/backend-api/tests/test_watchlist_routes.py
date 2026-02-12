import sys
import unittest
from pathlib import Path

from fastapi.testclient import TestClient

sys.path.append(str(Path(__file__).resolve().parents[1] / "src"))

import routes.watchlist as watchlist_routes  # type: ignore  # noqa: E402
from api import app  # type: ignore  # noqa: E402


class WatchlistRoutesTests(unittest.TestCase):
    def setUp(self):
        self._orig_create = watchlist_routes.create_watchlist
        watchlist_routes.create_watchlist = lambda **_kwargs: "wl-1"
        self.client = TestClient(app)

    def tearDown(self):
        watchlist_routes.create_watchlist = self._orig_create

    def test_create_watchlist_ok(self):
        payload = {
            "name": "Test",
            "search_url": "https://example.com/search",
            "defaults": {"notarkosten": 1.5},
        }
        resp = self.client.post("/api/watchlists", json=payload)
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.json(), {"id": "wl-1"})

    def test_create_watchlist_rejects_bad_url(self):
        payload = {
            "name": "Test",
            "search_url": "not-a-url",
            "defaults": {},
        }
        resp = self.client.post("/api/watchlists", json=payload)
        self.assertEqual(resp.status_code, 400)


if __name__ == "__main__":
    unittest.main()
