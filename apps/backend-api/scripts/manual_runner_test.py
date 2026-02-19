import psycopg
import logging
from scraper.is24_client import IS24Client
from pipelines.watchlist_runner import WatchlistRunner
from settings import settings

# Logging, damit man im Terminal sehen, was passiert
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_all_watchlists():
    """Holt alle konfigurierten Watchlists aus der Datenbank."""
    watchlists = []
    # Verbindung zur DB aufbauen (gleiche Logik wie im Runner)
    with psycopg.connect(settings.database_url) as conn:
        with conn.cursor() as cur:
            # Wir holen ID, Search-URL und User-ID
            cur.execute("SELECT id, search_url, user_id, name FROM public.watchlists")
            for row in cur.fetchall():
                watchlists.append({
                    "watchlist_id": str(row[0]),
                    "search_url": row[1],
                    "user_id": str(row[2]) if row[2] else None,
                    "name": row[3]
                })
    return watchlists

def main():
    # 1. Runner initialisieren
    runner = WatchlistRunner(
        client=IS24Client(),
        max_pages=1, 
    )

    # 2. Alle Watchlists aus der DB laden
    print("Suche nach Watchlists in der Datenbank...")
    active_watchlists = get_all_watchlists()
    
    if not active_watchlists:
        print("Keine aktiven Watchlists in public.watchlists gefunden.")
        return

    print(f"{len(active_watchlists)} Watchlists gefunden. Starte Verarbeitung...\n")

    # 3. Schleife: Jede Watchlist nacheinander abarbeiten
    for wl in active_watchlists:
        print(f"--- Starte Run für: {wl['name']} ({wl['watchlist_id']}) ---")
        try:
            summary = runner.run_watchlist(wl)
            print(f"Ergebnis: {summary}\n")
        except Exception as e:
            print(f"Fehler bei Watchlist {wl['watchlist_id']}: {e}\n")

    print("Verarbeitung abgeschlossen.")

if __name__ == "__main__":
    main()