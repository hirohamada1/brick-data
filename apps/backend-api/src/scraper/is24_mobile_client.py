from __future__ import annotations

import os
from dataclasses import dataclass
from typing import Any, Mapping, Optional

import httpx


class MobileApiError(RuntimeError):
    pass


@dataclass(frozen=True)
class IS24MobileClientSettings:
    base_url: str = "https://api.mobile.immobilienscout24.de"
    user_agent: str = "ImmoScout_27.12_26.2_._"
    timeout_s: float = 30.0
    max_retries: int = 1

    @classmethod
    def from_env(cls) -> "IS24MobileClientSettings":
        timeout_raw = os.getenv("IS24_MOBILE_TIMEOUT_SECONDS", "30").strip()
        retries_raw = os.getenv("IS24_MOBILE_MAX_RETRIES", "1").strip()
        try:
            timeout_s = max(float(timeout_raw), 1.0)
        except Exception:
            timeout_s = 30.0
        try:
            max_retries = max(int(retries_raw), 0)
        except Exception:
            max_retries = 1

        return cls(
            base_url=(os.getenv("IS24_MOBILE_API_BASE_URL", "https://api.mobile.immobilienscout24.de").strip()
                      or "https://api.mobile.immobilienscout24.de"),
            user_agent=(os.getenv("IS24_MOBILE_USER_AGENT", "ImmoScout_27.12_26.2_._").strip()
                        or "ImmoScout_27.12_26.2_._"),
            timeout_s=timeout_s,
            max_retries=max_retries,
        )


@dataclass(frozen=True)
class IS24MobileFetchResult:
    total: Optional[int]
    search_payload: dict[str, Any]
    endpoint_statuses: dict[str, int]


class IS24MobileClient:
    def __init__(
        self,
        settings: Optional[IS24MobileClientSettings] = None,
        http_client: Optional[httpx.Client] = None,
    ) -> None:
        self.settings = settings or IS24MobileClientSettings.from_env()
        timeout = httpx.Timeout(self.settings.timeout_s)
        self._http = http_client or httpx.Client(timeout=timeout)
        self.last_artifacts: list[dict[str, Any]] = []

    def fetch_search_results(
        self,
        *,
        search_params: Mapping[str, Any],
        page_number: int = 1,
    ) -> IS24MobileFetchResult:
        if page_number < 1:
            raise ValueError("page_number must be >= 1")

        params = {str(k): str(v) for k, v in search_params.items() if v is not None}
        endpoint_statuses: dict[str, int] = {}

        total_payload, total_status = self._request_json("GET", "/search/total", params=params)
        endpoint_statuses["search_total"] = total_status
        list_params = dict(params)
        list_params["pagenumber"] = str(page_number)
        list_payload, list_status = self._request_json(
            "POST",
            "/search/list",
            params=list_params,
            json_body={"supportedResultListTypes": [], "userData": {}},
        )
        endpoint_statuses["search_list"] = list_status

        if not isinstance(list_payload, dict):
            raise MobileApiError("mobile_api_invalid_payload: /search/list must return a JSON object")

        result = IS24MobileFetchResult(
            total=self._extract_total(total_payload),
            search_payload=list_payload,
            endpoint_statuses=endpoint_statuses,
        )
        self._remember_artifact(
            {
                "endpoint_statuses": dict(endpoint_statuses),
                "page_number": page_number,
                "total": result.total,
            }
        )
        return result

    def _request_json(
        self,
        method: str,
        path: str,
        *,
        params: Mapping[str, str],
        json_body: Optional[Mapping[str, Any]] = None,
    ) -> tuple[Any, int]:
        url = f"{self.settings.base_url.rstrip('/')}{path}"
        headers = {
            "Accept": "application/json",
            "User-Agent": self.settings.user_agent,
        }
        if method.upper() == "POST":
            headers["Content-Type"] = "application/json"

        last_error: Exception | None = None
        max_attempts = self.settings.max_retries + 1
        for attempt in range(1, max_attempts + 1):
            try:
                response = self._http.request(
                    method=method.upper(),
                    url=url,
                    params=params,
                    json=json_body,
                    headers=headers,
                )
            except (httpx.TimeoutException, httpx.TransportError) as exc:
                last_error = exc
                if attempt >= max_attempts:
                    raise MobileApiError(
                        f"mobile_api_transport_error:{path}: {exc}"
                    ) from exc
                continue

            if response.status_code >= 500 and attempt < max_attempts:
                continue

            if response.status_code >= 400:
                body = response.text.strip().replace("\n", " ")
                body_preview = body[:240]
                raise MobileApiError(
                    f"mobile_api_http_error:{path}: status={response.status_code} body={body_preview}"
                )

            try:
                payload = response.json()
            except Exception as exc:  # pragma: no cover - defensive
                raise MobileApiError(
                    f"mobile_api_invalid_json:{path}: {exc}"
                ) from exc

            return payload, int(response.status_code)

        # Defensive fallback. Loop should always return/raise.
        raise MobileApiError(f"mobile_api_request_failed:{path}: {last_error}")

    @staticmethod
    def _extract_total(payload: Any) -> Optional[int]:
        if payload is None or isinstance(payload, bool):
            return None
        if isinstance(payload, int):
            return payload
        if isinstance(payload, float):
            return int(payload)
        if isinstance(payload, str):
            stripped = payload.strip()
            if stripped.isdigit():
                return int(stripped)
            return None
        if isinstance(payload, Mapping):
            for key in ("totalResultCount", "total", "count", "resultCount"):
                value = payload.get(key)
                if isinstance(value, (int, float)):
                    return int(value)
                if isinstance(value, str) and value.strip().isdigit():
                    return int(value.strip())
        return None

    def _remember_artifact(self, artifact: dict[str, Any]) -> None:
        self.last_artifacts.append(artifact)
        if len(self.last_artifacts) > 20:
            self.last_artifacts = self.last_artifacts[-20:]
