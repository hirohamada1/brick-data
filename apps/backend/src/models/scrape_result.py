"""
Scrape Result model.
"""
from pydantic import BaseModel
from typing import Any

class ScrapeResult(BaseModel):
    success: bool
    data: Any
    error: str = None
