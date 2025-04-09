from pydantic import BaseModel
from typing import Optional

class Product(BaseModel):
    id: int
    title: str
    description: str
    brand: str
    color: str
    rankScore: Optional[float] = 0.0
    category: str