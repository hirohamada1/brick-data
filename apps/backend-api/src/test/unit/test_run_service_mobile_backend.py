import os
import sys
import unittest
from pathlib import Path
from unittest.mock import patch

sys.path.append(str(Path(__file__).resolve().parents[2]))

import services.run_service as run_service  # type: ignore  # noqa: E402


class _FakeL1Result:
    def __init__(self, id="l1-1"):
        self.id = id


class _RecordingL1Upserter:
    def __init__(self, *args, **kwargs):
        self.calls = []

    def upsert_listing(self, *, listing):
        self.calls.append(listing)
        return _FakeL1Result(id="l1-1")


class _RunServiceNoDb(run_service.RunService):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.status_updates = []
        self.linked = []

    def _update_run_status(self, **kwargs):  # type: ignore[override]
        self.status_updates.append(kwargs)

    def _get_watchlist(self, watchlist_id):  # type: ignore[override]
        return {
            "id": watchlist_id,
            "user_id": "user-1",
            "name": "Watchlist A",
            "search_url": "https://www.immobilienscout24.de/Suche/de/berlin/berlin/wohnung-kaufen",
            "defaults": {},
            "location_label": "Berlin",
            "location_path": "berlin/berlin",
            "price_min": 100000.0,
            "price_max": None,
            "area_min": 30.0,
            "area_max": 80.0,
            "rooms_min": 2.0,
            "rooms_max": None,
        }

    def _link_listing_to_watchlist(self, **kwargs):  # type: ignore[override]
        self.linked.append(kwargs)
        return True


def _session_manager_stub():
    return type(
        "_SessionMgr",
        (),
        {
            "start_run_session": lambda self, watchlist_id, run_id: type(
                "_RunSession", (), {"session_id": "sess-1"}
            )()
        },
    )()


class RunServiceMobileBackendTests(unittest.TestCase):
    def test_uses_mobile_backend_for_pilot_watchlist_in_auto_mode(self) -> None:
        original = (
            run_service.L1Upserter,
            run_service._build_playwright_client,
            run_service._scrape_search_hits,
            run_service._build_mobile_client,
            run_service._scrape_search_hits_mobile,
            run_service.SessionManager,
        )
        try:
            run_service.L1Upserter = _RecordingL1Upserter
            run_service._build_playwright_client = lambda: (_ for _ in ()).throw(
                AssertionError("web client should not be used for mobile pilot")
            )
            run_service._scrape_search_hits = lambda *_args, **_kwargs: (_ for _ in ()).throw(
                AssertionError("web scraper should not be used for mobile pilot")
            )
            run_service._build_mobile_client = lambda: object()
            run_service._scrape_search_hits_mobile = lambda watchlist, client: (
                [
                    {
                        "listing_id": 123,
                        "title": "Mobile Listing",
                        "living_space_sqm": 60,
                        "price_eur": 300000,
                        "city": "Berlin",
                        "postcode": "10115",
                        "quarter": "Mitte",
                    }
                ],
                {
                    "endpoint_statuses": {"search_total": 200, "search_list": 200},
                    "translator_source": "structured_fields",
                    "fallback_used": False,
                    "mobile_total": 1,
                },
            )
            run_service.SessionManager = _session_manager_stub  # type: ignore[assignment]

            with patch.dict(
                os.environ,
                {
                    "IS24_FETCH_BACKEND": "auto",
                    "IS24_MOBILE_PILOT_WATCHLIST_IDS": "watch-1",
                },
                clear=False,
            ):
                svc = _RunServiceNoDb(
                    database_url="postgres://test",
                    db_schema="sandbox",
                    watchlists_schema="public",
                )
                stats = svc.run_watchlist("watch-1", "run-1")
        finally:
            (
                run_service.L1Upserter,
                run_service._build_playwright_client,
                run_service._scrape_search_hits,
                run_service._build_mobile_client,
                run_service._scrape_search_hits_mobile,
                run_service.SessionManager,
            ) = original

        self.assertEqual(stats["total_hits"], 1)
        self.assertEqual(stats["l1_upserted"], 1)
        fetch = stats.get("fetch", {})
        self.assertEqual(fetch.get("backend"), "mobile_api")
        self.assertEqual(fetch.get("provider"), "mobile_api")
        self.assertEqual(fetch.get("translator_source"), "structured_fields")
        self.assertEqual(fetch.get("endpoint_statuses", {}).get("search_list"), 200)
        self.assertFalse(fetch.get("fallback_used"))

    def test_mobile_backend_falls_back_to_web_when_enabled(self) -> None:
        original = (
            run_service.L1Upserter,
            run_service._build_playwright_client,
            run_service._scrape_search_hits,
            run_service._build_mobile_client,
            run_service._scrape_search_hits_mobile,
            run_service.SessionManager,
        )
        try:
            run_service.L1Upserter = _RecordingL1Upserter
            run_service._build_playwright_client = lambda: object()
            run_service._scrape_search_hits = lambda *_args, **_kwargs: [
                {
                    "listing_id": 999,
                    "title": "Web Fallback Listing",
                    "living_space_sqm": 75,
                    "price_eur": 350000,
                    "city": "Berlin",
                    "postcode": "10117",
                    "quarter": "Mitte",
                }
            ]
            run_service._build_mobile_client = lambda: object()

            def _boom_mobile(*_args, **_kwargs):
                raise RuntimeError("mobile_api_http_error:/search/list status=503")

            run_service._scrape_search_hits_mobile = _boom_mobile
            run_service.SessionManager = _session_manager_stub  # type: ignore[assignment]

            with patch.dict(
                os.environ,
                {
                    "IS24_FETCH_BACKEND": "mobile",
                    "IS24_MOBILE_WEB_FALLBACK_ENABLED": "true",
                },
                clear=False,
            ):
                svc = _RunServiceNoDb(
                    database_url="postgres://test",
                    db_schema="sandbox",
                    watchlists_schema="public",
                )
                stats = svc.run_watchlist("watch-1", "run-1")
        finally:
            (
                run_service.L1Upserter,
                run_service._build_playwright_client,
                run_service._scrape_search_hits,
                run_service._build_mobile_client,
                run_service._scrape_search_hits_mobile,
                run_service.SessionManager,
            ) = original

        self.assertEqual(stats["total_hits"], 1)
        self.assertEqual(stats["l1_upserted"], 1)
        fetch = stats.get("fetch", {})
        self.assertTrue(fetch.get("fallback_used"))
        self.assertEqual(fetch.get("backend"), "mobile_api_with_web_fallback")
        self.assertEqual(fetch.get("provider"), "playwright")

    def test_mobile_backend_without_fallback_marks_run_failed(self) -> None:
        original = (
            run_service.L1Upserter,
            run_service._build_playwright_client,
            run_service._scrape_search_hits,
            run_service._build_mobile_client,
            run_service._scrape_search_hits_mobile,
            run_service.SessionManager,
        )
        try:
            run_service.L1Upserter = _RecordingL1Upserter
            run_service._build_playwright_client = lambda: object()
            run_service._scrape_search_hits = lambda *_args, **_kwargs: []
            run_service._build_mobile_client = lambda: object()
            run_service._scrape_search_hits_mobile = (
                lambda *_args, **_kwargs: (_ for _ in ()).throw(
                    RuntimeError("mobile_api_http_error:/search/list status=401")
                )
            )
            run_service.SessionManager = _session_manager_stub  # type: ignore[assignment]

            with patch.dict(
                os.environ,
                {
                    "IS24_FETCH_BACKEND": "mobile",
                    "IS24_MOBILE_WEB_FALLBACK_ENABLED": "false",
                },
                clear=False,
            ):
                svc = _RunServiceNoDb(
                    database_url="postgres://test",
                    db_schema="sandbox",
                    watchlists_schema="public",
                )
                with self.assertRaises(RuntimeError):
                    svc.run_watchlist("watch-1", "run-1")
        finally:
            (
                run_service.L1Upserter,
                run_service._build_playwright_client,
                run_service._scrape_search_hits,
                run_service._build_mobile_client,
                run_service._scrape_search_hits_mobile,
                run_service.SessionManager,
            ) = original

        self.assertEqual(svc.status_updates[-1]["status"], "failed")
        self.assertTrue(str(svc.status_updates[-1]["error"]).startswith("fetch.mobile_api:"))


if __name__ == "__main__":
    unittest.main()
