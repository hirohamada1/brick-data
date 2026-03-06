from __future__ import annotations

import os
import secrets
from dataclasses import dataclass
from typing import Optional


@dataclass(frozen=True)
class BrightDataProxySettings:
    username: str
    password: str
    host: str = "brd.superproxy.io"
    port: int = 7777
    session_prefix: str = "sessid"
    country: Optional[str] = None
    append_session: bool = False
    append_country: bool = False

    @classmethod
    def from_env(cls) -> "BrightDataProxySettings":
        return cls(
            username=os.getenv("BRIGHTDATA_PROXY_USERNAME", "").strip(),
            password=os.getenv("BRIGHTDATA_PROXY_PASSWORD", "").strip(),
            host=os.getenv("BRIGHTDATA_PROXY_HOST", "brd.superproxy.io").strip() or "brd.superproxy.io",
            port=int(os.getenv("BRIGHTDATA_PROXY_PORT", "7777")),
            session_prefix=os.getenv("BRIGHTDATA_PROXY_SESSION_PREFIX", "sessid").strip() or "sessid",
            country=(os.getenv("BRIGHTDATA_PROXY_COUNTRY", "").strip() or None),
            append_session=(os.getenv("BRIGHTDATA_PROXY_APPEND_SESSION", "false").strip().lower() in {"1", "true", "yes", "on"}),
            append_country=(os.getenv("BRIGHTDATA_PROXY_APPEND_COUNTRY", "false").strip().lower() in {"1", "true", "yes", "on"}),
        )


def rotate_session_id(previous: Optional[str] = None, *, force_rotate: bool = True) -> str:
    if previous and not force_rotate:
        return previous
    return secrets.token_hex(8)


def build_brightdata_proxy_config(*, session_id: str) -> dict[str, str]:
    settings = BrightDataProxySettings.from_env()
    if not settings.username or not settings.password:
        raise RuntimeError(
            "Proxy credentials missing: BRIGHTDATA_PROXY_USERNAME/BRIGHTDATA_PROXY_PASSWORD"
        )

    # Use the configured username as-is by default.
    # Some providers already encode zone/session/country directives in username.
    username = settings.username
    if settings.append_session:
        username = f"{username}-{settings.session_prefix}-{session_id}"
    if settings.append_country and settings.country:
        username = f"{username}-cc-{settings.country}"

    return {
        "server": f"http://{settings.host}:{settings.port}",
        "username": username,
        "password": settings.password,
    }
