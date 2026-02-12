from scraper.mapping.number_parsing import parse_price_eur
from scraper.models.listing import Listing

def map_listing(raw: dict) -> Listing:
    listing_id = str(raw.get("id") or "")
    if not listing_id:
        raise ValueError("raw listing is missing id")

    title = raw.get("title")
    if not title:
        title = f"ImmoScout Listing {listing_id}"

    price = parse_price_eur(raw.get("price"))
    if price is None:
        price = 0.0

    return Listing(
        id=listing_id,
        title=title,
        price=price,
    )
