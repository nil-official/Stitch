from pydantic import BaseModel, Field

class ReviewRequest(BaseModel):
    review: str = Field(..., min_length=1)
    rating: float = Field(..., ge=1, le=5)
    totalRatings: int = Field(..., ge=0)
    avgRating: float = Field(..., ge=0)