
import json
import random
import time
import urllib.request
from typing import Dict, Any

# Deine Webhook URL
WEBHOOK_URL = "https://discord.com/api/webhooks/1470944541409415303/4Bs66ycyRJEXHPuaGH23oOLUz9_xeYx8z7PO9Jo2AJFDNFG8j-0zM67p7pbb_fOo3DCu"

def generate_mock_listing() -> Dict[str, Any]:
    """Generiert ein zufälliges Inserat mit realistischen Daten."""
    streets = ["Hauptstraße", "Bahnhofstraße", "Goethestraße", "Schillerstraße", "Berliner Allee", "Lindenweg"]
    cities = ["Berlin", "München", "Hamburg", "Köln", "Frankfurt", "Stuttgart", "Magdeburg"]
    
    listing_id = random.randint(100000000, 999999999)
    rooms = random.choice([1, 1.5, 2, 2.5, 3, 3.5, 4, 5])
    area = round(random.uniform(30.0, 150.0), 2)
    # Preislogik: ca. 3000-8000 €/m² je nach Stadt (simuliert)
    price_per_sqm = random.uniform(3000, 8000)
    price = round(area * price_per_sqm, -3) # Auf 1000 runden
    
    city = random.choice(cities)
    
    return {
        "id": str(listing_id),
        "title": f"Moderne {rooms}-Zimmer-Wohnung in {city} - Top Lage!",
        "address": {
            "street": random.choice(streets),
            "house_number": f"{random.randint(1, 150)}{random.choice(['', 'a', 'b', 'c'])}",
            "zip_code": f"{random.randint(10000, 99999)}",
            "city": city
        },
        "price": price,
        "living_space": area,
        "rooms": rooms,
        "link": f"https://www.immobilienscout24.de/expose/{listing_id}",
        "warm_rent": round(price * 0.003 + 200, 2) # Grobe Schätzung für Warmmiete (irrelevant für Kauf, aber als Extra)
    }

def format_currency(value):
    return "{:,.2f} €".format(value).replace(",", "X").replace(".", ",").replace("X", ".")

def send_discord_notification(listing: Dict[str, Any]):
    """Sendet eine formatierte Nachricht an Discord."""
    
    # Farben für den Seitenstreifen (Embed Color)
    embed_color = 5814783 # Ein schönes Blau/Grün

    address_str = f"{listing['address']['street']} {listing['address']['house_number']}\n{listing['address']['zip_code']} {listing['address']['city']}"
    
    embed = {
        "title": f"🏠 Neues Inserat gefunden: {listing['title']}",
        "url": listing['link'],
        "color": embed_color,
        "fields": [
            {
                "name": "Preis",
                "value": format_currency(listing['price']),
                "inline": True
            },
            {
                "name": "Wohnfläche",
                "value": f"{listing['living_space']} m²",
                "inline": True
            },
            {
                "name": "Zimmer",
                "value": str(listing['rooms']),
                "inline": True
            },
            {
                "name": "Adresse",
                "value": address_str,
                "inline": False # Eigene Zeile für Adresse
            }
        ],
        "footer": {
            "text": f"ID: {listing['id']} • ImmoScan Bot 🤖"
        },
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S.000Z", time.gmtime())
    }

    payload = {
        "username": "ImmoScan",
        "avatar_url": "https://cdn-icons-png.flaticon.com/512/263/263115.png", # Haus-Icon
        "embeds": [embed]
    }

    req = urllib.request.Request(
        WEBHOOK_URL,
        data=json.dumps(payload).encode('utf-8'),
        headers={
            'Content-Type': 'application/json',
            'User-Agent': 'ImmoScan/1.0 (Python/3.9)'
        }
    )

    try:
        with urllib.request.urlopen(req) as response:
            print(f"✅ Nachricht gesendet! Status: {response.status}")
    except urllib.error.HTTPError as e:
        print(f"❌ Fehler beim Senden: {e.code} {e.reason}")
        print(e.read().decode())

if __name__ == "__main__":
    print("🚀 Starte Mock-Notifier...")
    # Simulieren wir mal 3 Inserate mit kleiner Pause
    for i in range(1):
        listing = generate_mock_listing()
        print(f"Generiere Inserat: {listing['title']}...")
        send_discord_notification(listing)
