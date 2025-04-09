from fastapi import APIRouter, Query
from services.recommender import get_recommendations

router = APIRouter()

@router.get("/recommend")
def recommend(product_id: int = Query(...), top_n: int = Query(10)):
    return get_recommendations(product_id, top_n)