import re
import json5


def extract_resultlist_json(html: str) -> dict:
    pattern = r'IS24\.resultList\s*=\s*({.*?});'
    match = re.search(pattern, html, re.DOTALL)

    if match:
        return json5.loads(match.group(1))

    # 🔥 Fallback: raw JSON inside <script> without IS24 wrapper
    try:
        # Extract first {...} block inside script
        script_match = re.search(r"<script[^>]*>(.*?)</script>", html, re.DOTALL)
        if script_match:
            candidate = script_match.group(1).strip()
            return json5.loads(candidate)
    except Exception:
        pass

    raise ValueError("Search payload not found")



def parse_search_results(html: str) -> list[dict]:
    data = extract_resultlist_json(html)

    # 🔥 Case 1: Real IS24 structure
    if "resultListModel" in data:
        entries = (
            data["resultListModel"]
                ["searchResponseModel"]
                ["resultlist.resultlist"]
                ["resultlistEntries"][0]
                ["resultlistEntry"]
        )

    # 🔥 Case 2: Simplified test JSON
    elif "resultlistEntries" in data:
        entries = data["resultlistEntries"][0]["resultlistEntry"]

    else:
        raise ValueError("Unsupported search payload structure")

    normalized = []

    for entry in entries:
        real = entry["resultlist.realEstate"]

        normalized.append({
            "source": "is24",
            "listing_id": entry["realEstateId"],
            "title": real.get("title"),
            "price_eur": real.get("price", {}).get("value"),
            "living_space": real.get("livingSpace"),
            "rooms": real.get("numberOfRooms"),
            "postcode": real.get("address", {}).get("postcode"),
            "city": real.get("address", {}).get("city"),
            "quarter": real.get("address", {}).get("quarter"),
            "published_at": entry.get("@publishDate"),
            "modified_at": entry.get("@modification"),
        })

    return normalized
