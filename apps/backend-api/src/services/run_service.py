from __future__ import annotations

import os
import sys
import json
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Tuple

from storage.l0_writer import L0Writer
from storage.l1_upserter import L1Upserter

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


def _utc_now() -> datetime:
    return datetime.now(timezone.utc)


def _ensure_scraper_path() -> None:
    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", ".."))
    scraper_src = os.path.join(repo_root, "apps", "scraper", "src")
    if scraper_src not in sys.path:
        sys.path.append(scraper_src)


def _get_brightdata_client():
    _ensure_scraper_path()
    from integrations.brightdata.brightdata_client import (  # type: ignore
        BrightDataConfig,
        BrightDataUnlockerClient,
    )

    cfg = BrightDataConfig()
    if not cfg.api_key:
        raise RuntimeError("BRIGHTDATA_API_KEY not set")
    return BrightDataUnlockerClient(cfg)


def _scrape_search_hits(search_url: str, *, client: Any) -> List[Any]:
    _ensure_scraper_path()
    from mapping.immoscout_search_mapper import parse_search_hits  # type: ignore

    html = client.fetch_html(search_url, render=True)
    return parse_search_hits(html)


def _scrape_expose_listing(external_id: str, expose_url: str, *, client: Any) -> Dict[str, Any]:
    _ensure_scraper_path()
    from mapping.immoscout_expose_mapper import map_expose_html_to_listing  # type: ignore

    html = client.fetch_html(expose_url, render=True)
    return map_expose_html_to_listing(
        external_id=external_id,
        expose_url=expose_url,
        html=html,
    )


@dataclass(frozen=True)
class RunService:
    database_url: str
    runs_table: str = "watchlist_runs"
    watchlists_table: str = "watchlists"
    watchlist_listings_table: str = "watchlist_listings"
    manual_inputs_table: str = "listing_manual_inputs"

    def run_watchlist(self, watchlist_id: str, run_id: str) -> Dict[str, Any]:
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
        }

        try:
            watchlist = self._get_watchlist(watchlist_id)
            if watchlist is None:
                raise RuntimeError(f"Watchlist not found: {watchlist_id}")

            search_url = watchlist["search_url"]
            defaults = watchlist.get("defaults") or {}
            user_id = watchlist.get("user_id")

            l0_writer = L0Writer(database_url=self.database_url)
            l1_upserter = L1Upserter(database_url=self.database_url)

            client = _get_brightdata_client()
            hits = _scrape_search_hits(search_url, client=client)
            stats["total_hits"] = len(hits)

            for hit in hits:
                external_id = getattr(hit, "external_id", None) or hit["external_id"]
                expose_url = getattr(hit, "expose_url", None) or hit["expose_url"]

                listing = _scrape_expose_listing(external_id, expose_url, client=client)
                stats["scraped"] += 1

                l0_result = l0_writer.insert_expose(expose=listing)
                if l0_result.inserted:
                    stats["l0_inserted"] += 1

                listing["latest_l0_id"] = l0_result.id
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

                if self._seed_manual_inputs_if_missing(
                    watchlist_id=watchlist_id,
                    listing_id=listing_id,
                    user_id=user_id,
                    watchlist_name=watchlist.get("name"),
                    search_url=search_url,
                    defaults=defaults,
                ):
                    stats["manual_inputs_seeded"] += 1

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
            self._update_run_status(
                run_id=run_id,
                status="failed",
                started_at=started_at,
                finished_at=finished_at,
                error=str(exc),
                stats=stats,
            )
            raise

    def _get_watchlist(self, watchlist_id: str) -> Optional[Dict[str, Any]]:
        sql = f"""
            select id, user_id, name, search_url, defaults
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

        hausgeld = None
        if isinstance(defaults.get("hausgeld"), dict):
            hg = defaults.get("hausgeld") or {}
            try:
                hausgeld = float(hg.get("umlagefaehig", 0)) + float(hg.get("nichtUmlagefaehig", 0))
            except Exception:
                hausgeld = None
        elif defaults.get("hausgeld_monthly_eur") is not None:
            hausgeld = defaults.get("hausgeld_monthly_eur")

        sql_insert = f"""
            insert into {self.manual_inputs_table}
                (
                    user_id,
                    watchlist_id,
                    listing_id,
                    name,
                    search_url,
                    hausgeld,
                    notarkosten,
                    grunderwerbssteuer,
                    grundbuchkosten,
                    mietausfall,
                    kaltmiete_pro_qm
                )
            values
                (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
        """
        params = (
            user_id,
            watchlist_id,
            listing_id,
            watchlist_name,
            search_url,
            hausgeld,
            defaults.get("notarkosten"),
            defaults.get("grunderwerbssteuer"),
            defaults.get("grundbuchkosten"),
            defaults.get("mietausfall"),
            defaults.get("kaltmieteProQm"),
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
    return RunService(database_url=db_url)


def run_watchlist(watchlist_id: str, run_id: str) -> Dict[str, Any]:
    return from_env().run_watchlist(watchlist_id, run_id)
