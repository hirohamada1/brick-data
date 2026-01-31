from __future__ import annotations

from typing import Any, Dict, List, Optional
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
    for b in blocks:
        if not isinstance(b, dict):
            continue
        if "address" in b or "image" in b:
            return b
        if b.get("@type") in ("Offer", "Product", "Apartment", "Residence", "House", "SingleFamilyResidence"):
            return b
    return blocks[0] if blocks else None


# -------------------------
# Robust number parsing
# -------------------------

_NUM_RE = re.compile(r"(\d+(?:[.,]\d+)?)")


def _safe_float(x: Any) -> Optional[float]:
    try:
        if x is None:
            return None
        if isinstance(x, (int, float)):
            return float(x)

        s = str(x).strip()
        m = _NUM_RE.search(s)
        if not m:
            return None

        return float(m.group(1).replace(",", "."))
    except Exception:
        return None


# -------------------------
# HTML parsing helpers
# -------------------------

_TAG_RE = re.compile(r"<[^>]+>")


def _strip_tags(s: str) -> str:
    return re.sub(r"\s+", " ", _TAG_RE.sub(" ", s)).strip()


# Key improvement for no-JS pages:
# these appear in the big JSON-ish blob in the HTML
_OBJ_LIVINGSPACE_RE = re.compile(r'"obj_livingSpace"\s*:\s*"([^"]+)"')
_OBJ_ROOMS_RE = re.compile(r'"obj_noRooms"\s*:\s*"([^"]+)"')

# dt/dd variant
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

# mainCriteria variant
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

# super-loose text fallback for no-JS rendered content:
# handles either "Wohnfläche ca." then value or value then label within a short window
_SQM_TEXT_AFTER_RE = re.compile(
    r"Wohnfl(?:ä|ae)che\s*ca\.\s*[:\-]?\s*(\d+(?:[.,]\d+)?)\s*m",
    re.IGNORECASE
)
_SQM_TEXT_BEFORE_RE = re.compile(
    r"(\d+(?:[.,]\d+)?)\s*m(?:²|&sup2;|&#178;)?\s*Wohnfl(?:ä|ae)che\s*ca\.",
    re.IGNORECASE
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

_POSTCODE_CITY_RE = re.compile(r"(\b\d{5}\b)\s+([A-ZÄÖÜ][A-Za-zÄÖÜäöüß\- ]{2,})")
_IMG_URL_RE = re.compile(r"https?://[^\"'\\]+?\.(?:jpg|jpeg|png|webp)", re.IGNORECASE)


def _extract_living_space_sqm_from_html(html: str) -> Optional[float]:
    # 0) best for no-JS pages: obj_livingSpace in embedded blob
    m0 = _OBJ_LIVINGSPACE_RE.search(html)
    if m0:
        return _safe_float(m0.group(1))

    # 1) dt/dd variant
    m = _SQM_DTDD_RE.search(html)
    if m:
        return _safe_float(_strip_tags(m.group("val")))

    # 2) mainCriteria variant
    m2 = _SQM_MAINCRITERIA_RE.search(html)
    if m2:
        return _safe_float(_strip_tags(m2.group("val")))

    # 3) no-JS visible text fallback
    m3 = _SQM_TEXT_AFTER_RE.search(html)
    if m3:
        return _safe_float(m3.group(1))

    m4 = _SQM_TEXT_BEFORE_RE.search(html)
    if m4:
        return _safe_float(m4.group(1))

    return None


def _extract_rooms_from_html(html: str) -> Optional[float]:
    # 0) best for no-JS pages: obj_noRooms in embedded blob
    m0 = _OBJ_ROOMS_RE.search(html)
    if m0:
        return _safe_float(m0.group(1))

    # 1) dt/dd variant
    m = _ROOMS_DTDD_RE.search(html)
    if m:
        return _safe_float(_strip_tags(m.group("val")))

    return None


def map_expose_html_to_listing(*, external_id: str, expose_url: str, html: str) -> Dict[str, Any]:
    jsonlds = _try_parse_jsonld(html)
    best = _pick_listing_jsonld(jsonlds) or {}

    # Address (JSON-LD)
    addr = best.get("address") if isinstance(best.get("address"), dict) else {}
    postcode: Optional[str] = addr.get("postalCode")
    city: Optional[str] = addr.get("addressLocality")

    # Images (JSON-LD first)
    images: List[str] = []
    img = best.get("image")
    if isinstance(img, list):
        images = [x for x in img if isinstance(x, str)]
    elif isinstance(img, str):
        images = [img]

    # living_space_sqm / rooms (JSON-LD first)
    living_space_sqm: Optional[float] = None
    rooms: Optional[float] = None

    floor_size = best.get("floorSize")
    if isinstance(floor_size, dict):
        living_space_sqm = _safe_float(floor_size.get("value"))
    elif floor_size is not None:
        living_space_sqm = _safe_float(floor_size)

    rooms = _safe_float(best.get("numberOfRooms"))

    # Fallback: HTML
    if living_space_sqm is None:
        living_space_sqm = _extract_living_space_sqm_from_html(html)

    if rooms is None:
        rooms = _extract_rooms_from_html(html)

    # Sanity guards
    if living_space_sqm is not None and not (10 <= living_space_sqm <= 500):
        living_space_sqm = None
    if rooms is not None and rooms > 20:
        rooms = None

    # Postcode/city fallback
    if postcode is None or city is None:
        m = _POSTCODE_CITY_RE.search(html)
        if m:
            postcode = postcode or m.group(1)
            city = city or m.group(2).strip()

    # Images fallback
    if not images:
        images = list(dict.fromkeys(_IMG_URL_RE.findall(html)))

    # Title & price from JSON-LD
    title = best.get("name")
    price_eur: Optional[float] = None
    offers = best.get("offers")
    if isinstance(offers, dict):
        price_eur = _safe_float(offers.get("price"))

    quarter = None

    return {
        "source": "immoscout",
        "external_id": external_id,
        "url": expose_url,
        "title": title,
        "price_eur": price_eur,
        "living_space_sqm": living_space_sqm,
        "rooms": rooms,
        "postcode": postcode,
        "city": city,
        "quarter": quarter,
        "images": images,
    }