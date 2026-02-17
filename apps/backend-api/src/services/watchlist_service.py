from __future__ import annotations

import os
import json
from dataclasses import dataclass
from typing import Any, Dict, Optional

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


@dataclass(frozen=True)
class WatchlistService:
    database_url: str
    table: str = "watchlists"

    def create_watchlist(
        self,
        name: str,
        search_url: str,
        defaults: Dict[str, Any],
        *,
        user_id: Optional[str] = None,
        location_label: Optional[str] = None,
        location_path: Optional[str] = None,
        price_min: Optional[float] = None,
        price_max: Optional[float] = None,
        area_min: Optional[float] = None,
        area_max: Optional[float] = None,
        rooms_min: Optional[float] = None,
        rooms_max: Optional[float] = None,
    ) -> str:
        if not name:
            raise ValueError("name must be non-empty")
        if not search_url:
            raise ValueError("search_url must be non-empty")

        sql = f"""
            insert into {self.table}
                (user_id, name, search_url, defaults,
                 location_label, location_path,
                 price_min, price_max,
                 area_min, area_max,
                 rooms_min, rooms_max)
            values
                (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            returning id;
        """

        params_base = (
            user_id, name, search_url,
        )
        params_search = (
            location_label, location_path,
            price_min, price_max,
            area_min, area_max,
            rooms_min, rooms_max,
        )

        # --- psycopg2 ---
        if psycopg2 is not None and PgJson is not None:
            with psycopg2.connect(self.database_url) as conn:
                with conn.cursor() as cur:
                    cur.execute(sql, params_base + (PgJson(defaults),) + params_search)
                    row = cur.fetchone()
                    if row and row[0]:
                        return str(row[0])
                    raise RuntimeError("Failed to create watchlist")

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
                cur.execute(
                    sql,
                    params_base + (json.dumps(defaults, ensure_ascii=False),) + params_search,
                )
                row = cur.fetchone()
                conn.commit()
                if row and row[0]:
                    return str(row[0])
                raise RuntimeError("Failed to create watchlist")

    def get_watchlist(self, watchlist_id: str) -> Optional[Dict[str, Any]]:
        if not watchlist_id:
            raise ValueError("watchlist_id must be non-empty")

        sql = f"""
            select
                id,
                user_id,
                name,
                search_url,
                defaults,
                created_at,
                updated_at,
                location_label,
                location_path,
                price_min,
                price_max,
                area_min,
                area_max,
                rooms_min,
                rooms_max
            from {self.table}
            where id = %s;
        """

        def _row_to_dict(row):
            return {
                "id": str(row[0]),
                "user_id": str(row[1]) if row[1] is not None else None,
                "name": row[2],
                "search_url": row[3],
                "defaults": row[4],
                "created_at": row[5],
                "updated_at": row[6],
                "location_label": row[7],
                "location_path": row[8],
                "price_min": float(row[9]) if row[9] is not None else None,
                "price_max": float(row[10]) if row[10] is not None else None,
                "area_min": float(row[11]) if row[11] is not None else None,
                "area_max": float(row[12]) if row[12] is not None else None,
                "rooms_min": float(row[13]) if row[13] is not None else None,
                "rooms_max": float(row[14]) if row[14] is not None else None,
            }

        # --- psycopg2 ---
        if psycopg2 is not None:
            with psycopg2.connect(self.database_url) as conn:
                with conn.cursor() as cur:
                    cur.execute(sql, (watchlist_id,))
                    row = cur.fetchone()
                    if not row:
                        return None
                    return _row_to_dict(row)

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
                cur.execute(sql, (watchlist_id,))
                row = cur.fetchone()
                if not row:
                    return None
                return _row_to_dict(row)


def from_env(
    *,
    env_key: str = "DATABASE_URL",
    table: str = "watchlists",
) -> WatchlistService:
    db_url = os.getenv(env_key)
    if not db_url:
        raise RuntimeError(f"{env_key} not set")
    return WatchlistService(database_url=db_url, table=table)


def create_watchlist(
    name: str,
    search_url: str,
    defaults: Dict[str, Any],
    *,
    location_label: Optional[str] = None,
    location_path: Optional[str] = None,
    price_min: Optional[float] = None,
    price_max: Optional[float] = None,
    area_min: Optional[float] = None,
    area_max: Optional[float] = None,
    rooms_min: Optional[float] = None,
    rooms_max: Optional[float] = None,
) -> str:
    return from_env().create_watchlist(
        name,
        search_url,
        defaults,
        location_label=location_label,
        location_path=location_path,
        price_min=price_min,
        price_max=price_max,
        area_min=area_min,
        area_max=area_max,
        rooms_min=rooms_min,
        rooms_max=rooms_max,
    )


def get_watchlist(watchlist_id: str) -> Optional[Dict[str, Any]]:
    return from_env().get_watchlist(watchlist_id)
