import sys
import unittest
from pathlib import Path

import httpx

sys.path.append(str(Path(__file__).resolve().parents[2]))

from scraper.is24_mobile_client import (  # type: ignore  # noqa: E402
    IS24MobileClient,
    IS24MobileClientSettings,
    MobileApiError,
)


def _response(status_code: int, payload):
    request = httpx.Request("GET", "https://api.mobile.immobilienscout24.de")
    return httpx.Response(status_code=status_code, json=payload, request=request)


class _FakeHttpClient:
    def __init__(self, events):
        self._events = list(events)
        self.calls = []

    def request(self, method, url, params=None, json=None, headers=None):  # noqa: A002
        self.calls.append(
            {
                "method": method,
                "url": url,
                "params": dict(params or {}),
                "json": json,
                "headers": dict(headers or {}),
            }
        )
        event = self._events.pop(0)
        if isinstance(event, Exception):
            raise event
        return event


class IS24MobileClientTests(unittest.TestCase):
    def test_fetch_search_results_success(self) -> None:
        fake_http = _FakeHttpClient(
            [
                _response(200, {"total": 42}),
                _response(200, {"resultlistEntries": [{"resultlistEntry": []}]}),
            ]
        )
        client = IS24MobileClient(
            settings=IS24MobileClientSettings(max_retries=0),
            http_client=fake_http,
        )

        result = client.fetch_search_results(
            search_params={"searchType": "region", "geocodes": "/de/berlin/berlin"},
            page_number=2,
        )

        self.assertEqual(result.total, 42)
        self.assertEqual(result.endpoint_statuses["search_total"], 200)
        self.assertEqual(result.endpoint_statuses["search_list"], 200)
        self.assertEqual(fake_http.calls[1]["params"]["pagenumber"], "2")

    def test_retries_transport_error(self) -> None:
        fake_http = _FakeHttpClient(
            [
                httpx.TimeoutException("timeout"),
                _response(200, {"count": 1}),
                _response(200, {"resultlistEntries": [{"resultlistEntry": []}]}),
            ]
        )
        client = IS24MobileClient(
            settings=IS24MobileClientSettings(max_retries=1),
            http_client=fake_http,
        )

        result = client.fetch_search_results(
            search_params={"searchType": "region", "geocodes": "/de/berlin/berlin"},
            page_number=1,
        )

        self.assertEqual(result.total, 1)
        self.assertEqual(len(fake_http.calls), 3)

    def test_raises_for_non_object_list_payload(self) -> None:
        fake_http = _FakeHttpClient(
            [
                _response(200, {"total": 10}),
                _response(200, []),
            ]
        )
        client = IS24MobileClient(
            settings=IS24MobileClientSettings(max_retries=0),
            http_client=fake_http,
        )

        with self.assertRaises(MobileApiError):
            client.fetch_search_results(
                search_params={"searchType": "region", "geocodes": "/de/berlin/berlin"},
                page_number=1,
            )


if __name__ == "__main__":
    unittest.main()
