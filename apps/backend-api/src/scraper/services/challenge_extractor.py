from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Optional

try:
    from src.scraper.services.challenge_classifier import ChallengeType
except Exception:
    from scraper.services.challenge_classifier import ChallengeType  # type: ignore


@dataclass(frozen=True)
class ChallengeSpec:
    challenge_type: ChallengeType
    website_url: str
    website_key: str
    action: Optional[str] = None
    data: Optional[str] = None
    pagedata: Optional[str] = None
    rqdata: Optional[str] = None
    user_agent: Optional[str] = None


_SITE_KEY_PATTERNS = (
    re.compile(r'data-sitekey=["\']([^"\']+)["\']', re.IGNORECASE),
    re.compile(r'sitekey["\']?\s*[:=]\s*["\']([^"\']+)["\']', re.IGNORECASE),
    re.compile(r'render=([0-9A-Za-z_-]{20,})', re.IGNORECASE),
)

_TURNSTILE_ACTION_PATTERNS = (
    re.compile(r'data-action=["\']([^"\']+)["\']', re.IGNORECASE),
    re.compile(r'action["\']?\s*:\s*["\']([^"\']+)["\']', re.IGNORECASE),
)
_TURNSTILE_DATA_PATTERNS = (
    re.compile(r'data-cdata=["\']([^"\']+)["\']', re.IGNORECASE),
    re.compile(r'data["\']?\s*:\s*["\']([^"\']+)["\']', re.IGNORECASE),
)
_TURNSTILE_PAGEDATA_PATTERNS = (
    re.compile(r'data-pagedata=["\']([^"\']+)["\']', re.IGNORECASE),
    re.compile(r'pagedata["\']?\s*:\s*["\']([^"\']+)["\']', re.IGNORECASE),
)
_HCAPTCHA_RQDATA_PATTERNS = (
    re.compile(r'rqdata["\']?\s*[:=]\s*["\']([^"\']+)["\']', re.IGNORECASE),
)


def _first_match(html: str, patterns: tuple[re.Pattern[str], ...]) -> Optional[str]:
    for pattern in patterns:
        match = pattern.search(html or "")
        if match:
            value = match.group(1).strip()
            if value:
                return value
    return None


def extract_challenge_spec(
    *,
    html: str,
    page_url: str,
    challenge_type: ChallengeType,
    user_agent: Optional[str] = None,
) -> Optional[ChallengeSpec]:
    if challenge_type not in {"recaptcha_v2", "hcaptcha", "turnstile"}:
        return None

    website_key = _first_match(html, _SITE_KEY_PATTERNS)
    if not website_key:
        return None

    return ChallengeSpec(
        challenge_type=challenge_type,
        website_url=page_url,
        website_key=website_key,
        action=_first_match(html, _TURNSTILE_ACTION_PATTERNS) if challenge_type == "turnstile" else None,
        data=_first_match(html, _TURNSTILE_DATA_PATTERNS) if challenge_type == "turnstile" else None,
        pagedata=_first_match(html, _TURNSTILE_PAGEDATA_PATTERNS) if challenge_type == "turnstile" else None,
        rqdata=_first_match(html, _HCAPTCHA_RQDATA_PATTERNS) if challenge_type == "hcaptcha" else None,
        user_agent=user_agent,
    )


def build_2captcha_task(spec: ChallengeSpec) -> dict:
    if spec.challenge_type == "recaptcha_v2":
        task = {
            "type": "RecaptchaV2TaskProxyless",
            "websiteURL": spec.website_url,
            "websiteKey": spec.website_key,
        }
        if spec.user_agent:
            task["userAgent"] = spec.user_agent
        return task

    if spec.challenge_type == "hcaptcha":
        task = {
            "type": "HCaptchaTaskProxyless",
            "websiteURL": spec.website_url,
            "websiteKey": spec.website_key,
        }
        if spec.rqdata:
            task["enterprisePayload"] = {"rqdata": spec.rqdata}
        if spec.user_agent:
            task["userAgent"] = spec.user_agent
        return task

    if spec.challenge_type == "turnstile":
        task = {
            "type": "TurnstileTaskProxyless",
            "websiteURL": spec.website_url,
            "websiteKey": spec.website_key,
        }
        if spec.action:
            task["action"] = spec.action
        if spec.data:
            task["data"] = spec.data
        if spec.pagedata:
            task["pagedata"] = spec.pagedata
        if spec.user_agent:
            task["userAgent"] = spec.user_agent
        return task

    raise ValueError(f"Unsupported challenge_type for 2Captcha task build: {spec.challenge_type}")
