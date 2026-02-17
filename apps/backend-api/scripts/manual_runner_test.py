from scraper.is24_client import IS24Client
from pipelines.watchlist_runner import WatchlistRunner
import uuid

from settings import settings


def main():
    runner = WatchlistRunner(
        client=IS24Client(),
        max_pages=1,  # important for first test
    )

    summary = runner.run_watchlist(
        {
            "watchlist_id": str(uuid.uuid4()),
            "search_url": (
                "https://www.immobilienscout24.de/Suche/de/baden-wuerttemberg/stuttgart/wohnung-kaufen?numberofrooms=4.0-&livingspace=-75.0&enteredFrom=result_list"
            ),
            "user_id": str(uuid.uuid4()),
        }
    )  

    
    
    print(summary)


if __name__ == "__main__":
    main()
