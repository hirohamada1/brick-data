from scraper.is24_client import IS24Client
from scraper.is24_parser import parse_search_results


def main():
    client = IS24Client()

    url = (
        "https://www.immobilienscout24.de/Suche/de/baden-wuerttemberg/stuttgart/wohnung-kaufen?numberofrooms=4.0-&livingspace=-75.0&enteredFrom=result_list"
    )

    print("Fetching page...")
    html = client.fetch_search_page(url)

    print(f"HTML length: {len(html)}")

    listings = parse_search_results(html)

    print(f"Found {len(listings)} listings\n")

    for listing in listings[:3]:
        print(listing)


if __name__ == "__main__":
    main()
