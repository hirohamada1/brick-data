from __future__ import annotations

import os
import unittest

from scripts.run_real_url_watchlist_test import main as run_real_test_main


class MobileRealUrlWatchlistRunIntegrationTests(unittest.TestCase):
    @unittest.skipUnless(
        os.getenv("RUN_REAL_URL_MOBILE_TEST") == "1",
        "Set RUN_REAL_URL_MOBILE_TEST=1 to run mobile backend real URL integration test",
    )
    def test_real_url_watchlist_run_mobile_backend(self) -> None:
        previous_backend = os.getenv("IS24_FETCH_BACKEND")
        previous_fallback = os.getenv("IS24_MOBILE_WEB_FALLBACK_ENABLED")
        os.environ["IS24_FETCH_BACKEND"] = "mobile"
        os.environ["IS24_MOBILE_WEB_FALLBACK_ENABLED"] = "false"
        try:
            # Reuse the existing smoke script so run semantics stay centralized.
            exit_code = run_real_test_main()
            self.assertEqual(exit_code, 0)
        finally:
            if previous_backend is None:
                os.environ.pop("IS24_FETCH_BACKEND", None)
            else:
                os.environ["IS24_FETCH_BACKEND"] = previous_backend
            if previous_fallback is None:
                os.environ.pop("IS24_MOBILE_WEB_FALLBACK_ENABLED", None)
            else:
                os.environ["IS24_MOBILE_WEB_FALLBACK_ENABLED"] = previous_fallback


if __name__ == "__main__":
    unittest.main()
