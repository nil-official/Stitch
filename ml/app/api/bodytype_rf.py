from fastapi import APIRouter
from models.bodytype_rf import BodyTypeRequest, BodyTypeResponse
from services.bodytype_predictor_rf import predict_body_type_from_input

router = APIRouter()

@router.post("/predict-bodytype", response_model=BodyTypeResponse)
def predict_bodytype(data: BodyTypeRequest):
    result = predict_body_type_from_input(data.height, data.weight, data.age)

    if "error" in result:
        return {"BodyTypeIndex": -1, "BodyTypeDescription": result["error"]}
    return result
