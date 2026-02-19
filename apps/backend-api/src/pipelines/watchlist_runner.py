"""
Run IS24 watchlists against local Postgres in sandbox schema.

Example:
    from pipelines.watchlist_runner import from_env_runner
    runner = from_env_runner()
    summary = runner.run_watchlist({"watchlist_id": "<uuid>", "search_url": "<is24-search-url>"})
"""

from __future__ import annotations

import logging
import os
import re
from dataclasses import dataclass, field
from typing import Any, Dict, Mapping, Optional
from settings import settings

from services.delta_detector import compute_deltas
from services.calculator import CalcInputs, calculate
from scraper.is24_client import IS24Client
from scraper.is24_parser import (
    extract_resultlist_json,
    parse_search_results,
)

try:
    import psycopg
    from psycopg import sql
except Exception:  # pragma: no cover
    psycopg = None
    sql = None


logger = logging.getLogger(__name__)
_SCHEMA_NAME_RE = re.compile(r"^[A-Za-z_][A-Za-z0-9_]*$")


@dataclass
class WatchlistRepository:
    database_url: str
    schema: str = "sandbox"
    source: str = "immoscout"

    def __post_init__(self):
        env = os.getenv("APP_ENV", "local")
        allow_public_override = os.getenv("ALLOW_PUBLIC_WRITES", "false") == "true"

        # Never allow public writes in test
        if env == "test" and self.schema == "public":
            raise RuntimeError("Test environment must not use public schema.")

        # In local or staging → allow
        if env in ("local", "staging"):
            return

        # In prod → require explicit override
        if env == "prod" and not allow_public_override:
            raise RuntimeError(
                "Public schema writes in PROD require ALLOW_PUBLIC_WRITES=true"
            )


    def load_previous_snapshot(self, watchlist_id: str) -> dict[int, dict]:
        self._ensure_db_driver()

        query = """
            select
                l.external_id,
                l.title,
                l.living_space_sqm,
                l.price_eur,
                l.street,
                l.house_number,
                l.city,
                l.postcode,
                l.quarter
            from watchlist_listings wl
            join l1_listings l on l.id = wl.listing_id
            where wl.watchlist_id = %s
              and l.source = %s;
        """
        previous: dict[int, dict] = {}

        with psycopg.connect(self.database_url) as conn:  # type: ignore[union-attr]
            with conn.cursor() as cur:
                self._set_search_path(cur)
                cur.execute(query, (watchlist_id, self.source))
                rows = cur.fetchall()

        for row in rows:
            listing_id = _to_int(row[0])
            if listing_id is None:
                continue
            previous[listing_id] = {
                "listing_id": listing_id,
                "title": row[1],
                "living_space_sqm": _to_float_or_int(row[2]),
                "price_eur": _to_int(row[3]),
                "street": row[4],
                "house_number": row[5],
                "city": row[6],
                "postcode": row[7],
                "quarter": row[8],
            }

        return previous

#Holt die benötigten Daten für die Berechnungen 
    def _load_watchlist_defaults(self, watchlist_id: str) -> dict:
        """Lädt defaults JSONB aus watchlists für den Calculator."""
        self._ensure_db_driver() # Stellt klar, das die Verbindung zur Db bereit ist
        with psycopg.connect(self.database_url) as conn:  # Öffnet mäßig die Tür zur Datenbank und "with" ist wichtig um sie wieder sicher zu schließen
            with conn.cursor() as cur:
                self._set_search_path(cur) # Sagt der Datenbank in welchem Schema sie suchen soll
                cur.execute( # Eigentlicher Befehl an die Datenbank, gibt Inhalt zurück
                    "SELECT defaults FROM watchlists WHERE id = %s",
                    (watchlist_id,),
                )
                row = cur.fetchone() # Holt das Ergebnis
                if row and row[0]: # Wenn ein Ergebnis da ist und es nicht leer ist
                    return row[0] if isinstance(row[0], dict) else {} # Gibt das Ergebnis zurück, wenn es ein Dictionary ist, ansonsten leer
                return {} # Gibt leer zurück, wenn kein Ergebnis da ist

    def persist_run_results(
        self,
        *,
        watchlist_id: str,
        user_id: Optional[str],
        current_listings: list[dict],
        deltas: dict,
    ) -> dict:
        self._ensure_db_driver()

        # Watchlist-Defaults einmal laden (gilt für alle Listings dieser Watchlist)
        defaults = self._load_watchlist_defaults(watchlist_id)

        upserted = 0
        linked = 0
        removed_ids = [str(x) for x in deltas.get("removed_listing_ids", [])]

        with psycopg.connect(self.database_url) as conn:  # type: ignore[union-attr]
            with conn.cursor() as cur:
                self._set_search_path(cur)

                for listing in current_listings:
                    listing_pk = self._upsert_listing(cur, listing)
                    upserted += 1
                    self._link_watchlist_listing(
                        cur,
                        watchlist_id=watchlist_id,
                        listing_pk=listing_pk,
                        user_id=user_id,
                        listing=listing,
                        defaults=defaults,
                    )
                    linked += 1

                if removed_ids:
                    cur.execute(
                        """
                        delete from watchlist_listings wl
                        using l1_listings l
                        where wl.watchlist_id = %s
                          and wl.listing_id = l.id
                          and l.source = %s
                          and l.external_id = any(%s);
                        """,
                        (watchlist_id, self.source, removed_ids),
                    )
            conn.commit()

        return {
            "upserted": upserted,
            "linked": linked,
            "removed_links": len(removed_ids),
        }

    def _upsert_listing(self, cur: Any, listing: dict) -> str:
        listing_id = _to_int(listing.get("listing_id"))
        if listing_id is None:
            raise ValueError("listing_id missing in current listing payload")

        listing_url = f"https://www.immobilienscout24.de/expose/{listing_id}"
        query = """
            insert into l1_listings (
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
            ) values (
                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
            )
            on conflict (source, external_id) do update
            set
                url = excluded.url,
                title = excluded.title,
                price_eur = excluded.price_eur,
                living_space_sqm = excluded.living_space_sqm,
                street = excluded.street,
                house_number = excluded.house_number,
                postcode = excluded.postcode,
                city = excluded.city,
                quarter = excluded.quarter,
                rooms = excluded.rooms,
                updated_at = now()
            returning id;
        """
        cur.execute(
            query,
            (
                self.source,
                str(listing_id),
                listing_url,
                listing.get("title"),
                listing.get("price_eur"),
                listing.get("living_space"),
                listing.get("rooms"),
                listing.get("street"),
                listing.get("house_number"),
                listing.get("postcode"),
                listing.get("city"),
                listing.get("quarter"),
                None,
                None,
            ),
        )
        row = cur.fetchone()
        if row is None or row[0] is None:
            raise RuntimeError("Failed to upsert l1 listing row")
        return str(row[0])

# Die geholten Daten werden hier passig für das calculator.py vorbereitet
# als ein Objekt das calculate aus calculator.py verarbeiten kann
    def _build_calc_inputs(self, listing: dict, defaults: dict) -> Optional[CalcInputs]:
        """Baut CalcInputs aus Listing-Rohdaten + Watchlist-Defaults.
        Gibt None zurück wenn Pflichtfelder fehlen (z.B. kein Preis oder keine Fläche).
        """
        kaufpreis = listing.get("price_eur")
        flaeche = listing.get("living_space")

        # Ohne Kaufpreis oder Fläche ist keine sinnvolle Renditeberechnung möglich
        if not kaufpreis or kaufpreis <= 0 or not flaeche or flaeche <= 0:
            return None

        # Hilfsfunktion zum sicheren Parsen der Defaults ohne Fallback-Zahlen
        def get_opt(key: str) -> Optional[float]:
            val = defaults.get(key)
            return float(val) if val is not None else None

        # Pflichtfelder aus den Watchlist-Einstellungen
        km_pro_qm    = get_opt("kaltmieteProQm")
        zins         = get_opt("zinssatz")
        tilgung      = get_opt("tilgungssatz")
        instand      = get_opt("instandhaltungProQmMonat")
        ausfall      = get_opt("mietausfall")
        notar        = get_opt("notarkosten")
        steuer       = get_opt("grunderwerbssteuer")
        buch         = get_opt("grundbuchkosten")

        # Hausgeld
        hg_obj       = defaults.get("hausgeld") or {}
        hg_umlage    = hg_obj.get("umlagefaehigProzentMiete")
        hg_nicht     = hg_obj.get("nichtUmlagefaehigProzentMiete")

        # Wenn eines der Kern-Parameter fehlt, geben wir None zurück (Datenbank-Felder bleiben leer)
        essentials = [km_pro_qm, zins, tilgung, instand, ausfall, notar, steuer, buch, hg_umlage, hg_nicht]
        if any(v is None for v in essentials):
            logger.warning("Calculation skipped: missing defaults for watchlist_id=%s", defaults.get("id"))
            return None

        # Zielmodus (hat Standard-Fallback im Calculator, hier nur Durchreichen)
        zielmodus_obj = defaults.get("zielmodus") or {}
        zielmodus_type = zielmodus_obj.get("type") or "nettorendite"
        
        return CalcInputs(
            kaufpreis_eur=float(kaufpreis),
            flaeche_qm=float(flaeche),
            kaltmiete_pro_qm=km_pro_qm,
            hausgeld_umlagefaehig_prozent_miete=float(hg_umlage) / 100.0,
            hausgeld_nicht_umlagefaehig_prozent_miete=float(hg_nicht) / 100.0,
            mietausfall_prozent=float(ausfall) / 100.0,
            instandhaltung_eur_pro_qm_monat=instand,
            zinssatz=float(zins) / 100.0,
            tilgungssatz=float(tilgung) / 100.0,
            notarkosten_prozent=float(notar) / 100.0,
            grunderwerbssteuer_prozent=float(steuer) / 100.0,
            grundbuchkosten_prozent=float(buch) / 100.0,
            zielmodus=zielmodus_type,
            ziel_nettorendite=float(zielmodus_obj.get("zielNettorendite")) if zielmodus_obj.get("zielNettorendite") else None,
            ziel_cashflow_eur_monat=float(zielmodus_obj.get("zielCashflow")) if zielmodus_obj.get("zielCashflow") else None,
            erlaubte_abweichung=float(zielmodus_obj.get("erlaubteAbweichung")) if zielmodus_obj.get("erlaubteAbweichung") else None,
        )

#nimmt die ergebnisse aus Schritt 1 und 2 und speichert sie in watchlist_listings
    def _link_watchlist_listing(
        self,
        cur: Any,
        *,
        watchlist_id: str,
        listing_pk: str,
        user_id: Optional[str],
        listing: dict,
        defaults: dict,
    ) -> None:
        from datetime import datetime, timezone

        # Calculator ausführen
        calc_inputs = self._build_calc_inputs(listing, defaults)
        result = calculate(calc_inputs) if calc_inputs else None

        if result:
            cur.execute(
                """
                insert into watchlist_listings (
                    user_id, watchlist_id, listing_id,
                    first_seen_at, last_seen_at,
                    kaufpreis_eur, flaeche_qm,
                    kaltmiete_eur_monat, effektive_miete_eur_monat,
                    hausgeld_total_eur_monat, instandhaltung_eur_monat,
                    noi_eur_monat, zinsen_eur_monat, tilgung_eur_monat,
                    cashflow_eur_monat, nettorendite_prozent_pa, dscr,
                    ziel_abweichung, ziel_erfuellt,
                    calc_source, calculated_at
                ) values (
                    %s, %s, %s, now(), now(),
                    %s, %s, %s, %s, %s, %s,
                    %s, %s, %s, %s, %s, %s,
                    %s, %s, %s, now()
                )
                on conflict (watchlist_id, listing_id) do update set
                    last_seen_at            = excluded.last_seen_at,
                    kaufpreis_eur           = excluded.kaufpreis_eur,
                    flaeche_qm              = excluded.flaeche_qm,
                    kaltmiete_eur_monat     = excluded.kaltmiete_eur_monat,
                    effektive_miete_eur_monat = excluded.effektive_miete_eur_monat,
                    hausgeld_total_eur_monat = excluded.hausgeld_total_eur_monat,
                    instandhaltung_eur_monat = excluded.instandhaltung_eur_monat,
                    noi_eur_monat           = excluded.noi_eur_monat,
                    zinsen_eur_monat        = excluded.zinsen_eur_monat,
                    tilgung_eur_monat       = excluded.tilgung_eur_monat,
                    cashflow_eur_monat      = excluded.cashflow_eur_monat,
                    nettorendite_prozent_pa = excluded.nettorendite_prozent_pa,
                    dscr                    = excluded.dscr,
                    ziel_abweichung         = excluded.ziel_abweichung,
                    ziel_erfuellt           = excluded.ziel_erfuellt,
                    calc_source             = excluded.calc_source,
                    calculated_at           = excluded.calculated_at;
                """,
                (
                    user_id, watchlist_id, listing_pk,
                    calc_inputs.kaufpreis_eur, calc_inputs.flaeche_qm,
                    result.kaltmiete_eur_monat, result.effektive_miete_eur_monat,
                    result.hausgeld_total_eur_monat, result.instandhaltung_eur_monat,
                    result.noi_eur_monat,
                    calc_inputs.kaufpreis_eur * calc_inputs.zinssatz / 12.0,
                    calc_inputs.kaufpreis_eur * calc_inputs.tilgungssatz / 12.0,
                    result.cashflow_eur_monat, result.nettorendite_prozent_pa, result.dscr,
                    result.ziel_abweichung, result.ziel_erfuellt,
                    "defaults",
                ),
            )
        else:
            # Kein Preis vorhanden → nur Verknüpfung ohne Berechnung
            cur.execute(
                """
                insert into watchlist_listings (
                    user_id, watchlist_id, listing_id, first_seen_at, last_seen_at
                ) values (%s, %s, %s, now(), now())
                on conflict (watchlist_id, listing_id) do update
                set last_seen_at = excluded.last_seen_at;
                """,
                (user_id, watchlist_id, listing_pk),
            )

    def _set_search_path(self, cur: Any) -> None:
        assert sql is not None
        cur.execute(sql.SQL("SET search_path TO {}").format(sql.Identifier(self.schema)))

    @staticmethod
    def _ensure_db_driver() -> None:
        if psycopg is None:
            raise RuntimeError("psycopg is required for watchlist runner DB operations")


@dataclass
class WatchlistRunner:
    client: IS24Client = field(default_factory=IS24Client)
    repository: Optional[WatchlistRepository] = None
    max_pages: int = 50

    def run_watchlist(self, watchlist: Mapping[str, Any]) -> Dict[str, Any]:
        watchlist_id = str(watchlist.get("watchlist_id") or watchlist.get("id") or "").strip()
        search_url = str(watchlist.get("search_url") or "").strip()
        user_id = watchlist.get("user_id")

        if not watchlist_id:
            raise ValueError("watchlist must contain watchlist_id (or id)")
        if not search_url:
            raise ValueError("watchlist must contain search_url")

        repository = self.repository
        if repository is None:
            repository = from_env_repository()
        env = os.getenv("APP_ENV", "local")

        # In test, enforce sandbox
        if env == "test" and repository.schema != "sandbox":
            raise RuntimeError("Test environment must use sandbox schema.")


        all_listings: list[dict] = []
        pages_with_results = 0
        page_size: Optional[int] = None

        for page in range(1, self.max_pages + 1):
            # page_url = self.client.build_page_url(search_url, page)
            html = self.client.fetch_search_page(search_url)
            listings = parse_search_results(html)

            if not listings:
                logger.info("Stopping pagination for watchlist=%s at page=%s (empty page)", watchlist_id, page)
                break

            all_listings.extend(listings)
            pages_with_results += 1

            if page_size is None:
                page_size = len(listings)
            elif page_size > 0 and len(listings) < page_size:
                logger.info(
                    "Stopping pagination for watchlist=%s at page=%s (%s < page_size %s)",
                    watchlist_id,
                    page,
                    len(listings),
                    page_size,
                )
                break

        previous = repository.load_previous_snapshot(watchlist_id)
        print("LISTINGS:", all_listings)
        print("PREVIOUS:", previous)
        deltas = compute_deltas(previous=previous, current=all_listings)
        repository.persist_run_results(
            watchlist_id=watchlist_id,
            user_id=_to_optional_str(user_id),
            current_listings=all_listings,
            deltas=deltas,
        )

        return {
            "watchlist_id": watchlist_id,
            "pages": pages_with_results,
            "total": len(all_listings),
            "new": len(deltas.get("new_listings", [])),
            "updated": len(deltas.get("updated_listings", [])),
            "removed": len(deltas.get("removed_listing_ids", [])),
        }


def from_env_repository() -> WatchlistRepository:
    database_url = settings.database_url.strip()
    if not database_url:
        raise RuntimeError("DATABASE_URL not configured")
    schema = settings.watchlist_schema.strip() or "sandbox"
    return WatchlistRepository(database_url=database_url, schema=schema)


def from_env_runner() -> WatchlistRunner:
    return WatchlistRunner(repository=from_env_repository())


def _to_int(value: Any) -> Optional[int]:
    if value is None or isinstance(value, bool):
        return None
    try:
        return int(value)
    except Exception:
        return None


def _to_float_or_int(value: Any) -> Optional[float | int]:
    if value is None:
        return None
    try:
        as_float = float(value)
    except Exception:
        return None
    if as_float.is_integer():
        return int(as_float)
    return as_float


def _to_optional_str(value: Any) -> Optional[str]:
    if value is None:
        return None
    text = str(value).strip()
    return text or None
