import sys
import unittest
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[1] / "src"))

import services.watchlist_service as watchlist_service  # type: ignore  # noqa: E402


class _FakeCursor:
    def __init__(self, row=None):
        self._row = row
        self.last_query = None
        self.last_params = None

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, tb):
        return False

    def execute(self, query, params):
        self.last_query = query
        self.last_params = params

    def fetchone(self):
        return self._row


class _FakeConn:
    def __init__(self, row=None):
        self._row = row
        self.cursor_obj = _FakeCursor(row=row)

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, tb):
        return False

    def cursor(self):
        return self.cursor_obj


class _FakePsycopg2:
    def __init__(self, row=None):
        self._row = row
        self.last_conn = None

    def connect(self, _database_url):
        self.last_conn = _FakeConn(row=self._row)
        return self.last_conn


class _FakePgJson:
    def __init__(self, value):
        self.value = value


class WatchlistServiceTests(unittest.TestCase):
    def setUp(self):
        self._orig_psycopg2 = watchlist_service.psycopg2
        self._orig_pgjson = watchlist_service.PgJson

    def tearDown(self):
        watchlist_service.psycopg2 = self._orig_psycopg2
        watchlist_service.PgJson = self._orig_pgjson

    def test_create_watchlist_inserts_and_returns_id(self):
        watchlist_service.psycopg2 = _FakePsycopg2(row=("abc-123",))
        watchlist_service.PgJson = _FakePgJson
        service = watchlist_service.WatchlistService(database_url="postgres://test")

        watchlist_id = service.create_watchlist(
            name="Test",
            search_url="https://example.com",
            defaults={"hausgeld_monthly_eur": 100},
            user_id="user-1",
        )

        self.assertEqual(watchlist_id, "abc-123")
        cursor = watchlist_service.psycopg2.last_conn.cursor_obj
        self.assertIn("insert into", cursor.last_query.lower())
        self.assertEqual(cursor.last_params[0], "user-1")
        self.assertEqual(cursor.last_params[1], "Test")
        self.assertEqual(cursor.last_params[2], "https://example.com")
        self.assertIsInstance(cursor.last_params[3], _FakePgJson)

    def test_get_watchlist_returns_none_when_missing(self):
        watchlist_service.psycopg2 = _FakePsycopg2(row=None)
        service = watchlist_service.WatchlistService(database_url="postgres://test")

        result = service.get_watchlist("missing-id")

        self.assertIsNone(result)

    def test_get_watchlist_maps_row(self):
        row = (
            "id-1",
            "user-1",
            "Name",
            "https://example.com",
            {"k": "v"},
            "2026-02-01T10:00:00Z",
            "2026-02-01T12:00:00Z",
        )
        watchlist_service.psycopg2 = _FakePsycopg2(row=row)
        service = watchlist_service.WatchlistService(database_url="postgres://test")

        result = service.get_watchlist("id-1")

        self.assertEqual(result["id"], "id-1")
        self.assertEqual(result["user_id"], "user-1")
        self.assertEqual(result["name"], "Name")
        self.assertEqual(result["search_url"], "https://example.com")
        self.assertEqual(result["defaults"], {"k": "v"})

    def test_create_watchlist_validates_inputs(self):
        service = watchlist_service.WatchlistService(database_url="postgres://test")
        with self.assertRaises(ValueError):
            service.create_watchlist(name="", search_url="x", defaults={})
        with self.assertRaises(ValueError):
            service.create_watchlist(name="x", search_url="", defaults={})

    def test_get_watchlist_validates_inputs(self):
        service = watchlist_service.WatchlistService(database_url="postgres://test")
        with self.assertRaises(ValueError):
            service.get_watchlist("")


if __name__ == "__main__":
    unittest.main()
