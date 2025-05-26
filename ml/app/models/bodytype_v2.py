from pydantic import BaseModel, Field

class BodyTypeRequest(BaseModel):
    height: float = Field(..., gt=0, description="Height in cm")
    weight: float = Field(..., gt=0, description="Weight in kg")

    model_config = {
        "json_schema_extra": {
            "example": {
                "height": 170,
                "weight": 65
            }
        }
    }
