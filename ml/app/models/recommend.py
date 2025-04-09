from typing import List
from pydantic import BaseModel
from models.product import Product

class RecommendRequest(BaseModel):
    product_id: int
    top_n: int
    products: List[Product]