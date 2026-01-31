def run_scrape(urls: list[str]):
    html_pages = [brightdata.fetch_html(url) for url in urls]
    raw_listings = parse_all(html_pages)
    listings = [map_listing(r) for r in raw_listings]

    for listing in listings:
        send_listing(DISCORD_WEBHOOK, listing)
