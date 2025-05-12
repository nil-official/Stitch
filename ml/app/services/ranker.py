from core import config
import torch.nn.functional as F
import torch

def get_sentiment_score(text):
    inputs = config.tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
    with torch.no_grad():
        logits = config.model(**inputs).logits
    probs = F.softmax(logits, dim=-1).squeeze()
    return (probs[2] - probs[0]).item()

def compute_rank_score(review, rating, totalRatings, avgRating):
    sentiment_score = get_sentiment_score(review)
    C = avgRating
    m = 5
    adjusted = ((totalRatings / (totalRatings + m)) * avgRating) + ((m / (totalRatings + m)) * C)
    adjusted = (adjusted * totalRatings + rating) / (totalRatings + 1)
    norm_rating = adjusted * 2
    norm_sentiment = (sentiment_score + 1) * 5
    score = round((0.7 * norm_rating) + (0.3 * norm_sentiment), 4)
    return {"rankScore": score}