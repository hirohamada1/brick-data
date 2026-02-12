from __future__ import annotations

import os
import json
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Tuple

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


def _get_brightdata_client():
    from scraper.integrations.brightdata.brightdata_client import (  # type: ignore
        BrightDataConfig,
        BrightDataUnlockerClient,
    )

    cfg = BrightDataConfig()
    if not cfg.api_key:
        raise RuntimeError("BRIGHTDATA_API_KEY not set")
    return BrightDataUnlockerClient(cfg)


def _scrape_search_hits(search_url: str, *, client: Any) -> List[Any]:
    from scraper.mapping.immoscout_search_mapper import parse_search_hits  # type: ignore

    html = client.fetch_html(search_url, render=True)
    return parse_search_hits(html)


def _coerce_float(value: Any) -> Optional[float]:
    try:
        if value is None:
            return None
        if isinstance(value, (int, float)):
            return float(value)
        return float(str(value).strip().replace(",", "."))
    except Exception:
        return None


def _get_hit_value(hit: Any, key: str) -> Any:
    if isinstance(hit, dict):
        return hit.get(key)
    return getattr(hit, key, None)


def _build_l1_listing_from_search_hit(hit: Any) -> Dict[str, Any]:
    external_id = _get_hit_value(hit, "external_id")
    expose_url = _get_hit_value(hit, "expose_url")
    source = _get_hit_value(hit, "source") or "immoscout"

    return {
        "source": source,
        "external_id": external_id,
        "url": expose_url,
        "title": _get_hit_value(hit, "title"),
        "price_eur": _coerce_float(_get_hit_value(hit, "price_eur")),
        "living_space_sqm": _coerce_float(_get_hit_value(hit, "living_space_sqm")),
        "rooms": _coerce_float(_get_hit_value(hit, "rooms")),
        "street": None,
        "house_number": None,
        "postcode": _get_hit_value(hit, "postcode"),
        "city": _get_hit_value(hit, "city"),
        "quarter": None,
        "images": [],
        "latest_l0_id": None,
    }


@dataclass(frozen=True)
class RunService:
    database_url: str
    runs_table: str = "watchlist_runs"
    watchlists_table: str = "watchlists"
    watchlist_listings_table: str = "watchlist_listings"
    manual_inputs_table: str = "listing_manual_inputs"

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
        }

        try:
            watchlist = self._get_watchlist(watchlist_id)
            if watchlist is None:
                raise RuntimeError(f"Watchlist not found: {watchlist_id}")

            search_url = watchlist["search_url"]
            defaults = watchlist.get("defaults") or {}
            user_id = watchlist.get("user_id")

            l1_upserter = L1Upserter(database_url=self.database_url)

            client = _get_brightdata_client()
            hits = _scrape_search_hits(search_url, client=client)
            stats["total_hits"] = len(hits)

            for hit in hits:
                listing = _build_l1_listing_from_search_hit(hit)
                stats["scraped"] += 1
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
    return RunService(database_url=db_url)


def run_watchlist(watchlist_id: str, run_id: str) -> Dict[str, Any]:
    return from_env().run_watchlist(watchlist_id, run_id)


def create_run(watchlist_id: str, *, status: str = "queued") -> str:
    return from_env().create_run(watchlist_id, status=status)


def get_latest_run(watchlist_id: str) -> Optional[Dict[str, Any]]:
    return from_env().get_latest_run(watchlist_id)
