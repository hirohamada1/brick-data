import sys
import unittest
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[2]))

from scraper.is24_parser import parse_search_payload  # type: ignore  # noqa: E402
from scraper.models.listing_schema import FetchArtifact  # type: ignore  # noqa: E402


class IS24JsonFirstParserTests(unittest.TestCase):
    def test_parse_search_payload_prefers_json_text(self) -> None:
        artifact = FetchArtifact(
            url="https://example.com",
            raw_html="<html><body>ignored</body></html>",
            extracted_json_text=(
                '{"resultlistEntries":[{"resultlistEntry":[{"realEstateId":123,'
                '"resultlist.realEstate":{"title":"Wohnung","livingSpace":75,'
                '"price":{"value":450000},"address":{"city":"Stuttgart","postcode":"70173"}}}]}]}'
            ),
        )

        payload = parse_search_payload(artifact)

        self.assertEqual(payload.source, "json_endpoint")
        self.assertEqual(len(payload.listings), 1)
        self.assertEqual(payload.listings[0]["external_id"], "123")
        self.assertEqual(payload.listings[0]["city"], "Stuttgart")

    def test_parse_search_payload_falls_back_to_html_parser(self) -> None:
        html = (
            "<html><body><script>"
            '{"resultlistEntries":[{"resultlistEntry":[{"realEstateId":222,'
            '"resultlist.realEstate":{"title":"Fallback","livingSpace":70,'
            '"price":{"value":380000},"address":{"city":"Leipzig","postcode":"04109"}}}]}]}'
            "</script></body></html>"
        )
        artifact = FetchArtifact(url="https://example.com", raw_html=html)

        payload = parse_search_payload(artifact)

        self.assertIn(payload.source, {"embedded_script", "html_fallback"})
        self.assertEqual(len(payload.listings), 1)
        self.assertEqual(payload.listings[0]["listing_id"], 222)


if __name__ == "__main__":
    unittest.main()
