from pathlib import Path

from scraper.is24_parser import parse_search_results


def test_parse_search_results():
    fixture_path = (
        Path(__file__).parent.parent
        / "fixtures"
        / "sample_is24_search.html"
    )

    html = fixture_path.read_text(encoding="utf-8")

    listings = parse_search_results(html)

    assert len(listings) > 0
    assert listings[0]["price_eur"] == 265000
