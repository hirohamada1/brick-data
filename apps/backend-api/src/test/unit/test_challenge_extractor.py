import sys
import unittest
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[2]))

from scraper.services.challenge_extractor import (  # type: ignore  # noqa: E402
    build_2captcha_task,
    extract_challenge_spec,
)


class ChallengeExtractorTests(unittest.TestCase):
    def test_extracts_recaptcha_spec_and_task(self) -> None:
        html = '<div class="g-recaptcha" data-sitekey="recaptcha_key"></div>'
        spec = extract_challenge_spec(
            html=html,
            page_url="https://example.com",
            challenge_type="recaptcha_v2",
            user_agent="UA",
        )
        self.assertIsNotNone(spec)
        assert spec is not None
        self.assertEqual(spec.website_key, "recaptcha_key")
        task = build_2captcha_task(spec)
        self.assertEqual(task["type"], "RecaptchaV2TaskProxyless")
        self.assertEqual(task["websiteKey"], "recaptcha_key")

    def test_extracts_hcaptcha_with_rqdata(self) -> None:
        html = '<div class="h-captcha" data-sitekey="h_key"></div><script>var rqdata="rq_123";</script>'
        spec = extract_challenge_spec(
            html=html,
            page_url="https://example.com",
            challenge_type="hcaptcha",
            user_agent=None,
        )
        self.assertIsNotNone(spec)
        assert spec is not None
        task = build_2captcha_task(spec)
        self.assertEqual(task["type"], "HCaptchaTaskProxyless")
        self.assertEqual(task["enterprisePayload"]["rqdata"], "rq_123")

    def test_extracts_turnstile_action_data_pagedata(self) -> None:
        html = (
            '<div class="cf-turnstile" data-sitekey="ts_key" data-action="managed" '
            'data-cdata="abc" data-pagedata="pg"></div>'
        )
        spec = extract_challenge_spec(
            html=html,
            page_url="https://example.com",
            challenge_type="turnstile",
            user_agent=None,
        )
        self.assertIsNotNone(spec)
        assert spec is not None
        task = build_2captcha_task(spec)
        self.assertEqual(task["type"], "TurnstileTaskProxyless")
        self.assertEqual(task["action"], "managed")
        self.assertEqual(task["data"], "abc")
        self.assertEqual(task["pagedata"], "pg")

    def test_returns_none_for_non_interactive(self) -> None:
        html = "<html><body>Ich bin kein Roboter</body></html>"
        spec = extract_challenge_spec(
            html=html,
            page_url="https://example.com",
            challenge_type="static_deny",
            user_agent=None,
        )
        self.assertIsNone(spec)


if __name__ == "__main__":
    unittest.main()
