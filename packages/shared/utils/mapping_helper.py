
def parse_bool(val):
    if val is None:
        return None
    return str(val).lower() == "true"


def parse_image_url(raw: dict) -> str | None:
    images = raw.get("images") or raw.get("pictures") or []
    if not images:
        return None

    url_obj = images[0].get("url") if isinstance(images[0], dict) else None
    if not url_obj:
        return None

    return url_obj.get("@href")


def parse_price(val) -> float | None:
    if val is None:
        return None
    if isinstance(val, (int, float)):
        return float(val)
    try:
        # cleanup string like "1.200,00 EUR" -> 1200.00
        # simple heuristic: remove non-digit/comma/dot, then fix decimal
        s = str(val).replace("EUR", "").replace("€", "").strip()
        s = s.replace(".", "").replace(",", ".")
        return float(s)
    except Exception:
        return None


def parse_rooms(val) -> float | None:
    if val is None:
        return None
    try:
        return float(str(val).replace(",", "."))
    except Exception:
        return None


def parse_sqm(val) -> float | None:
    if val is None:
        return None
    try:
        return float(str(val).replace("m²", "").strip().replace(",", "."))
    except Exception:
        return None
