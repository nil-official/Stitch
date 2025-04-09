from fastapi import APIRouter
from models.review import ReviewRequest
from services.ranker import compute_rank_score

router = APIRouter()

@router.post("/rank")
def rank_endpoint(request: ReviewRequest):
    score = compute_rank_score(request.review, request.rating, request.totalRatings, request.avgRating)
    return {"rankScore": score}