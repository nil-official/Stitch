from fastapi import APIRouter
from services.body_type_predictor_lr import predict_body_type
from models.body_type_lr import BodyTypeRequest, BodyTypeResponse

router = APIRouter()

@router.post("/predict", response_model=BodyTypeResponse)
def predict_body_type_route(data: BodyTypeRequest):
    result = predict_body_type(data.height, data.weight, data.age)
    if "error" in result:
        return {"error": result["error"]}
    return result
