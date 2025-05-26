from fastapi import APIRouter
from models.bodytype_v2 import BodyTypeRequest
from services.predictor_v2 import predict_size

router = APIRouter()

@router.post('/predict-size')
def predict_bodytype(data: BodyTypeRequest):
    return predict_size(data.weight, data.height)