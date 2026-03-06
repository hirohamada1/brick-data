import sys
import unittest
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[2]))

from scraper.services.captcha_solver_client import (  # type: ignore  # noqa: E402
    CaptchaSolverClient,
    CaptchaSolverError,
    SolverConfig,
)


class _FakeResponse:
    def __init__(self, status_code: int, payload: dict):
        self.status_code = status_code
        self._payload = payload

    def raise_for_status(self):
        if self.status_code >= 400:
            raise RuntimeError(f"http_{self.status_code}")

    def json(self):
        return self._payload


class _FakeHttpClient:
    def __init__(self, responses):
        self.responses = list(responses)
        self.calls = []

    def post(self, url, json):
        self.calls.append((url, json))
        if not self.responses:
            raise RuntimeError("No fake responses left")
        response = self.responses.pop(0)
        return response


class CaptchaSolverClientTests(unittest.TestCase):
    def test_get_balance(self) -> None:
        fake_http = _FakeHttpClient([_FakeResponse(200, {"errorId": 0, "balance": 12.34})])
        client = CaptchaSolverClient(
            SolverConfig(api_key="k", max_submit_retries=0),
            http_client=fake_http,  # type: ignore[arg-type]
        )
        balance = client.get_balance()
        self.assertAlmostEqual(balance, 12.34)

    def test_submit_task_retries_on_no_slot(self) -> None:
        fake_http = _FakeHttpClient(
            [
                _FakeResponse(200, {"errorId": 1, "errorCode": "ERROR_NO_SLOT_AVAILABLE", "errorDescription": "no slot"}),
                _FakeResponse(200, {"errorId": 0, "taskId": 999}),
            ]
        )
        client = CaptchaSolverClient(
            SolverConfig(api_key="k", max_submit_retries=1, no_slot_backoff_seconds=0),
            http_client=fake_http,  # type: ignore[arg-type]
        )
        task_id = client.submit_task({"type": "RecaptchaV2TaskProxyless"})
        self.assertEqual(task_id, 999)

    def test_poll_result_processing_then_ready(self) -> None:
        fake_http = _FakeHttpClient(
            [
                _FakeResponse(200, {"errorId": 0, "status": "processing"}),
                _FakeResponse(
                    200,
                    {
                        "errorId": 0,
                        "status": "ready",
                        "solution": {"token": "tok_1"},
                        "cost": "0.003",
                    },
                ),
            ]
        )
        client = CaptchaSolverClient(
            SolverConfig(
                api_key="k",
                min_first_poll_seconds=0,
                poll_interval_seconds=0,
                max_poll_seconds=10,
            ),
            http_client=fake_http,  # type: ignore[arg-type]
        )
        slept: list[float] = []
        result = client.poll_result(42, sleep_fn=lambda s: slept.append(float(s)))
        self.assertEqual(result.status, "ready")
        self.assertEqual(result.token, "tok_1")
        self.assertAlmostEqual(float(result.cost or 0), 0.003, places=6)
        self.assertGreaterEqual(len(slept), 1)

    def test_solve_task_raises_on_unsolvable(self) -> None:
        fake_http = _FakeHttpClient(
            [
                _FakeResponse(200, {"errorId": 0, "taskId": 101}),
                _FakeResponse(
                    200,
                    {
                        "errorId": 1,
                        "errorCode": "ERROR_CAPTCHA_UNSOLVABLE",
                        "errorDescription": "unsolvable",
                    },
                ),
            ]
        )
        client = CaptchaSolverClient(
            SolverConfig(api_key="k", min_first_poll_seconds=0, max_submit_retries=0),
            http_client=fake_http,  # type: ignore[arg-type]
        )
        with self.assertRaises(CaptchaSolverError) as ctx:
            client.solve_task({"type": "HCaptchaTaskProxyless"})
        self.assertEqual(ctx.exception.error_code, "ERROR_CAPTCHA_UNSOLVABLE")


if __name__ == "__main__":
    unittest.main()
