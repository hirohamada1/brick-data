# scraping/immoscout_expose_scraper.py
from __future__ import annotations

import json
import re
import logging
from dataclasses import dataclass
from typing import Any, Dict, Optional

from integrations.brightdata.brightdata_client import BrightDataUnlockerClient
from models.listing import Listing
from targets.immoscout.map import map_listing

from pprint import pformat


LD_JSON_RE = re.compile(
    r'<script[^>]+type="application/ld\+json"[^>]*>(.*?)</script>',
    re.IGNORECASE | re.DOTALL,
)

# Very generic fallback patterns (sites often embed big JSON objects):
NEXT_DATA_RE = re.compile(r'__NEXT_DATA__"\s*type="application/json"\s*>\s*({.*?})\s*</script>', re.DOTALL)
IS24_EXPOSE_RE = re.compile(r'IS24\.expose\s*=\s*({.*?});', re.DOTALL)
KEY_VALUES_RE = re.compile(r'var\s+keyValues\s*=\s*({.*?});', re.DOTALL)
JSON_OBJ_FALLBACK_RE = re.compile(r'({".{200,}?"})', re.DOTALL)  # last-resort heuristic


@dataclass(frozen=True)
class ImmoScoutExposeScraper:
    client: BrightDataUnlockerClient

    def scrape_expose(self, expose_id: str) -> tuple[Listing, str]:
        """
        Fetch expose page, parse raw fields, then map to Listing using your mapping.
        Returns (Listing, html).
        """
        url = f"https://www.immobilienscout24.de/expose/{expose_id}"
        html = self.client.fetch_html(url, render=True)

        raw = self._extract_raw(html=html, url=url, expose_id=expose_id)

        logging.info(f"\n=== EXPOSE {expose_id} | mapping raw preview ===\n"
                    f"{pformat(_mapping_preview(raw), width=120)}\n")

        listing = map_listing(raw)

        # optional: show mapped Listing too
        try:
            mapped = listing.model_dump()  # pydantic v2
        except Exception:
            mapped = listing.__dict__

        logging.info(f"=== EXPOSE {expose_id} | mapped listing ===\n"
                    f"{pformat(mapped, width=120)}\n")

        return listing, html

        #url = f"https://www.immobilienscout24.de/expose/{expose_id}"
        #html = self.client.fetch_html(url, render=True)

        #raw = self._extract_raw(html=html, url=url, expose_id=expose_id)
        #return map_listing(raw)

    def _extract_raw(self, *, html: str, url: str, expose_id: str) -> Dict[str, Any]:
        """
        Extracts a dict compatible with map_listing(raw).
        Keep raw payload (html + extracted blobs) for audit/debug.
        """
        raw: Dict[str, Any] = {
            "id": expose_id,
            "url": url,
            # Defaults (mapping tolerates None via .get)
            "title": None,
            "price": None,
            "rooms": None,
            "sqm": None,
            "street": None,
            "houseNumber": None,
            "postcode": None,
            "city": None,
            "quarter": None,
            "privateOffer": None,
            "contactDetails": {},
            # Keep everything for debugging
            "_debug": {
                "source_html_len": len(html),
            },
        }

        ld_json = self._try_parse_ld_json(html)
        if ld_json:
            logging.info("LD+JSON found")
            self._hydrate_from_ld_json(raw, ld_json)
        else:
            logging.warning("No LD+JSON found")

        next_data = self._try_parse_next_data(html)
        if next_data:
            logging.info("Next.js data found")
            raw["_debug"]["next_data_keys"] = list(next_data.keys())[:50]
            self._hydrate_from_next_data(raw, next_data)
        else:
            logging.warning("No Next.js data found")

        # Fallback 1: IS24.expose
        is24_data = self._try_parse_pattern(html, IS24_EXPOSE_RE)
        if is24_data:
            logging.info("IS24.expose data found")
            self._hydrate_from_is24_data(raw, is24_data)

        # Fallback 2: keyValues
        kv_data = self._try_parse_pattern(html, KEY_VALUES_RE)
        if kv_data:
            logging.info("keyValues data found")
            self._hydrate_from_key_values(raw, kv_data)

        # Keep a small slice for debugging if needed (avoid storing huge html in DB)
        raw["_debug"]["html_head"] = html[:2000]

        return raw

    def _try_parse_ld_json(self, html: str) -> Optional[Dict[str, Any]]:
        matches = LD_JSON_RE.findall(html)
        for block in matches:
            block = block.strip()
            if not block:
                continue
            try:
                data = json.loads(block)
                
                # Handle @graph structure
                if isinstance(data, dict) and "@graph" in data:
                    for item in data["@graph"]:
                        if item.get("@type") == "RealEstateListing":
                            return item
                        # Fallback for any dict that looks like it has listing data
                        if "offers" in item or "address" in item:
                            return item
                
                # Sometimes it's a list
                if isinstance(data, list):
                    for item in data:
                        if isinstance(item, dict):
                            return item
                if isinstance(data, dict):
                    return data
            except Exception:
                continue
        return None

    def _try_parse_next_data(self, html: str) -> Optional[Dict[str, Any]]:
        m = NEXT_DATA_RE.search(html)
        if not m:
            return None
        try:
            data = json.loads(m.group(1))
            if isinstance(data, dict):
                return data
        except Exception:
            return None
        return None

    def _try_parse_pattern(self, html: str, pattern: re.Pattern) -> Optional[Dict[str, Any]]:
        m = pattern.search(html)
        if not m:
            return None
        try:
            data = json.loads(m.group(1))
            if isinstance(data, dict):
                return data
        except Exception:
            return None
        return None

    def _hydrate_from_ld_json(self, raw: Dict[str, Any], ld: Dict[str, Any]) -> None:
        """
        Typical ld+json fields:
          - name
          - offers.price / offers.priceCurrency
          - address.streetAddress, address.postalCode, address.addressLocality
          - image
        """
        raw["title"] = raw.get("title") or ld.get("name")

        offers = ld.get("offers") or {}
        if isinstance(offers, dict):
            raw["price"] = raw.get("price") or offers.get("price")

        address = ld.get("address") or {}
        if isinstance(address, dict):
            street_address = address.get("streetAddress")
            if isinstance(street_address, str):
                # naive split "Street 12" -> street, houseNumber
                raw["street"] = raw.get("street") or street_address
            raw["postcode"] = raw.get("postcode") or address.get("postalCode")
            raw["city"] = raw.get("city") or address.get("addressLocality")

        img = ld.get("image")
        if img:
            raw["image"] = img  # parse_image_url(raw) can pick this up

    def _hydrate_from_next_data(self, raw: Dict[str, Any], data: Dict[str, Any]) -> None:
        """
        Highly site-structure dependent.
        """
        props = data.get("props", {}).get("pageProps", {})
        expose = props.get("expose") or props.get("listing") or {}
        
        if not expose:
             # Try other common locations in NEXT_DATA
             expose = data.get("query", {}).get("expose") or {}

        if not expose:
            return

        raw["title"] = raw.get("title") or expose.get("title")
        raw["price"] = raw.get("price") or str(expose.get("price", {}).get("value") or "")
        raw["rooms"] = raw.get("rooms") or str(expose.get("rooms") or "")
        raw["sqm"] = raw.get("sqm") or str(expose.get("livingSpace") or "")
        
        addr = expose.get("address", {})
        raw["street"] = raw.get("street") or addr.get("street")
        raw["houseNumber"] = raw.get("houseNumber") or addr.get("houseNumber")
        raw["postcode"] = raw.get("postcode") or addr.get("postcode")
        raw["city"] = raw.get("city") or addr.get("city")
        raw["quarter"] = raw.get("quarter") or addr.get("quarter")

    def _hydrate_from_is24_data(self, raw: Dict[str, Any], data: Dict[str, Any]) -> None:
        """
        Handles legacy or alternate JSON structure often found in window.IS24.expose
        """
        raw["title"] = raw.get("title") or data.get("title")
        # In current HTML: purchasePrice or propertyPrice
        raw["price"] = raw.get("price") or data.get("purchasePrice") or data.get("propertyPrice")
        
        # availableServicesData has rooms and sqm
        services = data.get("availableServicesData", {})
        raw["rooms"] = raw.get("rooms") or services.get("numberOfRooms")
        raw["sqm"] = raw.get("sqm") or services.get("squareMeters")
        
        addr = data.get("locationAddress", {})
        raw["postcode"] = raw.get("postcode") or addr.get("zip")
        raw["city"] = raw.get("city") or addr.get("city")

    def _hydrate_from_key_values(self, raw: Dict[str, Any], data: Dict[str, Any]) -> None:
        """
        Handles data found in var keyValues
        """
        # In current HTML: obj_purchasePrice, obj_livingSpace, obj_noRooms, obj_zipCode
        raw["price"] = raw.get("price") or data.get("obj_purchasePrice")
        raw["rooms"] = raw.get("rooms") or data.get("obj_noRooms")
        raw["sqm"] = raw.get("sqm") or data.get("obj_livingSpace")
        raw["postcode"] = raw.get("postcode") or data.get("obj_zipCode")
        raw["city"] = raw.get("city") or data.get("obj_regio2") # regio2 is often city



MAPPING_KEYS = [
    "id", "title", "price", "rooms", "sqm", "url",
    "street", "houseNumber", "postcode", "city", "quarter",
    "privateOffer",
    "contactDetails",
    "image",
    "images",
]

def _mapping_preview(raw: dict) -> dict:
    # show only what map_listing needs (plus a couple image candidates)
    out = {k: raw.get(k) for k in MAPPING_KEYS}
    # ensure contactDetails is at least a dict so you see nested keys cleanly
    if not isinstance(out.get("contactDetails"), dict):
        out["contactDetails"] = {}
    return out