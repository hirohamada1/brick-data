import requests

def send_listing(webhook_url: str, listing):
    content = (
        f"🏠 **{listing.title}**\n"
        f"💰 {listing.price_eur} €\n"
        f"📐 {listing.living_space_sqm} m² | {listing.rooms} rooms\n"
        f"📍 {listing.address}\n"
        f"🔗 {listing.details_url}"
    )

    requests.post(webhook_url, json={"content": content})
