from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import Literal, Optional

ChallengeType = Literal["none", "static_deny", "recaptcha_v2", "hcaptcha", "turnstile", "unknown"]


@dataclass(frozen=True)
class ChallengeClassification:
    challenge_type: ChallengeType
    confidence: float
    title: Optional[str] = None
    markers: list[str] = field(default_factory=list)

    @property
    def interactive(self) -> bool:
        return self.challenge_type in {"recaptcha_v2", "hcaptcha", "turnstile"}

    @property
    def has_challenge(self) -> bool:
        return self.challenge_type != "none"


_TITLE_RE = re.compile(r"<title[^>]*>(.*?)</title>", re.IGNORECASE | re.DOTALL)

_STATIC_MARKERS = (
    "ich bin kein roboter",
    "i am not a robot",
    "access denied",
    "request blocked",
    "security check",
    "verify you are human",
)

_RECAPTCHA_MARKERS = (
    "g-recaptcha",
    "google.com/recaptcha",
    "recaptcha/api.js",
    "__grecaptcha_cfg",
)

_HCAPTCHA_MARKERS = (
    "hcaptcha.com/1/api.js",
    "h-captcha-response",
    "data-hcaptcha-response",
    "h-captcha",
)

_TURNSTILE_MARKERS = (
    "cf-turnstile",
    "challenges.cloudflare.com/turnstile",
    "turnstile.render",
    "cf_chl",
)


def _extract_title(html: str) -> Optional[str]:
    match = _TITLE_RE.search(html or "")
    if not match:
        return None
    title = re.sub(r"\s+", " ", match.group(1)).strip()
    return title or None


def _find_markers(source: str, markers: tuple[str, ...]) -> list[str]:
    lowered = source.lower()
    return [marker for marker in markers if marker in lowered]


def classify_challenge(
    html: str,
    *,
    http_status: Optional[int] = None,
    error_message: Optional[str] = None,
) -> ChallengeClassification:
    source = " ".join(x for x in (html or "", error_message or "") if x)
    title = _extract_title(html or "")

    static_hits = _find_markers(source, _STATIC_MARKERS)
    recaptcha_hits = _find_markers(source, _RECAPTCHA_MARKERS)
    hcaptcha_hits = _find_markers(source, _HCAPTCHA_MARKERS)
    turnstile_hits = _find_markers(source, _TURNSTILE_MARKERS)

    if turnstile_hits:
        return ChallengeClassification(
            challenge_type="turnstile",
            confidence=0.9,
            title=title,
            markers=turnstile_hits,
        )
    if hcaptcha_hits:
        return ChallengeClassification(
            challenge_type="hcaptcha",
            confidence=0.9,
            title=title,
            markers=hcaptcha_hits,
        )
    if recaptcha_hits:
        return ChallengeClassification(
            challenge_type="recaptcha_v2",
            confidence=0.9,
            title=title,
            markers=recaptcha_hits,
        )
    if static_hits:
        return ChallengeClassification(
            challenge_type="static_deny",
            confidence=0.95,
            title=title,
            markers=static_hits,
        )

    if http_status in {401, 403, 429, 503}:
        return ChallengeClassification(
            challenge_type="unknown",
            confidence=0.6,
            title=title,
            markers=[f"http_{http_status}"],
        )

    return ChallengeClassification(challenge_type="none", confidence=0.0, title=title, markers=[])
