from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any, Optional

from src.scraper.models.listing_schema import FetchArtifact, FetchStatus
from src.scraper.services.anti_detection import add_stealth_init_script, randomized_delay, randomized_scroll
from src.scraper.services.captcha_solver_client import CaptchaSolverClient, CaptchaSolverError
from src.scraper.services.challenge_classifier import ChallengeClassification, classify_challenge
from src.scraper.services.challenge_extractor import build_2captcha_task, extract_challenge_spec
from src.scraper.services.proxy_provider import build_brightdata_proxy_config

try:
    from playwright.sync_api import sync_playwright
except Exception:  # pragma: no cover
    sync_playwright = None

logger = logging.getLogger(__name__)

_BLOCK_KEYWORDS = (
    "captcha",
    "access denied",
    "block",
    "verify",
    "ich bin kein roboter",
    "i am not a robot",
)
_BLOCK_STATUS_CODES = {401, 403, 429, 503}


class PlaywrightFetchClient:
    def __init__(
        self,
        *,
        use_proxy: bool = True,
        headful: bool = True,
        timeout_ms: int = 90000,
        min_delay_s: float = 20.0,
        max_delay_s: float = 60.0,
        captcha_solver_enabled: bool = False,
        captcha_solver_client: Optional[CaptchaSolverClient] = None,
        captcha_max_solves_per_run: int = 2,
        captcha_min_balance: float = 0.0,
    ) -> None:
        self.use_proxy = use_proxy
        self.headful = headful
        self.timeout_ms = timeout_ms
        self.min_delay_s = min_delay_s
        self.max_delay_s = max_delay_s
        self.captcha_solver_enabled = captcha_solver_enabled
        self.captcha_solver_client = captcha_solver_client
        self.captcha_max_solves_per_run = max(0, captcha_max_solves_per_run)
        self.captcha_min_balance = max(0.0, captcha_min_balance)
        self._captcha_solves_used = 0
        self.last_artifacts: list[FetchArtifact] = []

    @staticmethod
    def _user_agent() -> str:
        return (
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/122.0.0.0 Safari/537.36"
        )

    @staticmethod
    def _contains_search_payload(text: str) -> bool:
        lowered = text.lower()
        return "resultlistentries" in lowered or "resultlistmodel" in lowered

    @staticmethod
    def _is_blocked(
        *,
        status_code: Optional[int],
        classification: ChallengeClassification,
        html: str,
        error_message: Optional[str],
    ) -> bool:
        lowered = (html or "").lower()
        lowered_error = (error_message or "").lower()
        return (
            (status_code in _BLOCK_STATUS_CODES)
            or classification.has_challenge
            or any(k in lowered for k in _BLOCK_KEYWORDS)
            or any(k in lowered_error for k in _BLOCK_KEYWORDS)
            or "err_http_response_code_failure" in lowered_error
        )

    def _remember_artifact(self, artifact: FetchArtifact) -> None:
        self.last_artifacts.append(artifact)
        if len(self.last_artifacts) > 20:
            self.last_artifacts = self.last_artifacts[-20:]

    def _should_attempt_solver(self, classification: ChallengeClassification) -> Optional[str]:
        if not classification.interactive:
            return "challenge_not_interactive"
        if not self.captcha_solver_enabled:
            return "solver_disabled"
        if self.captcha_solver_client is None:
            return "solver_client_missing"
        if self._captcha_solves_used >= self.captcha_max_solves_per_run:
            return "solver_budget_exhausted"
        return None

    def _apply_captcha_token(self, page: Any, token: str) -> None:
        page.evaluate(
            """
            (token) => {
              const selectors = [
                'textarea[name="g-recaptcha-response"]',
                'textarea[name="h-captcha-response"]',
                'textarea[name="cf-turnstile-response"]',
                'input[name="g-recaptcha-response"]',
                'input[name="h-captcha-response"]',
                'input[name="cf-turnstile-response"]'
              ];
              selectors.forEach((selector) => {
                const node = document.querySelector(selector);
                if (!node) return;
                node.value = token;
                node.innerHTML = token;
                node.dispatchEvent(new Event('input', { bubbles: true }));
                node.dispatchEvent(new Event('change', { bubbles: true }));
              });

              const callbackNames = [
                'onCaptchaSolved',
                'onTurnstileSuccess',
                'verifyCallback',
                'callback',
                'onSubmit',
                'onSuccess'
              ];
              callbackNames.forEach((name) => {
                const fn = window[name];
                if (typeof fn === 'function') {
                  try { fn(token); } catch (e) {}
                }
              });
            }
            """,
            token,
        )

    def _attempt_solver(
        self,
        *,
        page: Any,
        html: str,
        url: str,
        classification: ChallengeClassification,
    ) -> dict[str, Any]:
        result: dict[str, Any] = {
            "captcha_attempted": 0,
            "captcha_solved": False,
            "captcha_task_id": None,
            "captcha_cost": None,
            "captcha_skipped_reason": None,
            "captcha_error_code": None,
            "captcha_error_message": None,
        }
        skip_reason = self._should_attempt_solver(classification)
        if skip_reason:
            result["captcha_skipped_reason"] = skip_reason
            return result

        assert self.captcha_solver_client is not None

        if self.captcha_min_balance > 0:
            try:
                balance = self.captcha_solver_client.get_balance()
            except Exception as exc:
                result["captcha_skipped_reason"] = "balance_check_failed"
                result["captcha_error_message"] = str(exc)
                return result
            if balance < self.captcha_min_balance:
                result["captcha_skipped_reason"] = "insufficient_solver_balance"
                return result

        spec = extract_challenge_spec(
            html=html,
            page_url=page.url or url,
            challenge_type=classification.challenge_type,
            user_agent=self._user_agent(),
        )
        if spec is None:
            result["captcha_skipped_reason"] = "challenge_params_missing"
            return result

        task_payload = build_2captcha_task(spec)
        self._captcha_solves_used += 1
        result["captcha_attempted"] = 1
        try:
            solve = self.captcha_solver_client.solve_task(task_payload)
        except CaptchaSolverError as exc:
            result["captcha_error_code"] = exc.error_code
            result["captcha_error_message"] = str(exc)
            return result
        except Exception as exc:
            result["captcha_error_message"] = str(exc)
            return result

        if not solve.token:
            result["captcha_error_message"] = "solver returned empty token"
            return result

        result["captcha_solved"] = True
        result["captcha_task_id"] = solve.task_id
        result["captcha_cost"] = solve.cost
        self._apply_captcha_token(page, solve.token)
        return result

    def fetch_search_page(self, url: str, *, session_id: str = "default") -> FetchArtifact:
        if sync_playwright is None:
            raise RuntimeError("playwright is not installed")

        provider = "direct"
        proxy: Optional[dict[str, str]] = None
        if self.use_proxy:
            proxy = build_brightdata_proxy_config(session_id=session_id)
            provider = "residential_proxy"

        with sync_playwright() as p:
            browser = p.chromium.launch(headless=not self.headful)
            context = browser.new_context(
                locale="de-DE",
                timezone_id="Europe/Berlin",
                proxy=proxy,
                ignore_https_errors=bool(proxy),
                user_agent=self._user_agent(),
            )
            page = context.new_page()
            add_stealth_init_script(page)
            captured_json_text: Optional[str] = None

            def _response_handler(response):
                nonlocal captured_json_text
                if captured_json_text:
                    return
                try:
                    ctype = str(response.headers.get("content-type", "")).lower()
                    if "json" not in ctype:
                        return
                    if response.request.resource_type not in {"xhr", "fetch"}:
                        return
                    text = response.text()
                    if self._contains_search_payload(text):
                        captured_json_text = text
                except Exception:
                    return

            def _route_handler(route):
                resource = route.request.resource_type
                if resource in {"image", "font", "media"}:
                    route.abort()
                else:
                    route.continue_()

            page.route("**/*", _route_handler)
            page.on("response", _response_handler)
            logger.info("navigation_start url=%s", url)
            response = None
            html = ""
            error_message: Optional[str] = None
            try:
                response = page.goto(url, wait_until="domcontentloaded", timeout=self.timeout_ms)
                randomized_scroll(page)
                randomized_delay(min_seconds=self.min_delay_s, max_seconds=self.max_delay_s)
                try:
                    html = page.content()
                except Exception:
                    # Some challenge pages keep navigating; still classify via response + keywords.
                    html = ""
            except Exception as exc:
                error_message = str(exc)
                try:
                    html = page.content()
                except Exception:
                    html = ""

            status_code = response.status if response else None
            classification = classify_challenge(html, http_status=status_code, error_message=error_message)

            solve_meta = {
                "captcha_attempted": 0,
                "captcha_solved": False,
                "captcha_task_id": None,
                "captcha_cost": None,
                "captcha_skipped_reason": None,
                "captcha_error_code": None,
                "captcha_error_message": None,
            }

            is_blocked = self._is_blocked(
                status_code=status_code,
                classification=classification,
                html=html,
                error_message=error_message,
            )
            if is_blocked and classification.interactive:
                solve_meta = self._attempt_solver(
                    page=page,
                    html=html,
                    url=url,
                    classification=classification,
                )
                if solve_meta.get("captcha_solved"):
                    try:
                        response = page.goto(url, wait_until="domcontentloaded", timeout=self.timeout_ms)
                    except Exception as exc:
                        error_message = str(exc)
                    randomized_scroll(page)
                    retry_min = min(1.0, max(self.min_delay_s, 0.0))
                    retry_max = min(3.0, max(self.max_delay_s, 0.0))
                    randomized_delay(min_seconds=retry_min, max_seconds=max(retry_min, retry_max))
                    try:
                        html = page.content()
                    except Exception:
                        html = ""
                    status_code = response.status if response else status_code
                    classification = classify_challenge(html, http_status=status_code, error_message=error_message)
                    is_blocked = self._is_blocked(
                        status_code=status_code,
                        classification=classification,
                        html=html,
                        error_message=error_message,
                    )

            block_reason = None
            if is_blocked:
                if classification.challenge_type == "static_deny":
                    block_reason = "blocked_no_solver_static_challenge"
                elif solve_meta.get("captcha_solved"):
                    block_reason = "captcha_solved_but_still_blocked"
                elif solve_meta.get("captcha_skipped_reason"):
                    block_reason = f"challenge_detected_solver_skipped:{solve_meta['captcha_skipped_reason']}"
                elif solve_meta.get("captcha_error_code"):
                    block_reason = f"captcha_solver_failed:{solve_meta['captcha_error_code']}"
                else:
                    block_reason = "captcha_or_access_block"

            if is_blocked:
                result = FetchArtifact(
                    url=url,
                    fetched_at=datetime.now(timezone.utc),
                    status=FetchStatus.BLOCKED,
                    http_status=status_code,
                    final_url=page.url,
                    raw_html=html,
                    extracted_json_text=captured_json_text,
                    block_reason=block_reason,
                    error_message=error_message,
                    session_id=session_id,
                    provider=provider,
                    challenge_title=classification.title,
                    challenge_type=classification.challenge_type,
                    challenge_markers=classification.markers,
                    captcha_attempted=int(solve_meta.get("captcha_attempted", 0) or 0),
                    captcha_solved=bool(solve_meta.get("captcha_solved", False)),
                    captcha_task_id=solve_meta.get("captcha_task_id"),
                    captcha_cost=solve_meta.get("captcha_cost"),
                    captcha_skipped_reason=solve_meta.get("captcha_skipped_reason"),
                    captcha_error_code=solve_meta.get("captcha_error_code"),
                    captcha_error_message=solve_meta.get("captcha_error_message"),
                )
            elif error_message:
                result = FetchArtifact(
                    url=url,
                    fetched_at=datetime.now(timezone.utc),
                    status=FetchStatus.ERROR,
                    http_status=status_code,
                    final_url=page.url,
                    raw_html=html,
                    extracted_json_text=captured_json_text,
                    error_code="playwright_navigation_error",
                    error_message=error_message,
                    session_id=session_id,
                    provider=provider,
                    challenge_title=classification.title,
                    challenge_type=classification.challenge_type if classification.has_challenge else None,
                    challenge_markers=classification.markers,
                )
            else:
                result = FetchArtifact(
                    url=url,
                    fetched_at=datetime.now(timezone.utc),
                    status=FetchStatus.SUCCESS,
                    http_status=status_code,
                    final_url=page.url,
                    raw_html=html,
                    extracted_json_text=captured_json_text,
                    session_id=session_id,
                    provider=provider,
                    challenge_title=classification.title,
                    challenge_type=classification.challenge_type if classification.has_challenge else None,
                    challenge_markers=classification.markers,
                )

            context.close()
            browser.close()
            self._remember_artifact(result)
            logger.info("navigation_end url=%s status=%s", url, result.status.value)
            return result
