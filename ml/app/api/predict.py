from fastapi import APIRouter
from models.bodytype import BodyTypeRequest
from services.predictor import predict_body_type

router = APIRouter()

@router.post("/predict")
def predict_bodytype(data: BodyTypeRequest):
    return predict_body_type(data.height, data.weight, data.age)