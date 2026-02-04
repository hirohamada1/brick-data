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
    ) -> str:
        if not name:
            raise ValueError("name must be non-empty")
        if not search_url:
            raise ValueError("search_url must be non-empty")

        sql = f"""
            insert into {self.table}
                (user_id, name, search_url, defaults)
            values
                (%s, %s, %s, %s)
            returning id;
        """

        # --- psycopg2 ---
        if psycopg2 is not None and PgJson is not None:
            with psycopg2.connect(self.database_url) as conn:
                with conn.cursor() as cur:
                    cur.execute(sql, (user_id, name, search_url, PgJson(defaults)))
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
                    (
                        user_id,
                        name,
                        search_url,
                        json.dumps(defaults, ensure_ascii=False),
                    ),
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
                updated_at
            from {self.table}
            where id = %s;
        """

        # --- psycopg2 ---
        if psycopg2 is not None:
            with psycopg2.connect(self.database_url) as conn:
                with conn.cursor() as cur:
                    cur.execute(sql, (watchlist_id,))
                    row = cur.fetchone()
                    if not row:
                        return None
                    return {
                        "id": str(row[0]),
                        "user_id": str(row[1]) if row[1] is not None else None,
                        "name": row[2],
                        "search_url": row[3],
                        "defaults": row[4],
                        "created_at": row[5],
                        "updated_at": row[6],
                    }

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
                return {
                    "id": str(row[0]),
                    "user_id": str(row[1]) if row[1] is not None else None,
                    "name": row[2],
                    "search_url": row[3],
                    "defaults": row[4],
                    "created_at": row[5],
                    "updated_at": row[6],
                }


def from_env(
    *,
    env_key: str = "DATABASE_URL",
    table: str = "watchlists",
) -> WatchlistService:
    db_url = os.getenv(env_key)
    if not db_url:
        raise RuntimeError(f"{env_key} not set")
    return WatchlistService(database_url=db_url, table=table)


def create_watchlist(name: str, search_url: str, defaults: Dict[str, Any]) -> str:
    return from_env().create_watchlist(name, search_url, defaults)


def get_watchlist(watchlist_id: str) -> Optional[Dict[str, Any]]:
    return from_env().get_watchlist(watchlist_id)
