from models.listing import Listing
from utils.mapping_helper import parse_bool, parse_image_url, parse_price, parse_rooms, parse_sqm

def map_listing(raw: dict) -> Listing:
    # Mapping to the simple Listing model found in models/listing.py
    # Adapt this as the model evolves.
    return Listing(
        id=str(raw["id"]),
        title=raw.get("title") or f"ImmoScout Listing {raw['id']}",
        price=parse_price(raw.get("price")) or 0.0,
    )