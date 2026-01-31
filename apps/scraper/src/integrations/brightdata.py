import requests

class BrightDataClient:
    def __init__(self, api_key: str, zone: str):
        self.api_key = api_key
        self.zone = zone

    def fetch_html(self, url: str) -> str:
        response = requests.post(
            "https://api.brightdata.com/request",
            headers={
                "Authorization": f"Bearer {self.api_key}"
            },
            json={
                "zone": self.zone,
                "url": url,
                "format": "raw"
            },
            timeout=30
        )
        response.raise_for_status()
        return response.text
