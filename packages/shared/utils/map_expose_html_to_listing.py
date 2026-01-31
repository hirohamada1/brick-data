def _extract_living_space_sqm_from_html(html: str) -> Optional[float]:
    # 1) dt/dd variant
    m = _SQM_RE.search(html)
    if m:
        return _safe_float(m.group(2))

    # 2) mainCriteria strict variant
    m2 = _SQM_MAINCRITERIA_RE.search(html)
    if m2:
        return _safe_float(m2.group(1))

    # 3) mainCriteria robust variant (handles m² encodings / nested tags)
    m3 = _MAINCRITERIA_WOHNFL_RE.search(html)
    if m3:
        text = _strip_tags(m3.group("val"))  # e.g. "36 m²", "36 m&#178;", etc.
        return _safe_float(text)

    return None