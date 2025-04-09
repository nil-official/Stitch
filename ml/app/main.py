from fastapi import FastAPI
from core.config import setup_cors, lifespan
from api.rank import router as rank_router
from api.recommend import router as recommend_router

app = FastAPI(lifespan=lifespan)
setup_cors(app)

app.include_router(rank_router, prefix="/api/ml", tags=["Rank"])
app.include_router(recommend_router, prefix="/api/ml", tags=["Recommend"])