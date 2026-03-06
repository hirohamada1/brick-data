import os
import sys
import unittest
from pathlib import Path
from unittest.mock import patch

sys.path.append(str(Path(__file__).resolve().parents[2]))

from scraper.is24_client import IS24ClientSettings  # type: ignore  # noqa: E402


class IS24ClientSettingsTests(unittest.TestCase):
    def test_provider_normalization_and_tls_env(self) -> None:
        with patch.dict(
            os.environ,
            {
                "BRIGHTDATA_PROVIDER": "brightdata_residential",
                "IS24_PROXY_SSL_VERIFY": "false",
                "IS24_PROXY_CA_BUNDLE": "/tmp/custom-ca.pem",
            },
            clear=False,
        ):
            settings = IS24ClientSettings.from_env()

        self.assertEqual(settings.provider, "residential_proxy")
        self.assertFalse(settings.proxy_ssl_verify)
        self.assertEqual(settings.proxy_ca_bundle, "/tmp/custom-ca.pem")


if __name__ == "__main__":
    unittest.main()
