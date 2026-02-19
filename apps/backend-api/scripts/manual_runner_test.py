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
        "watchlist_id": "712a0265-e482-4412-8555-c02517c3804e",
        "search_url": (
            "https://www.immobilienscout24.de/Suche/de/baden-wuerttemberg/stuttgart/wohnung-kaufen?numberofrooms=4.0-&livingspace=-75.0&enteredFrom=result_list"
        ),
        "user_id": "7e56adee-8281-4369-bd08-b309c64f5dba",
    }
    ) 

    
    
    print(summary)


if __name__ == "__main__":
    main()
