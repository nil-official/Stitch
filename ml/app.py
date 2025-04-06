from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from transformers import AutoModelForSequenceClassification, AutoTokenizer
import torch
import torch.nn.functional as F
from contextlib import asynccontextmanager

# Global model/tokenizer placeholders
model = None
tokenizer = None

# Model name
model_name = "cardiffnlp/twitter-roberta-base-sentiment-latest"

# Lifespan context to load model once at startup
@asynccontextmanager
async def lifespan(app: FastAPI):
    global tokenizer, model
    print("🔁 Loading sentiment analysis model...")
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSequenceClassification.from_pretrained(model_name)
    print("✅ Model loaded...")
    yield
    print("🛑 Shutting down FastAPI app...")

# Initialize FastAPI app with lifespan
app = FastAPI(lifespan=lifespan)

# Setup CORS for specific origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5454"],
    allow_credentials=True,
    allow_methods=["POST"],
    allow_headers=["*"],
)

# Request model with field-level validation
class ReviewRequest(BaseModel):
    review: str = Field(..., min_length=1, description="Review text cannot be empty")
    rating: float = Field(..., ge=1, le=5, description="User rating between 1 and 5")
    totalRatings: int = Field(..., ge=0, description="Total ratings must be non-negative")
    avgRating: float = Field(..., ge=0, description="Average rating must be non-negative")

# Function to get sentiment score
def get_sentiment_score(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
    with torch.no_grad():
        logits = model(**inputs).logits
    probs = F.softmax(logits, dim=-1).squeeze()
    neg, neu, pos = probs.tolist()
    # Convert probability to a continuous scale (-1 to 1)
    sentiment_score = (pos - neg)  # More intuitive scaling
    print(f"Sentiment Score: {sentiment_score:.4f}")
    return sentiment_score  # Score between -1 to 1

# API to compute ranking score
@app.post("/api/ml/rank")
def compute_rank_score(request: ReviewRequest):
    # Get sentiment score from the review text
    sentiment_score = get_sentiment_score(request.review)

    # Compute adjusted rating incorporating the user's new rating
    C = request.avgRating  # Average rating across products
    m = 5  # Minimum ratings for stability
    adjusted_rating = ((request.totalRatings / (request.totalRatings + m)) * request.avgRating) + ((m / (request.totalRatings + m)) * C)

    # Include the new user rating in the calculation
    adjusted_rating = (adjusted_rating * request.totalRatings + request.rating) / (request.totalRatings + 1)

    # Normalize scores (scale adjusted rating to 0-10, sentiment to 0-10)
    normalized_adjusted_rating = adjusted_rating * 2  # Scale 1-5 to 0-10
    normalized_sentiment = (sentiment_score + 1) * 5  # Scale -1 to +1 → 0-10

    # Compute final ranking score with weighted contribution
    w1, w2 = 0.7, 0.3  # Weights (tunable)
    new_rank_score = (w1 * normalized_adjusted_rating) + (w2 * normalized_sentiment)

    return {
        "rankScore": round(new_rank_score, 4)
    }