from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from services.model_service import BodyTypeService
from google.colab import drive

app = FastAPI()

try:
    drive.mount('/content/drive')
    model_path = '/content/drive/My Drive/body_type_model_rf_encoded.pkl'
    encoder_path = '/content/drive/My Drive/body_type_label_encoder_rf_encoded.pkl'
except ImportError:
    model_path = 'body_type_model_rf_encoded.pkl'
    encoder_path = 'body_type_label_encoder_rf_encoded.pkl'

body_type_service = BodyTypeService(model_path, encoder_path)

class InputData(BaseModel):
    height: float
    weight: float
    age: int

class PredictionResponse(BaseModel):
    BodyTypeIndex: int
    BodyTypeDescription: str

@app.post("/predict", response_model=PredictionResponse)
async def predict_body_type(data: InputData):
    result = body_type_service.predict_body_type(data.height, data.weight, data.age)
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)