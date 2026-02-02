from __future__ import annotations

from typing import Any, Dict, List, Optional, Sequence, Tuple
import json
import re

# -------------------------
# JSON-LD extraction
# -------------------------

_JSONLD_RE = re.compile(
    r'<script[^>]+type="application/ld\+json"[^>]*>(.*?)</script>',
    re.DOTALL | re.IGNORECASE
)


def _try_parse_jsonld(html: str) -> List[dict]:
    blocks: List[dict] = []
    for raw in _JSONLD_RE.findall(html):
        raw = raw.strip()
        if not raw:
            continue
        try:
            data = json.loads(raw)
            if isinstance(data, list):
                blocks.extend([x for x in data if isinstance(x, dict)])
            elif isinstance(data, dict):
                if "@graph" in data and isinstance(data["@graph"], list):
                    blocks.extend([x for x in data["@graph"] if isinstance(x, dict)])
                else:
                    blocks.append(data)
        except Exception:
            continue
    return blocks


def _pick_listing_jsonld(blocks: List[dict]) -> Optional[dict]:
    # heuristic: prefer blocks that look like listing data
    for b in blocks:
        if not isinstance(b, dict):
            continue
        if "address" in b or "image" in b:
            return b
        if b.get("@type") in ("Offer", "Product", "Apartment", "Residence", "House", "SingleFamilyResidence"):
            return b
    return blocks[0] if blocks else None


def _split_street_address(street_address: Optional[str]) -> Tuple[Optional[str], Optional[str]]:
    if not street_address or not isinstance(street_address, str):
        return None, None
    primary = street_address.split(",")[0].strip()
    if not primary:
        return None, None
    tokens = primary.split()
    house_number = None
    idx = None
    for i in range(len(tokens) - 1, -1, -1):
        if any(ch.isdigit() for ch in tokens[i]):
            house_number = tokens[i]
            idx = i
            break
    if idx is None:
        return primary, None
    street = " ".join(tokens[:idx]).strip()
    if not street:
        return primary, None
    return street, house_number


# -------------------------
# Robust number parsing
# -------------------------

_NUM_RE = re.compile(r"(\d+(?:[.,]\d+)?)")
_ALL_NUM_CHARS_RE = re.compile(r"[^\d,\.]")


def _safe_float(x: Any) -> Optional[float]:
    """
    Extract first numeric token and convert to float.
    Handles '65,5', '36 m²'.
    Not suitable for EU thousands formatted prices like '119.500 €' -> use _safe_price_eur().
    """
    try:
        if x is None:
            return None
        if isinstance(x, (int, float)):
            return float(x)

        s = str(x).strip()
        m = _NUM_RE.search(s)
        if not m:
            return None

        num = m.group(1).replace(",", ".")
        return float(num)
    except Exception:
        return None


def _safe_price_eur(x: Any) -> Optional[float]:
    """
    Parse common EU price formats:
      - "119.500 €" -> 119500.0
      - "1.250.000" -> 1250000.0
      - "119500" -> 119500.0
      - "119.500,50 €" -> 119500.50
    """
    try:
        if x is None:
            return None
        if isinstance(x, (int, float)):
            return float(x)

        s = str(x).strip()
        if not s:
            return None

        # keep only digits, dot, comma
        s = _ALL_NUM_CHARS_RE.sub("", s)

        if not s:
            return None

        # If both '.' and ',' exist: assume '.' thousands, ',' decimal
        if "." in s and "," in s:
            s = s.replace(".", "").replace(",", ".")
            return float(s)

        # If only ',' exists: assume decimal comma (could also be thousands but less common)
        if "," in s and "." not in s:
            # heuristic: if exactly 3 digits after comma -> probably thousands separator, else decimal
            left, right = s.split(",", 1)
            if len(right) == 3 and right.isdigit():
                s = left + right
            else:
                s = left + "." + right
            return float(s)

        # If only '.' exists: could be decimal or thousands.
        if "." in s and "," not in s:
            parts = s.split(".")
            # if last group length is 3 and all groups are digits -> treat as thousands separators
            if all(p.isdigit() for p in parts) and len(parts[-1]) == 3 and len(parts) > 1:
                s = "".join(parts)
                return float(s)
            # else treat as decimal
            return float(s)

        # digits only
        return float(s)
    except Exception:
        return None


# -------------------------
# HTML parsing helpers
# -------------------------

_IS24_LIVINGSPACE_RE = re.compile(r'"obj_livingSpace"\s*:\s*"?(?P<val>[\d.,]+)"?', re.IGNORECASE)
_IS24_LIVINGSPACE_ALT_RE = re.compile(r'"obj_livingSpace"\s*"\s*:\s*"?(?P<val>[\d.,]+)"?', re.IGNORECASE)  # optional
_WOHNFLAECHE_LOOSE_RE = re.compile(
    r"Wohnfl(?:ä|ae)che\s*(?:ca\.)?[^0-9]{0,50}(?P<val>\d+(?:[.,]\d+)?)\s*(?:m²|m&#178;|qm)",
    re.IGNORECASE | re.DOTALL,
)
_WOHNFLAECHE_REVERSED_LOOSE_RE = re.compile(
    r"(?P<val>\d+(?:[.,]\d+)?)\s*(?:m²|m&#178;|qm)[^A-Za-zÄÖÜäöüß]{0,40}Wohnfl(?:ä|ae)che\s*(?:ca\.)?",
    re.IGNORECASE | re.DOTALL,
)

_TAG_RE = re.compile(r"<[^>]+>")


def _strip_tags(s: str) -> str:
    return re.sub(r"\s+", " ", _TAG_RE.sub(" ", s)).strip()


_SQM_DTDD_RE = re.compile(
    r"""
    <dt[^>]*>\s*
        (Wohnfläche|Wohnflaeche)\s*(?:ca\.)?
    \s*</dt>\s*
    <dd[^>]*>\s*
        (?P<val>.*?)
    \s*</dd>
    """,
    re.IGNORECASE | re.DOTALL | re.VERBOSE
)

_SQM_MAINCRITERIA_RE = re.compile(
    r"""
    <div[^>]*class="[^"]*\bmainCriteria\b[^"]*"[^>]*>.*?
        <div[^>]*class="[^"]*\bis24qa-wohnflaeche-ca-main\b[^"]*"[^>]*>
            (?P<val>.*?)
        </div>.*?
        <div[^>]*class="[^"]*\bis24qa-wohnflaeche-ca-main-label\b[^"]*"[^>]*>
            \s*Wohnfl(?:ä|ae)che\s*ca\.\s*
        </div>.*?
    </div>
    """,
    re.IGNORECASE | re.DOTALL | re.VERBOSE
)

_ROOMS_DTDD_RE = re.compile(
    r"""
    <dt[^>]*>\s*
        (Zimmer|Anzahl\s*Zimmer|Zimmeranzahl)
    \s*</dt>\s*
    <dd[^>]*>\s*
        (?P<val>.*?)
    \s*</dd>
    """,
    re.IGNORECASE | re.DOTALL | re.VERBOSE
)

_POSTCODE_CITY_RE = re.compile(
    r"(\b\d{5}\b)\s+([A-ZÄÖÜ][A-Za-zÄÖÜäöüß\- ]{2,})"
)

_IMG_URL_RE = re.compile(
    r"https?://[^\"'\\]+?\.(?:jpg|jpeg|png|webp)",
    re.IGNORECASE
)

_STREET_AND_HOUSE_RE = re.compile(
    r'"streetAndHouseNumber"\s*:\s*"([^"]+)"',
    re.IGNORECASE
)

_ADDRESS_STREET_HOUSE_RE = re.compile(
    r'"address"\s*:\s*\{[^}]{0,500}?"street"\s*:\s*"([^"]+)"[^}]{0,200}?"houseNumber"\s*:\s*"([^"]+)"',
    re.IGNORECASE | re.DOTALL
)

_ADDRESS_BLOCK_RE = re.compile(
    r'<span[^>]+data-qa="is24-expose-address"[^>]*>[\s\S]{0,2000}?</span>',
    re.IGNORECASE
)


def _extract_living_space_sqm_from_html(html: str) -> Optional[float]:
    m0 = _IS24_LIVINGSPACE_RE.search(html)
    if m0:
        sqm = _safe_float(m0.group("val"))
        if sqm is not None:
            return sqm

    # 1) dt/dd variant
    m = _SQM_DTDD_RE.search(html)
    if m:
        val = _strip_tags(m.group("val"))
        sqm = _safe_float(val)
        if sqm is not None:
            return sqm

    # 2) mainCriteria variant
    m2 = _SQM_MAINCRITERIA_RE.search(html)
    if m2:
        val = _strip_tags(m2.group("val"))
        sqm = _safe_float(val)
        if sqm is not None:
            return sqm

    # 3) loose text fallback (label then number)
    m3 = _WOHNFLAECHE_LOOSE_RE.search(html)
    if m3:
        sqm = _safe_float(m3.group("val"))
        if sqm is not None:
            return sqm

    # 4) loose text fallback (number then label)
    m4 = _WOHNFLAECHE_REVERSED_LOOSE_RE.search(html)
    if m4:
        sqm = _safe_float(m4.group("val"))
        if sqm is not None:
            return sqm

    return None


def _extract_rooms_from_html(html: str) -> Optional[float]:
    m = _ROOMS_DTDD_RE.search(html)
    if m:
        val = _strip_tags(m.group("val"))
        return _safe_float(val)
    return None


def _extract_street_house_from_html(html: str) -> Tuple[Optional[str], Optional[str]]:
    m = _STREET_AND_HOUSE_RE.search(html)
    if m:
        return _split_street_address(m.group(1))

    m2 = _ADDRESS_STREET_HOUSE_RE.search(html)
    if m2:
        street = m2.group(1).strip()
        house_number = m2.group(2).strip()
        return street or None, house_number or None

    m3 = _ADDRESS_BLOCK_RE.search(html)
    if m3:
        text = _strip_tags(m3.group(0))
        if "vollständige adresse" in text.lower():
            return None, None
        parts = [p.strip() for p in text.split("\n") if p.strip()]
        for part in parts:
            if _POSTCODE_CITY_RE.search(part):
                continue
            if any(ch.isdigit() for ch in part):
                return _split_street_address(part)

    return None, None


def map_expose_html_to_listing(*, external_id: str, expose_url: str, html: str) -> Dict[str, Any]:
    jsonlds = _try_parse_jsonld(html)
    best = _pick_listing_jsonld(jsonlds) or {}

    # -------------------------
    # Address (JSON-LD)
    # -------------------------
    addr = best.get("address") if isinstance(best.get("address"), dict) else {}
    postcode: Optional[str] = addr.get("postalCode")
    city: Optional[str] = addr.get("addressLocality")
    street: Optional[str] = None
    house_number: Optional[str] = None
    street_address = addr.get("streetAddress")
    if isinstance(street_address, str):
        street, house_number = _split_street_address(street_address)

    # -------------------------
    # Images (JSON-LD first)
    # -------------------------
    images: List[str] = []
    img = best.get("image")
    if isinstance(img, list):
        images = [x for x in img if isinstance(x, str)]
    elif isinstance(img, str):
        images = [img]

    # -------------------------
    # living_space_sqm / rooms (JSON-LD first)
    # -------------------------
    living_space_sqm: Optional[float] = None
    rooms: Optional[float] = None

    floor_size = best.get("floorSize")
    if isinstance(floor_size, dict):
        living_space_sqm = _safe_float(floor_size.get("value"))
    elif floor_size is not None:
        living_space_sqm = _safe_float(floor_size)

    rooms = _safe_float(best.get("numberOfRooms"))

    # -------------------------
    # Fallback: parse HTML
    # -------------------------
    if living_space_sqm is None:
        living_space_sqm = _extract_living_space_sqm_from_html(html)

    if rooms is None:
        rooms = _extract_rooms_from_html(html)

    # -------------------------
    # Sanity guards
    # -------------------------
    if living_space_sqm is not None and not (10 <= living_space_sqm <= 500):
        living_space_sqm = None

    if rooms is not None and rooms > 20:
        rooms = None

    # -------------------------
    # Postcode/city fallback
    # -------------------------
    if postcode is None or city is None:
        m = _POSTCODE_CITY_RE.search(html)
        if m:
            postcode = postcode or m.group(1)
            city = city or m.group(2).strip()

    # -------------------------
    # Images fallback
    # -------------------------
    if not images:
        images = list(dict.fromkeys(_IMG_URL_RE.findall(html)))

    # Address fallback
    if street is None or house_number is None:
        fb_street, fb_house = _extract_street_house_from_html(html)
        street = street or fb_street
        house_number = house_number or fb_house

    # -------------------------
    # Title & price from JSON-LD
    # -------------------------
    title = best.get("name")

    price_eur: Optional[float] = None
    offers = best.get("offers")
    if isinstance(offers, dict):
        price_eur = _safe_price_eur(offers.get("price"))

    quarter = None

    return {
        "source": "immoscout",
        "external_id": external_id,
        "url": expose_url,
        "title": title,
        "price_eur": price_eur,
        "living_space_sqm": living_space_sqm,
        "rooms": rooms,
        "street": street,
        "house_number": house_number,
        "postcode": postcode,
        "city": city,
        "quarter": quarter,
        "images": images,
    }
