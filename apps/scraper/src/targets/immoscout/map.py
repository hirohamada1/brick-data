from models.listing import Listing

def map_listing(raw: dict) -> Listing:
    return Listing(
        source="immoscout",
        external_id=raw["id"],
        title=raw.get("title"),
        price_eur=parse_price(raw.get("price")),
        rooms=parse_rooms(raw.get("rooms")),
        living_space_sqm=parse_sqm(raw.get("sqm")),
        address=raw.get("address"),
        details_url=raw.get("url"),
        raw=raw
    )
