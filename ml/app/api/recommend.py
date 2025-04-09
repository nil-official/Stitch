from fastapi import APIRouter, Query
from services.recommender import get_recommendations
from models.recommend import RecommendRequest

router = APIRouter()

@router.post("/recommend")
def recommend(data: RecommendRequest):
    return get_recommendations(data.product_id, data.top_n, data.products)