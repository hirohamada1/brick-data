from __future__ import annotations

import os
import unittest

from scripts.run_real_url_watchlist_test import main as run_real_test_main


class RealUrlWatchlistRunIntegrationTests(unittest.TestCase):
    @unittest.skipUnless(
        os.getenv("RUN_REAL_URL_TEST") == "1",
        "Set RUN_REAL_URL_TEST=1 to run real URL integration test",
    )
    def test_real_url_watchlist_run(self) -> None:
        # Reuse the smoke script entrypoint so there is one source of truth.
        exit_code = run_real_test_main()
        self.assertEqual(exit_code, 0)


if __name__ == "__main__":
    unittest.main()
