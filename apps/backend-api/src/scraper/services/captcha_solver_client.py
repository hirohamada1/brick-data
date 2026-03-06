from __future__ import annotations

import os
import time
from dataclasses import dataclass
from typing import Any, Optional

import httpx


class CaptchaSolverError(RuntimeError):
    def __init__(self, message: str, *, error_code: Optional[str] = None) -> None:
        super().__init__(message)
        self.error_code = error_code


@dataclass(frozen=True)
class SolverConfig:
    api_key: str
    base_url: str = "https://api.2captcha.com"
    timeout_s: float = 30.0
    min_first_poll_seconds: float = 10.0
    poll_interval_seconds: float = 5.0
    max_poll_seconds: float = 120.0
    no_slot_backoff_seconds: float = 5.0
    zero_balance_cooldown_seconds: float = 60.0
    max_submit_retries: int = 2
    callback_url: Optional[str] = None

    @classmethod
    def from_env(cls) -> "SolverConfig":
        use_callback = os.getenv("CAPTCHA_USE_CALLBACK", "false").strip().lower() in {"1", "true", "yes", "on"}
        callback_url = os.getenv("CAPTCHA_CALLBACK_URL", "").strip() or None
        return cls(
            api_key=os.getenv("CAPTCHA_API_KEY", "").strip(),
            base_url=os.getenv("CAPTCHA_API_BASE_URL", "https://api.2captcha.com").strip() or "https://api.2captcha.com",
            timeout_s=float(os.getenv("CAPTCHA_TIMEOUT_SECONDS", "30")),
            min_first_poll_seconds=float(os.getenv("CAPTCHA_MIN_FIRST_POLL_SECONDS", "10")),
            poll_interval_seconds=float(os.getenv("CAPTCHA_POLL_INTERVAL_SECONDS", "5")),
            max_poll_seconds=float(os.getenv("CAPTCHA_MAX_POLL_SECONDS", "120")),
            no_slot_backoff_seconds=float(os.getenv("CAPTCHA_NO_SLOT_BACKOFF_SECONDS", "5")),
            zero_balance_cooldown_seconds=float(os.getenv("CAPTCHA_ZERO_BALANCE_COOLDOWN_SECONDS", "60")),
            max_submit_retries=int(os.getenv("CAPTCHA_MAX_SUBMIT_RETRIES", "2")),
            callback_url=(callback_url if use_callback else None),
        )


@dataclass(frozen=True)
class SolverResult:
    task_id: int
    status: str
    token: Optional[str] = None
    cost: Optional[float] = None
    error_code: Optional[str] = None
    error_description: Optional[str] = None
    raw: Optional[dict[str, Any]] = None


def extract_solution_token(solution: dict[str, Any]) -> Optional[str]:
    for key in ("token", "gRecaptchaResponse", "captchaKey"):
        value = solution.get(key)
        if isinstance(value, str) and value.strip():
            return value.strip()
    return None


class CaptchaSolverClient:
    def __init__(
        self,
        config: Optional[SolverConfig] = None,
        *,
        http_client: Optional[httpx.Client] = None,
    ) -> None:
        self.config = config or SolverConfig.from_env()
        if not self.config.api_key:
            raise RuntimeError("CAPTCHA_API_KEY is not configured")
        timeout = httpx.Timeout(max(self.config.timeout_s, 1.0))
        self._http = http_client or httpx.Client(timeout=timeout)

    def _post_json(self, endpoint: str, payload: dict[str, Any]) -> dict[str, Any]:
        url = f"{self.config.base_url.rstrip('/')}/{endpoint.lstrip('/')}"
        response = self._http.post(url, json=payload)
        response.raise_for_status()
        data = response.json()
        if not isinstance(data, dict):
            raise CaptchaSolverError("Unexpected 2Captcha response format")
        error_id = int(data.get("errorId", 0) or 0)
        if error_id != 0:
            raise CaptchaSolverError(
                data.get("errorDescription") or "2Captcha API error",
                error_code=data.get("errorCode"),
            )
        return data

    def get_balance(self) -> float:
        data = self._post_json(
            "getBalance",
            {"clientKey": self.config.api_key},
        )
        balance = data.get("balance")
        try:
            return float(balance)
        except Exception as exc:
            raise CaptchaSolverError(f"Invalid balance payload: {balance}") from exc

    def submit_task(self, task_payload: dict[str, Any]) -> int:
        payload: dict[str, Any] = {
            "clientKey": self.config.api_key,
            "task": task_payload,
        }
        if self.config.callback_url:
            payload["callbackUrl"] = self.config.callback_url

        retries = max(self.config.max_submit_retries, 0) + 1
        for attempt in range(1, retries + 1):
            try:
                data = self._post_json("createTask", payload)
                task_id = data.get("taskId")
                if not isinstance(task_id, int):
                    raise CaptchaSolverError(f"2Captcha createTask returned invalid taskId: {task_id}")
                return task_id
            except CaptchaSolverError as exc:
                if attempt >= retries:
                    raise
                if exc.error_code == "ERROR_NO_SLOT_AVAILABLE":
                    time.sleep(max(self.config.no_slot_backoff_seconds, 0))
                    continue
                if exc.error_code == "ERROR_ZERO_BALANCE":
                    time.sleep(max(self.config.zero_balance_cooldown_seconds, 0))
                    continue
                raise
        raise CaptchaSolverError("2Captcha createTask failed after retries")

    def get_task_result(self, task_id: int) -> SolverResult:
        data = self._post_json(
            "getTaskResult",
            {"clientKey": self.config.api_key, "taskId": task_id},
        )
        status = str(data.get("status") or "")
        if status == "processing":
            return SolverResult(task_id=task_id, status="processing", raw=data)
        if status != "ready":
            raise CaptchaSolverError(f"Unexpected getTaskResult status={status}", error_code="UNEXPECTED_STATUS")
        solution = data.get("solution")
        if not isinstance(solution, dict):
            raise CaptchaSolverError("2Captcha ready response missing solution")
        token = extract_solution_token(solution)
        if not token:
            raise CaptchaSolverError("2Captcha ready response did not include a token")
        cost_raw = data.get("cost")
        cost: Optional[float] = None
        if cost_raw is not None:
            try:
                cost = float(cost_raw)
            except Exception:
                cost = None
        return SolverResult(
            task_id=task_id,
            status="ready",
            token=token,
            cost=cost,
            raw=data,
        )

    def poll_result(
        self,
        task_id: int,
        *,
        sleep_fn: Any = time.sleep,
    ) -> SolverResult:
        sleep_fn(max(self.config.min_first_poll_seconds, 0))
        start = time.monotonic()
        while True:
            result = self.get_task_result(task_id)
            if result.status == "ready":
                return result
            elapsed = time.monotonic() - start
            if elapsed > max(self.config.max_poll_seconds, 1):
                raise CaptchaSolverError(
                    f"2Captcha polling timeout after {elapsed:.1f}s",
                    error_code="POLL_TIMEOUT",
                )
            sleep_fn(max(self.config.poll_interval_seconds, 0))

    def solve_task(self, task_payload: dict[str, Any]) -> SolverResult:
        task_id = self.submit_task(task_payload)
        return self.poll_result(task_id)
