import os
import sys
import unittest
from pathlib import Path
from unittest.mock import patch

sys.path.append(str(Path(__file__).resolve().parents[2]))

import services.run_service as run_service  # type: ignore  # noqa: E402
from scraper.models.listing_schema import FetchArtifact, FetchStatus  # type: ignore  # noqa: E402


class _FakeL1Result:
    def __init__(self, id="l1-1"):
        self.id = id


class _RecordingL1Upserter:
    def __init__(self, *args, **kwargs):
        self.calls = []
        self.kwargs = kwargs

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
            "search_url": "https://example.com/search",
            "defaults": {},
        }

    def _link_listing_to_watchlist(self, **kwargs):  # type: ignore[override]
        self.linked.append(kwargs)
        return True


class RunServiceSchemaAndValidationTests(unittest.TestCase):
    def test_from_env_qualifies_tables_with_db_schema_and_public_watchlists(self) -> None:
        with patch.dict(
            os.environ,
            {
                "DATABASE_URL": "postgres://test",
                "DB_SCHEMA": "sandbox",
            },
            clear=False,
        ):
            svc = run_service.from_env()

        self.assertEqual(svc.runs_table, "sandbox.watchlist_runs")
        self.assertEqual(svc.watchlist_listings_table, "sandbox.watchlist_listings")
        self.assertEqual(svc.l1_table, "sandbox.l1_listings")
        self.assertEqual(svc.watchlists_table, "public.watchlists")

    def test_run_watchlist_skips_invalid_required_fields(self) -> None:
        orig_l1 = run_service.L1Upserter
        orig_get_client = run_service._build_playwright_client
        orig_scrape = run_service._scrape_search_hits
        orig_session_manager = run_service.SessionManager
        try:
            run_service.L1Upserter = _RecordingL1Upserter
            run_service._build_playwright_client = lambda: object()
            run_service.SessionManager = lambda: type(  # type: ignore[assignment]
                "_SessionMgr",
                (),
                {
                    "start_run_session": lambda self, watchlist_id, run_id: type(
                        "_RunSession", (), {"session_id": "sess-1"}
                    )()
                },
            )()
            run_service._scrape_search_hits = lambda _url, client, **kwargs: [
                {
                    "listing_id": 123,
                    "title": "Valid Listing",
                    "living_space_sqm": 70,
                    "price_eur": 300000,
                    "city": "Stuttgart",
                    "postcode": "70173",
                    "quarter": "Mitte",
                },
                {
                    "listing_id": 456,
                    "title": None,
                    "living_space_sqm": 55,
                    "price_eur": 210000,
                    "city": "Stuttgart",
                    "postcode": "70173",
                    "quarter": "Mitte",
                },
            ]

            svc = _RunServiceNoDb(
                database_url="postgres://test",
                db_schema="sandbox",
                watchlists_schema="public",
            )
            stats = svc.run_watchlist("watch-1", "run-1")
        finally:
            run_service.L1Upserter = orig_l1
            run_service._build_playwright_client = orig_get_client
            run_service._scrape_search_hits = orig_scrape
            run_service.SessionManager = orig_session_manager

        self.assertEqual(stats["total_hits"], 2)
        self.assertEqual(stats["scraped"], 2)
        self.assertEqual(stats["l1_upserted"], 1)
        self.assertEqual(stats["linked"], 1)
        self.assertEqual(stats["invalid_mapped"], 1)
        self.assertEqual(stats["invalid_reasons"].get("title"), 1)

    def test_run_watchlist_classifies_reject_block_error(self) -> None:
        orig_l1 = run_service.L1Upserter
        orig_get_client = run_service._build_playwright_client
        orig_scrape = run_service._scrape_search_hits
        orig_session_manager = run_service.SessionManager
        try:
            run_service.L1Upserter = _RecordingL1Upserter
            run_service._build_playwright_client = lambda: object()
            run_service.SessionManager = lambda: type(  # type: ignore[assignment]
                "_SessionMgr",
                (),
                {
                    "start_run_session": lambda self, watchlist_id, run_id: type(
                        "_RunSession", (), {"session_id": "sess-1"}
                    )()
                },
            )()
            run_service._scrape_search_hits = lambda _url, client, **kwargs: (_ for _ in ()).throw(
                RuntimeError("code=reject_block")
            )

            svc = _RunServiceNoDb(
                database_url="postgres://test",
                db_schema="sandbox",
                watchlists_schema="public",
            )
            with self.assertRaises(RuntimeError):
                svc.run_watchlist("watch-1", "run-1")
        finally:
            run_service.L1Upserter = orig_l1
            run_service._build_playwright_client = orig_get_client
            run_service._scrape_search_hits = orig_scrape
            run_service.SessionManager = orig_session_manager

        self.assertEqual(svc.status_updates[-1]["status"], "failed")
        self.assertTrue(str(svc.status_updates[-1]["error"]).startswith("fetch.reject_block:"))

    def test_run_watchlist_records_captcha_stats_from_last_artifact(self) -> None:
        class _FakeClient:
            def __init__(self):
                self.last_artifacts = [
                    FetchArtifact(
                        url="https://example.com",
                        status=FetchStatus.SUCCESS,
                        challenge_type="turnstile",
                        challenge_title="Verification",
                        captcha_attempted=1,
                        captcha_solved=True,
                        captcha_task_id=321,
                        captcha_cost=0.003,
                    )
                ]

        orig_l1 = run_service.L1Upserter
        orig_get_client = run_service._build_playwright_client
        orig_scrape = run_service._scrape_search_hits
        orig_session_manager = run_service.SessionManager
        try:
            run_service.L1Upserter = _RecordingL1Upserter
            run_service._build_playwright_client = lambda: _FakeClient()
            run_service.SessionManager = lambda: type(  # type: ignore[assignment]
                "_SessionMgr",
                (),
                {
                    "start_run_session": lambda self, watchlist_id, run_id: type(
                        "_RunSession", (), {"session_id": "sess-1"}
                    )()
                },
            )()
            run_service._scrape_search_hits = lambda _url, client, **kwargs: [
                {
                    "listing_id": 123,
                    "title": "Valid Listing",
                    "living_space_sqm": 70,
                    "price_eur": 300000,
                    "city": "Stuttgart",
                    "postcode": "70173",
                    "quarter": "Mitte",
                }
            ]

            svc = _RunServiceNoDb(
                database_url="postgres://test",
                db_schema="sandbox",
                watchlists_schema="public",
            )
            stats = svc.run_watchlist("watch-1", "run-1")
        finally:
            run_service.L1Upserter = orig_l1
            run_service._build_playwright_client = orig_get_client
            run_service._scrape_search_hits = orig_scrape
            run_service.SessionManager = orig_session_manager

        fetch_stats = stats.get("fetch", {})
        self.assertEqual(fetch_stats.get("challenge_type"), "turnstile")
        captcha_stats = fetch_stats.get("captcha", {})
        self.assertEqual(captcha_stats.get("attempted"), 1)
        self.assertEqual(captcha_stats.get("solved"), 1)

    def test_resolve_ingestion_mode_disables_html_fallback(self) -> None:
        with patch.dict(
            os.environ,
            {
                "IS24_INGESTION_MODE": "json_first",
                "IS24_HTML_FALLBACK_ENABLED": "false",
            },
            clear=False,
        ):
            mode = run_service._resolve_ingestion_mode()
        self.assertEqual(mode, "json_only")


if __name__ == "__main__":
    unittest.main()
