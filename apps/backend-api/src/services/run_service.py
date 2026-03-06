from __future__ import annotations

import os
import json
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Tuple

try:
    from src.storage.l1_upserter import L1Upserter
except Exception:  # pragma: no cover
    from storage.l1_upserter import L1Upserter  # type: ignore

# psycopg2 (most common) OR psycopg (v3)
try:
    import psycopg2
    from psycopg2.extras import Json as PgJson
    _PSYCOPG_FLAVOR = "psycopg2"
except Exception:  # pragma: no cover
    psycopg2 = None
    PgJson = None
    _PSYCOPG_FLAVOR = "psycopg3"

try:
    import psycopg  # type: ignore
except Exception:  # pragma: no cover
    psycopg = None

try:
    from src.scraper.services.playwright_client import PlaywrightFetchClient
    from src.scraper.services.captcha_solver_client import CaptchaSolverClient
    from src.scraper.services.session_manager import SessionManager
    from src.scraper.is24_mobile_client import IS24MobileClient
    from src.scraper.is24_mobile_mapper import normalize_mobile_search_payload
    from src.scraper.is24_mobile_query_translator import (
        UnsupportedSearchError,
        translate_watchlist_to_mobile_search,
    )
except Exception:  # pragma: no cover
    from scraper.services.playwright_client import PlaywrightFetchClient  # type: ignore
    from scraper.services.captcha_solver_client import CaptchaSolverClient  # type: ignore
    from scraper.services.session_manager import SessionManager  # type: ignore
    from scraper.is24_mobile_client import IS24MobileClient  # type: ignore
    from scraper.is24_mobile_mapper import normalize_mobile_search_payload  # type: ignore
    from scraper.is24_mobile_query_translator import (  # type: ignore
        UnsupportedSearchError,
        translate_watchlist_to_mobile_search,
    )


def _utc_now() -> datetime:
    return datetime.now(timezone.utc)


def _env_bool(key: str, default: bool) -> bool:
    raw = os.getenv(key)
    if raw is None:
        return default
    return raw.strip().lower() in {"1", "true", "yes", "on"}


def _build_playwright_client() -> PlaywrightFetchClient:
    # Queue path always enables proxy usage. Missing proxy env fails fast.
    use_proxy = _env_bool("BRIGHTDATA_PROXY_ENABLED", True)
    solver_enabled = _env_bool("CAPTCHA_SOLVER_ENABLED", False)
    solver_client: Optional[CaptchaSolverClient] = None
    if solver_enabled:
        try:
            solver_client = CaptchaSolverClient()
        except Exception:
            # Keep run operational even if solver config is currently invalid.
            solver_client = None
    return PlaywrightFetchClient(
        use_proxy=use_proxy,
        headful=_env_bool("PLAYWRIGHT_HEADFUL", True),
        timeout_ms=int(os.getenv("PLAYWRIGHT_TIMEOUT_MS", "90000")),
        min_delay_s=float(os.getenv("PLAYWRIGHT_MIN_DELAY_S", "20")),
        max_delay_s=float(os.getenv("PLAYWRIGHT_MAX_DELAY_S", "60")),
        captcha_solver_enabled=solver_enabled,
        captcha_solver_client=solver_client,
        captcha_max_solves_per_run=int(os.getenv("CAPTCHA_MAX_SOLVES_PER_RUN", "2")),
        captcha_min_balance=float(os.getenv("CAPTCHA_MIN_BALANCE", "0")),
    )


def _build_mobile_client() -> IS24MobileClient:
    return IS24MobileClient()


def _parse_id_set(raw: str) -> set[str]:
    values = {item.strip() for item in str(raw or "").split(",")}
    return {item for item in values if item}


def _resolve_fetch_backend_for_watchlist(watchlist_id: str) -> str:
    mode = (os.getenv("IS24_FETCH_BACKEND", "web").strip().lower() or "web")
    if mode not in {"web", "mobile", "auto"}:
        mode = "web"
    if mode == "auto":
        pilot_ids = _parse_id_set(os.getenv("IS24_MOBILE_PILOT_WATCHLIST_IDS", ""))
        return "mobile" if watchlist_id in pilot_ids else "web"
    return mode


def _mobile_web_fallback_enabled() -> bool:
    return _env_bool("IS24_MOBILE_WEB_FALLBACK_ENABLED", True)


def _resolve_ingestion_mode() -> str:
    ingestion_mode = os.getenv("IS24_INGESTION_MODE", "json_first").strip() or "json_first"
    html_fallback_enabled = _env_bool("IS24_HTML_FALLBACK_ENABLED", True)
    if ingestion_mode == "json_first" and not html_fallback_enabled:
        return "json_only"
    return ingestion_mode


def _get_last_fetch_artifact(client: Any) -> Optional[Any]:
    artifacts = getattr(client, "last_artifacts", None)
    if not isinstance(artifacts, list) or not artifacts:
        return None
    return artifacts[-1]


def _get_fetch_artifacts(client: Any) -> list[Any]:
    artifacts = getattr(client, "last_artifacts", None)
    if not isinstance(artifacts, list):
        return []
    return list(artifacts)


def _extract_captcha_stats(artifacts: list[Any]) -> Dict[str, Any]:
    if not artifacts:
        return {
            "attempted": 0,
            "solved": 0,
            "skipped": 0,
            "failed": 0,
            "error_code_counts": {},
            "cost_total": 0.0,
        }

    attempted = 0
    solved = 0
    skipped = 0
    failed = 0
    error_code_counts: Dict[str, int] = {}
    cost_total = 0.0
    for artifact in artifacts:
        attempted += int(getattr(artifact, "captcha_attempted", 0) or 0)
        solved += 1 if bool(getattr(artifact, "captcha_solved", False)) else 0
        skipped += 1 if bool(getattr(artifact, "captcha_skipped_reason", None)) else 0
        failed += 1 if bool(getattr(artifact, "captcha_error_code", None) or getattr(artifact, "captcha_error_message", None)) else 0
        error_code = getattr(artifact, "captcha_error_code", None)
        if error_code:
            key = str(error_code)
            error_code_counts[key] = int(error_code_counts.get(key, 0)) + 1
        cost_raw = getattr(artifact, "captcha_cost", 0) or 0
        try:
            cost_total += float(cost_raw)
        except Exception:
            pass
    return {
        "attempted": attempted,
        "solved": solved,
        "skipped": skipped,
        "failed": failed,
        "error_code_counts": error_code_counts,
        "cost_total": cost_total,
    }


def _classify_pipeline_error(exc: Exception) -> str:
    message = str(exc).lower()
    if "fetch.no_hits" in message:
        return f"fetch.no_hits: {exc}"
    if "mobile_api_" in message:
        return f"fetch.mobile_api: {exc}"
    if (
        "mobile translation" in message
        or "unsupported is24 search kind" in message
        or "only is24 /suche/de" in message
    ):
        return f"fetch.mobile_query: {exc}"
    if "captcha_solver" in message:
        return f"fetch.captcha_solver: {exc}"
    if "captcha" in message or "reject_block" in message or "access_block" in message:
        return f"fetch.reject_block: {exc}"
    if "proxy credentials missing" in message:
        return f"fetch.proxy_config: {exc}"
    if "playwright is not installed" in message:
        return f"fetch.playwright_missing: {exc}"
    return str(exc)


def _scrape_search_hits(
    search_url: str,
    *,
    client: Any,
    session_id: Optional[str] = None,
    ingestion_mode: str = "json_first",
) -> List[Any]:
    try:
        from src.scraper.scraper import IS24SearchResultScraper  # type: ignore
    except Exception:
        from scraper.scraper import IS24SearchResultScraper  # type: ignore

    scraper = IS24SearchResultScraper(
        client=client,
        ingestion_mode=ingestion_mode,
        session_id=session_id,
        allow_html_fallback=_env_bool("IS24_HTML_FALLBACK_ENABLED", True),
    )
    listings, _pages = scraper.scrape_all_listings(search_url)
    return listings


def _scrape_search_hits_mobile(
    watchlist: Dict[str, Any],
    *,
    client: IS24MobileClient,
) -> tuple[List[Dict[str, Any]], Dict[str, Any]]:
    translation = translate_watchlist_to_mobile_search(watchlist)
    fetch_result = client.fetch_search_results(
        search_params=translation.search_params,
        page_number=1,
    )
    listings = normalize_mobile_search_payload(fetch_result.search_payload)
    metadata = {
        "endpoint_statuses": fetch_result.endpoint_statuses,
        "translator_source": translation.source,
        "fallback_used": translation.fallback_used,
        "mobile_total": fetch_result.total,
        "backend": "mobile_api",
    }
    return listings, metadata


def _coerce_float(value: Any) -> Optional[float]:
    try:
        if value is None:
            return None
        if isinstance(value, (int, float)):
            return float(value)
        return float(str(value).strip().replace(",", "."))
    except Exception:
        return None


def _coerce_int(value: Any) -> Optional[int]:
    try:
        if value is None or isinstance(value, bool):
            return None
        if isinstance(value, int):
            return value
        if isinstance(value, float):
            return int(value)
        return int(float(str(value).strip().replace(",", ".")))
    except Exception:
        return None


def _get_hit_value(hit: Any, key: str) -> Any:
    if isinstance(hit, dict):
        return hit.get(key)
    return getattr(hit, key, None)


def _qualify_table(table: str, schema: str) -> str:
    table_name = str(table or "").strip()
    if not table_name:
        raise ValueError("table must be non-empty")
    if "." in table_name:
        return table_name
    return f"{schema}.{table_name}"


def _is_missing_required_value(value: Any) -> bool:
    if value is None:
        return True
    if isinstance(value, str):
        return value.strip() == ""
    return False


def _validate_required_listing_fields(listing: Dict[str, Any]) -> List[str]:
    required_fields = (
        "external_id",
        "url",
        "title",
        "price_eur",
        "living_space_sqm",
        "postcode",
        "city",
    )
    missing: List[str] = []
    for field in required_fields:
        if _is_missing_required_value(listing.get(field)):
            missing.append(field)
    return missing


def _build_l1_listing_from_search_hit(hit: Any) -> Dict[str, Any]:
    listing_id = _coerce_int(_get_hit_value(hit, "listing_id"))
    external_id = _get_hit_value(hit, "external_id")
    if not external_id and listing_id is not None:
        external_id = str(listing_id)

    expose_url = _get_hit_value(hit, "expose_url")
    if not expose_url and listing_id is not None:
        expose_url = f"https://www.immobilienscout24.de/expose/{listing_id}"

    source = _get_hit_value(hit, "source") or "immoscout"

    return {
        "source": source,
        "external_id": external_id,
        "url": expose_url,
        "title": _get_hit_value(hit, "title"),
        "price_eur": _coerce_float(_get_hit_value(hit, "price_eur")),
        "living_space_sqm": _coerce_float(_get_hit_value(hit, "living_space_sqm")),
        "rooms": _coerce_float(_get_hit_value(hit, "rooms")),
        "street": _get_hit_value(hit, "street"),
        "house_number": _get_hit_value(hit, "house_number"),
        "postcode": _get_hit_value(hit, "postcode"),
        "city": _get_hit_value(hit, "city"),
        "quarter": _get_hit_value(hit, "quarter"),
        "images": [],
        "latest_l0_id": None,
    }


@dataclass(frozen=True)
class RunService:
    database_url: str
    db_schema: str = "public"
    watchlists_schema: str = "public"
    runs_table: str = "watchlist_runs"
    watchlists_table: str = "watchlists"
    watchlist_listings_table: str = "watchlist_listings"
    l1_table: str = "l1_listings"
    manual_inputs_table: str = "listing_manual_inputs"

    def __post_init__(self) -> None:
        schema = str(self.db_schema or "").strip() or "public"
        watchlists_schema = str(self.watchlists_schema or "").strip() or "public"

        object.__setattr__(self, "db_schema", schema)
        object.__setattr__(self, "watchlists_schema", watchlists_schema)
        object.__setattr__(self, "runs_table", _qualify_table(self.runs_table, schema))
        object.__setattr__(
            self,
            "watchlist_listings_table",
            _qualify_table(self.watchlist_listings_table, schema),
        )
        object.__setattr__(self, "l1_table", _qualify_table(self.l1_table, schema))
        object.__setattr__(
            self,
            "watchlists_table",
            _qualify_table(self.watchlists_table, watchlists_schema),
        )

    def create_run(self, watchlist_id: str, *, status: str = "queued") -> str:
        if not watchlist_id:
            raise ValueError("watchlist_id must be non-empty")

        watchlist = self._get_watchlist(watchlist_id)
        if watchlist is None:
            raise RuntimeError(f"Watchlist not found: {watchlist_id}")

        sql = f"""
            insert into {self.runs_table}
                (user_id, watchlist_id, status)
            values
                (%s, %s, %s)
            returning id;
        """
        params = (watchlist.get("user_id"), watchlist_id, status)

        # --- psycopg2 ---
        if psycopg2 is not None:
            with psycopg2.connect(self.database_url) as conn:
                with conn.cursor() as cur:
                    cur.execute(sql, params)
                    row = cur.fetchone()
                    if row and row[0]:
                        return str(row[0])
                    raise RuntimeError("Failed to create run")

        # --- psycopg v3 fallback ---
        if psycopg is None:
            raise RuntimeError(
                "No postgres driver found. Install one of:\n"
                "  pip install psycopg2-binary\n"
                "or\n"
                "  pip install psycopg[binary]\n"
            )

        with psycopg.connect(self.database_url) as conn:  # type: ignore
            with conn.cursor() as cur:
                cur.execute(sql, params)
                row = cur.fetchone()
                conn.commit()
                if row and row[0]:
                    return str(row[0])
                raise RuntimeError("Failed to create run")

    def get_latest_run(self, watchlist_id: str) -> Optional[Dict[str, Any]]:
        if not watchlist_id:
            raise ValueError("watchlist_id must be non-empty")

        sql = f"""
            select id, status, started_at, finished_at, error
            from {self.runs_table}
            where watchlist_id = %s
            order by started_at desc nulls last,
                     finished_at desc nulls last,
                     id desc
            limit 1;
        """
        row = self._fetchone(sql, (watchlist_id,))
        if not row:
            return None
        return {
            "run_id": str(row[0]),
            "status": row[1],
            "started_at": row[2].isoformat() if row[2] is not None else None,
            "finished_at": row[3].isoformat() if row[3] is not None else None,
            "error": row[4],
        }

    def run_watchlist(self, watchlist_id: str, run_id: str) -> Dict[str, Any]:
        print("PIPELINE ENTERED", watchlist_id, run_id)

        if not watchlist_id:
            raise ValueError("watchlist_id must be non-empty")
        if not run_id:
            raise ValueError("run_id must be non-empty")

        started_at = _utc_now()
        self._update_run_status(
            run_id=run_id,
            status="running",
            started_at=started_at,
            finished_at=None,
            error=None,
            stats=None,
        )

        stats: Dict[str, Any] = {
            "total_hits": 0,
            "scraped": 0,
            "l0_inserted": 0,
            "l1_upserted": 0,
            "linked": 0,
            "manual_inputs_seeded": 0,
            "invalid_mapped": 0,
            "invalid_reasons": {},
            "fetch": {
                "provider": "playwright",
                "backend": "web",
                "proxy_enabled": _env_bool("BRIGHTDATA_PROXY_ENABLED", True),
                "proxy_host": os.getenv("BRIGHTDATA_PROXY_HOST", "brd.superproxy.io").strip() or "brd.superproxy.io",
                "proxy_port": int(os.getenv("BRIGHTDATA_PROXY_PORT", "7777")),
                "ingestion_mode": _resolve_ingestion_mode(),
                "html_fallback_enabled": _env_bool("IS24_HTML_FALLBACK_ENABLED", True),
                "endpoint_statuses": {},
                "translator_source": None,
                "fallback_used": False,
                "challenge_type": None,
                "challenge_title": None,
                "block_reason": None,
                "challenge_markers": [],
                "captcha": {
                    "enabled": _env_bool("CAPTCHA_SOLVER_ENABLED", False),
                    "attempted": 0,
                    "solved": 0,
                    "skipped": 0,
                    "failed": 0,
                    "error_code_counts": {},
                    "cost_total": 0.0,
                    "max_solves_per_run": int(os.getenv("CAPTCHA_MAX_SOLVES_PER_RUN", "2")),
                },
            },
        }
        session_mgr: Optional[SessionManager] = None
        run_session = None

        try:
            watchlist = self._get_watchlist(watchlist_id)
            if watchlist is None:
                raise RuntimeError(f"Watchlist not found: {watchlist_id}")

            search_url = watchlist["search_url"]
            user_id = watchlist.get("user_id")
            resolved_backend = _resolve_fetch_backend_for_watchlist(watchlist_id)

            l1_upserter = L1Upserter(database_url=self.database_url, table=self.l1_table)
            fetch_stats = stats.get("fetch")
            hits: List[Any] = []
            last_artifact: Optional[Any] = None

            if resolved_backend == "mobile":
                if isinstance(fetch_stats, dict):
                    fetch_stats["provider"] = "mobile_api"
                    fetch_stats["backend"] = "mobile_api"
                    fetch_stats["proxy_enabled"] = False
                    fetch_stats["proxy_host"] = None
                    fetch_stats["proxy_port"] = None
                    fetch_stats["ingestion_mode"] = "mobile_api"
                    fetch_stats["html_fallback_enabled"] = False
                    stats["fetch"] = fetch_stats

                mobile_client = _build_mobile_client()
                mobile_error: Optional[Exception] = None
                try:
                    hits, mobile_meta = _scrape_search_hits_mobile(watchlist, client=mobile_client)
                    if isinstance(fetch_stats, dict):
                        fetch_stats["endpoint_statuses"] = dict(mobile_meta.get("endpoint_statuses") or {})
                        fetch_stats["translator_source"] = mobile_meta.get("translator_source")
                        fetch_stats["fallback_used"] = bool(mobile_meta.get("fallback_used", False))
                        fetch_stats["mobile_total"] = mobile_meta.get("mobile_total")
                        stats["fetch"] = fetch_stats
                except UnsupportedSearchError as exc:
                    mobile_error = exc
                except Exception as exc:
                    mobile_error = exc

                if mobile_error is not None:
                    if _mobile_web_fallback_enabled():
                        resolved_backend = "web"
                        if isinstance(fetch_stats, dict):
                            fetch_stats["fallback_used"] = True
                            fetch_stats["fallback_reason"] = str(mobile_error)
                            fetch_stats["backend"] = "mobile_api_with_web_fallback"
                            stats["fetch"] = fetch_stats
                    else:
                        raise mobile_error

            if resolved_backend == "web":
                session_mgr = SessionManager()
                run_session = session_mgr.start_run_session(
                    watchlist_id=watchlist_id,
                    run_id=run_id,
                )
                client = _build_playwright_client()
                hits = _scrape_search_hits(
                    search_url,
                    client=client,
                    session_id=run_session.session_id,
                    ingestion_mode=_resolve_ingestion_mode(),
                )
                fetch_artifacts = _get_fetch_artifacts(client)
                last_artifact = _get_last_fetch_artifact(client)
                if isinstance(fetch_stats, dict):
                    fetch_stats["provider"] = "playwright"
                    if fetch_stats.get("backend") != "mobile_api_with_web_fallback":
                        fetch_stats["backend"] = "web"
                    if last_artifact is not None:
                        fetch_stats["endpoint_statuses"] = {
                            "search_page": int(getattr(last_artifact, "http_status", 0) or 0)
                        }
                        fetch_stats["challenge_type"] = getattr(last_artifact, "challenge_type", None)
                        fetch_stats["challenge_title"] = getattr(last_artifact, "challenge_title", None)
                        fetch_stats["block_reason"] = getattr(last_artifact, "block_reason", None)
                        fetch_stats["challenge_markers"] = list(getattr(last_artifact, "challenge_markers", []) or [])
                        fetch_stats["captcha"] = _extract_captcha_stats(fetch_artifacts)
                    stats["fetch"] = fetch_stats

            stats["total_hits"] = len(hits)
            if stats["total_hits"] < 1:
                artifact_status = None
                if last_artifact is not None:
                    status_obj = getattr(last_artifact, "status", None)
                    artifact_status = str(getattr(status_obj, "value", status_obj or "")).lower()
                if last_artifact is not None and artifact_status == "blocked":
                    raise RuntimeError(
                        "fetch.reject_block: no listings parsed because request was blocked "
                        f"(challenge_type={getattr(last_artifact, 'challenge_type', None)}, "
                        f"reason={getattr(last_artifact, 'block_reason', None)})"
                    )
                raise RuntimeError(
                    "fetch.no_hits: no listings parsed from search result page "
                    "(likely blocked/challenge page)"
                )

            for hit in hits:
                listing = _build_l1_listing_from_search_hit(hit)
                stats["scraped"] += 1
                missing_fields = _validate_required_listing_fields(listing)
                if missing_fields:
                    stats["invalid_mapped"] += 1
                    invalid_reasons = stats.get("invalid_reasons", {})
                    for field in missing_fields:
                        invalid_reasons[field] = int(invalid_reasons.get(field, 0)) + 1
                    stats["invalid_reasons"] = invalid_reasons
                    continue
                l1_result = l1_upserter.upsert_listing(listing=listing)
                if l1_result.id:
                    stats["l1_upserted"] += 1

                listing_id = l1_result.id
                if not listing_id:
                    continue

                if self._link_listing_to_watchlist(
                    watchlist_id=watchlist_id,
                    listing_id=listing_id,
                    user_id=user_id,
                ):
                    stats["linked"] += 1

                # if self._seed_manual_inputs_if_missing(
                #     watchlist_id=watchlist_id,
                #     listing_id=listing_id,
                #     user_id=user_id,
                #     watchlist_name=watchlist.get("name"),
                #     search_url=search_url,
                #     defaults=defaults,
                # ):
                #     stats["manual_inputs_seeded"] += 1
                

            finished_at = _utc_now()
            self._update_run_status(
                run_id=run_id,
                status="done",
                started_at=started_at,
                finished_at=finished_at,
                error=None,
                stats=stats,
            )
            return stats
        except Exception as exc:
            finished_at = _utc_now()
            error_text = _classify_pipeline_error(exc)
            if (
                session_mgr is not None
                and run_session is not None
                and error_text.startswith("fetch.reject_block:")
                and hasattr(session_mgr, "mark_blocked")
            ):
                session_mgr.mark_blocked(
                    watchlist_id=watchlist_id,
                    run_id=run_id,
                    previous_session_id=getattr(run_session, "session_id", None),
                )
            fetch_stats = stats.get("fetch")
            if isinstance(fetch_stats, dict):
                error_kind = error_text.split(":", 1)[0] if ":" in error_text else "runtime.error"
                fetch_stats["error_kind"] = error_kind
                stats["fetch"] = fetch_stats
            self._update_run_status(
                run_id=run_id,
                status="failed",
                started_at=started_at,
                finished_at=finished_at,
                error=error_text,
                stats=stats,
            )
            raise

    def _get_watchlist(self, watchlist_id: str) -> Optional[Dict[str, Any]]:
        sql = f"""
            select
                id,
                user_id,
                name,
                search_url,
                defaults,
                location_label,
                location_path,
                price_min,
                price_max,
                area_min,
                area_max,
                rooms_min,
                rooms_max
            from {self.watchlists_table}
            where id = %s;
        """
        row = self._fetchone(sql, (watchlist_id,))
        if not row:
            return None
        return {
            "id": str(row[0]),
            "user_id": str(row[1]) if row[1] is not None else None,
            "name": row[2],
            "search_url": row[3],
            "defaults": row[4],
            "location_label": row[5],
            "location_path": row[6],
            "price_min": _coerce_float(row[7]),
            "price_max": _coerce_float(row[8]),
            "area_min": _coerce_float(row[9]),
            "area_max": _coerce_float(row[10]),
            "rooms_min": _coerce_float(row[11]),
            "rooms_max": _coerce_float(row[12]),
        }

    def _update_run_status(
        self,
        *,
        run_id: str,
        status: str,
        started_at: Optional[datetime],
        finished_at: Optional[datetime],
        error: Optional[str],
        stats: Optional[Dict[str, Any]],
    ) -> None:
        sql = f"""
            update {self.runs_table}
            set status = %s,
                started_at = %s,
                finished_at = %s,
                error = %s,
                stats = %s
            where id = %s;
        """
        params = (status, started_at, finished_at, error, stats, run_id)
        self._execute(sql, params, json_param_index=4)

    def _link_listing_to_watchlist(
        self,
        *,
        watchlist_id: str,
        listing_id: str,
        user_id: Optional[str],
    ) -> bool:
        now = _utc_now()
        sql = f"""
            insert into {self.watchlist_listings_table}
                (user_id, watchlist_id, listing_id, first_seen_at, last_seen_at)
            values
                (%s, %s, %s, %s, %s)
            on conflict (watchlist_id, listing_id) do update set
                last_seen_at = excluded.last_seen_at;
        """
        params = (user_id, watchlist_id, listing_id, now, now)
        self._execute(sql, params)
        return True

    def _seed_manual_inputs_if_missing(
        self,
        *,
        watchlist_id: str,
        listing_id: str,
        user_id: Optional[str],
        watchlist_name: Optional[str],
        search_url: str,
        defaults: Dict[str, Any],
    ) -> bool:
        sql_check = f"""
            select 1
            from {self.manual_inputs_table}
            where watchlist_id = %s and listing_id = %s
            limit 1;
        """
        exists = self._fetchone(sql_check, (watchlist_id, listing_id))
        if exists:
            return False

        hausgeld_umlagefaehig = None
        hausgeld_nicht_umlagefaehig = None
        if isinstance(defaults.get("hausgeld"), dict):
            hg = defaults.get("hausgeld") or {}
            try:
                hausgeld_umlagefaehig = float(hg.get("umlagefaehig", 0))
            except Exception:
                hausgeld_umlagefaehig = None
            try:
                hausgeld_nicht_umlagefaehig = float(hg.get("nichtUmlagefaehig", 0))
            except Exception:
                hausgeld_nicht_umlagefaehig = None
        elif defaults.get("hausgeld_monthly_eur") is not None:
            hausgeld_umlagefaehig = defaults.get("hausgeld_monthly_eur")
            hausgeld_nicht_umlagefaehig = 0

        sql_insert = f"""
            insert into {self.manual_inputs_table}
                (
                    user_id,
                    watchlist_id,
                    listing_id,
                    name,
                    search_url,
                    hausgeld_umlagefaehig,
                    hausgeld_nicht_umlagefaehig,
                    notarkosten,
                    grunderwerbssteuer,
                    grundbuchkosten,
                    mietausfall,
                    kaltmiete_pro_qm,
                    zielmodus,
                    ziel_nettorendite,
                    erlaubte_abweichung_nettorendite,
                    ziel_cashflow,
                    erlaubte_abweichung_cashflow,
                    zinssatz,
                    tilgungssatz,
                    instandhaltung_pro_qm_monat,
                    ziel_dscr
                )
            values
                (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
        """
        params = (
            user_id,
            watchlist_id,
            listing_id,
            watchlist_name,
            search_url,
            hausgeld_umlagefaehig,
            hausgeld_nicht_umlagefaehig,
            defaults.get("notarkosten"),
            defaults.get("grunderwerbssteuer"),
            defaults.get("grundbuchkosten"),
            defaults.get("mietausfall"),
            defaults.get("kaltmieteProQm"),
            defaults.get("zielmodus"),
            defaults.get("zielNettorendite"),
            defaults.get("erlaubteAbweichungNettorendite"),
            defaults.get("zielCashflow"),
            defaults.get("erlaubteAbweichungCashflow"),
            defaults.get("zinssatz"),
            defaults.get("tilgungssatz"),
            defaults.get("instandhaltungProQmMonat"),
            defaults.get("zielDscr"),
        )
        self._execute(sql_insert, params)
        return True

    def _execute(self, sql: str, params: Tuple[Any, ...], json_param_index: Optional[int] = None) -> None:
        # --- psycopg2 ---
        if psycopg2 is not None and (json_param_index is None or PgJson is not None):
            with psycopg2.connect(self.database_url) as conn:
                with conn.cursor() as cur:
                    if json_param_index is not None:
                        params = list(params)
                        params[json_param_index] = PgJson(params[json_param_index])
                        cur.execute(sql, tuple(params))
                    else:
                        cur.execute(sql, params)
            return

        # --- psycopg v3 fallback ---
        if psycopg is None:
            raise RuntimeError(
                "No postgres driver found. Install one of:\n"
                "  pip install psycopg2-binary\n"
                "or\n"
                "  pip install psycopg[binary]\n"
            )

        with psycopg.connect(self.database_url) as conn:  # type: ignore
            with conn.cursor() as cur:
                if json_param_index is not None:
                    params = list(params)
                    params[json_param_index] = json.dumps(params[json_param_index], ensure_ascii=False)
                cur.execute(sql, tuple(params))
                conn.commit()

    def _fetchone(self, sql: str, params: Tuple[Any, ...]) -> Optional[Tuple[Any, ...]]:
        # --- psycopg2 ---
        if psycopg2 is not None:
            with psycopg2.connect(self.database_url) as conn:
                with conn.cursor() as cur:
                    cur.execute(sql, params)
                    return cur.fetchone()

        # --- psycopg v3 fallback ---
        if psycopg is None:
            raise RuntimeError(
                "No postgres driver found. Install one of:\n"
                "  pip install psycopg2-binary\n"
                "or\n"
                "  pip install psycopg[binary]\n"
            )

        with psycopg.connect(self.database_url) as conn:  # type: ignore
            with conn.cursor() as cur:
                cur.execute(sql, params)
                return cur.fetchone()


def from_env(
    *,
    env_key: str = "DATABASE_URL",
) -> RunService:
    db_url = os.getenv(env_key)
    if not db_url:
        raise RuntimeError(f"{env_key} not set")
    db_schema = os.getenv("DB_SCHEMA", "public").strip() or "public"
    return RunService(database_url=db_url, db_schema=db_schema, watchlists_schema="public")


def run_watchlist(watchlist_id: str, run_id: str) -> Dict[str, Any]:
    return from_env().run_watchlist(watchlist_id, run_id)


def create_run(watchlist_id: str, *, status: str = "queued") -> str:
    return from_env().create_run(watchlist_id, status=status)


def get_latest_run(watchlist_id: str) -> Optional[Dict[str, Any]]:
    return from_env().get_latest_run(watchlist_id)
