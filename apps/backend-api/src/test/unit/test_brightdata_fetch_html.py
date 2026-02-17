import sys
import unittest
from pathlib import Path
from unittest.mock import patch

import requests

sys.path.append(str(Path(__file__).resolve().parents[2]))

from scraper.integrations.brightdata.brightdata import BrightDataClient  # type: ignore  # noqa: E402


class _FakeResponse:
    def __init__(
        self,
        *,
        status_code: int = 200,
        text: str = "",
        headers: dict | None = None,
        json_data=None,
        url: str = "https://api.brightdata.com/request",
    ) -> None:
        self.status_code = status_code
        self.text = text
        self.headers = headers or {"content-type": "application/json"}
        self._json_data = json_data
        self.url = url

    def raise_for_status(self) -> None:
        if self.status_code >= 400:
            raise requests.HTTPError(f"HTTP {self.status_code}")

    def json(self):
        if self._json_data is None:
            raise ValueError("no json")
        return self._json_data


class BrightDataFetchHtmlTests(unittest.TestCase):
    @patch("scraper.integrations.brightdata.brightdata.requests.get")
    @patch("scraper.integrations.brightdata.brightdata.requests.post")
    def test_retries_with_render_true_after_empty_direct_response(self, mock_post, mock_get) -> None:
        client = BrightDataClient(api_key="token", zone="zone")

        mock_post.side_effect = [
            _FakeResponse(json_data={}),
            _FakeResponse(json_data={"body": "<html><body>ok</body></html>"}),
        ]

        html = client.fetch_html("https://example.com/search", render=False)

        self.assertIn("<html>", html)
        self.assertEqual(mock_post.call_count, 2)
        self.assertEqual(mock_get.call_count, 0)

        first_payload = mock_post.call_args_list[0].kwargs["json"]
        second_payload = mock_post.call_args_list[1].kwargs["json"]
        self.assertFalse(first_payload["render"])
        self.assertTrue(second_payload["render"])

    @patch("scraper.integrations.brightdata.brightdata.requests.get")
    @patch("scraper.integrations.brightdata.brightdata.requests.post")
    def test_falls_back_to_async_submit_and_poll(self, mock_post, mock_get) -> None:
        client = BrightDataClient(api_key="token", zone="zone")

        mock_post.side_effect = [
            _FakeResponse(json_data={}),
            _FakeResponse(json_data={}),
            _FakeResponse(json_data={}),
            _FakeResponse(json_data={}),
            _FakeResponse(json_data={"request_id": "req-123"}),
        ]
        mock_get.return_value = _FakeResponse(
            json_data={"status": "done", "response": {"body": "<html><body>from-poll</body></html>"}}
        )

        html = client.fetch_html("https://example.com/search", render=False)

        self.assertIn("from-poll", html)
        self.assertEqual(mock_post.call_count, 5)
        self.assertEqual(mock_get.call_count, 1)
        self.assertTrue(mock_post.call_args_list[4].args[0].endswith("/request?async=true"))

    @patch("scraper.integrations.brightdata.brightdata.requests.get")
    @patch("scraper.integrations.brightdata.brightdata.requests.post")
    def test_continues_after_400_on_one_variant(self, mock_post, mock_get) -> None:
        client = BrightDataClient(api_key="token", zone="zone")

        mock_post.side_effect = [
            _FakeResponse(json_data={}),
            _FakeResponse(json_data={}),
            _FakeResponse(
                status_code=400,
                text='{"error":"validation","details":[{"message":"format required"}]}',
                json_data={"error": "validation"},
            ),
            _FakeResponse(json_data={"body": "<html><body>ok-after-400</body></html>"}),
        ]

        html = client.fetch_html("https://example.com/search", render=False)

        self.assertIn("ok-after-400", html)
        self.assertEqual(mock_post.call_count, 4)
        self.assertEqual(mock_get.call_count, 0)


if __name__ == "__main__":
    unittest.main()
