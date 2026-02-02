# storage/l1_upserter.py
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
class L1UpsertResult:
    id: Optional[str]


@dataclass(frozen=True)
class L1Upserter:
    """
    Upserts normalized L1 listing rows to Postgres table `l1_listings`.

    - Conflict key: (source, external_id)
    - Updates the latest normalized fields and pointer to latest_l0_id
    """
    database_url: str
    table: str = "l1_listings"

    def upsert_listing(self, *, listing: Dict[str, Any]) -> L1UpsertResult:
        """
        listing: normalized dict like:
          {
            'source': 'immoscout',
            'external_id': '...',
            'url': '...',
            'title': '...',
            'price_eur': 123.45,
            'living_space_sqm': 80.0,
            'rooms': 3,
            'street': '...',
            'house_number': '...',
            'postcode': '...',
            'city': '...',
            'quarter': '...',
            'images': ['https://...'],
            'latest_l0_id': 'uuid'
          }
        """
        source = str(listing.get("source") or "")
        external_id = str(listing.get("external_id") or "")
        url = str(listing.get("url") or "")

        if not source or not external_id or not url:
            raise ValueError("listing must include non-empty: source, external_id, url")

        sql = f"""
            insert into {self.table}
                (
                    source,
                    external_id,
                    url,
                    title,
                    price_eur,
                    living_space_sqm,
                    rooms,
                    street,
                    house_number,
                    postcode,
                    city,
                    quarter,
                    images,
                    latest_l0_id
                )
            values
                (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            on conflict (source, external_id) do update set
                url = excluded.url,
                title = excluded.title,
                price_eur = excluded.price_eur,
                living_space_sqm = excluded.living_space_sqm,
                rooms = excluded.rooms,
                street = excluded.street,
                house_number = excluded.house_number,
                postcode = excluded.postcode,
                city = excluded.city,
                quarter = excluded.quarter,
                images = excluded.images,
                latest_l0_id = excluded.latest_l0_id
            returning id;
        """

        params = (
            source,
            external_id,
            url,
            listing.get("title"),
            listing.get("price_eur"),
            listing.get("living_space_sqm"),
            listing.get("rooms"),
            listing.get("street"),
            listing.get("house_number"),
            listing.get("postcode"),
            listing.get("city"),
            listing.get("quarter"),
            listing.get("images"),
            listing.get("latest_l0_id"),
        )

        # --- psycopg2 ---
        if psycopg2 is not None and PgJson is not None:
            with psycopg2.connect(self.database_url) as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        sql,
                        (
                            params[0],
                            params[1],
                            params[2],
                            params[3],
                            params[4],
                            params[5],
                            params[6],
                            params[7],
                            params[8],
                            params[9],
                            params[10],
                            params[11],
                            PgJson(params[12]) if params[12] is not None else None,
                            params[13],
                        ),
                    )
                    row = cur.fetchone()
                    if row and row[0]:
                        return L1UpsertResult(id=str(row[0]))
                    return L1UpsertResult(id=None)

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
                        params[0],
                        params[1],
                        params[2],
                        params[3],
                        params[4],
                        params[5],
                        params[6],
                        params[7],
                        params[8],
                        params[9],
                        params[10],
                        params[11],
                        json.dumps(params[12], ensure_ascii=False)
                        if params[12] is not None
                        else None,
                        params[13],
                    ),
                )
                row = cur.fetchone()
                conn.commit()
                if row and row[0]:
                    return L1UpsertResult(id=str(row[0]))
                return L1UpsertResult(id=None)


def from_env(
    *,
    env_key: str = "DATABASE_URL",
    table: str = "l1_listings",
) -> L1Upserter:
    db_url = os.getenv(env_key)
    if not db_url:
        raise RuntimeError(f"{env_key} not set")
    return L1Upserter(database_url=db_url, table=table)
