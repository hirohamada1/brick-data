"""
Canonical Listing model.
"""
from pydantic import BaseModel

class Listing(BaseModel):
    id: str
    title: str
    price: float
    # TODO: Add more fields
