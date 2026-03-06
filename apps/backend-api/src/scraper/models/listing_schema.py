from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum
from typing import Any, Literal, Optional


class FetchStatus(str, Enum):
    SUCCESS = "success"
    BLOCKED = "blocked"
    ERROR = "error"


@dataclass(frozen=True)
class FetchArtifact:
    url: str
    fetched_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    status: FetchStatus = FetchStatus.SUCCESS
    http_status: Optional[int] = None
    final_url: Optional[str] = None
    raw_html: Optional[str] = None
    extracted_json_text: Optional[str] = None
    block_reason: Optional[str] = None
    error_code: Optional[str] = None
    error_message: Optional[str] = None
    attempt: int = 1
    session_id: str = "default"
    provider: Literal["direct", "residential_proxy", "brightdata_api"] = "direct"
    challenge_title: Optional[str] = None
    challenge_type: Optional[str] = None
    challenge_markers: list[str] = field(default_factory=list)
    captcha_attempted: int = 0
    captcha_solved: bool = False
    captcha_task_id: Optional[int] = None
    captcha_cost: Optional[float] = None
    captcha_skipped_reason: Optional[str] = None
    captcha_error_code: Optional[str] = None
    captcha_error_message: Optional[str] = None


@dataclass(frozen=True)
class ParsedListing:
    listing_id: str
    title: Optional[str]
    price: Optional[float]
    location: Optional[str]
    rooms: Optional[float]
    living_space: Optional[float]
    url: Optional[str]
    parse_warnings: list[str] = field(default_factory=list)
    parser_version: str = "is24_search_v2"


@dataclass(frozen=True)
class ParsedSearchPayload:
    source: Literal["json_endpoint", "embedded_script", "html_fallback"]
    listings: list[dict[str, Any]]
    warnings: list[str] = field(default_factory=list)
    parser_version: str = "is24_search_v2"
