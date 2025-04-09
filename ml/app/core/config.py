from fastapi.middleware.cors import CORSMiddleware
from transformers import AutoModelForSequenceClassification, AutoTokenizer
from contextlib import asynccontextmanager

model = None
tokenizer = None

@asynccontextmanager
async def lifespan(app):
    global model, tokenizer
    model_name = "cardiffnlp/twitter-roberta-base-sentiment-latest"
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSequenceClassification.from_pretrained(model_name)
    yield

def setup_cors(app):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5454"],
        allow_credentials=True,
        allow_methods=["POST"],
        allow_headers=["*"],
    )