import sys
import unittest
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[2]))

from scraper.services.challenge_classifier import classify_challenge  # type: ignore  # noqa: E402


class ChallengeClassifierTests(unittest.TestCase):
    def test_classifies_static_deny(self) -> None:
        html = "<html><title>Ich bin kein Roboter - ImmobilienScout24</title></html>"
        result = classify_challenge(html, http_status=401)
        self.assertEqual(result.challenge_type, "static_deny")
        self.assertFalse(result.interactive)

    def test_classifies_recaptcha(self) -> None:
        html = '<div class="g-recaptcha" data-sitekey="abc"></div>'
        result = classify_challenge(html, http_status=200)
        self.assertEqual(result.challenge_type, "recaptcha_v2")
        self.assertTrue(result.interactive)

    def test_classifies_hcaptcha(self) -> None:
        html = '<script src="https://js.hcaptcha.com/1/api.js"></script>'
        result = classify_challenge(html, http_status=200)
        self.assertEqual(result.challenge_type, "hcaptcha")

    def test_classifies_turnstile(self) -> None:
        html = '<div class="cf-turnstile" data-sitekey="site"></div>'
        result = classify_challenge(html, http_status=200)
        self.assertEqual(result.challenge_type, "turnstile")

    def test_status_only_is_unknown(self) -> None:
        result = classify_challenge("<html></html>", http_status=403)
        self.assertEqual(result.challenge_type, "unknown")


if __name__ == "__main__":
    unittest.main()
