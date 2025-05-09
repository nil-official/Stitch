from pydantic import BaseModel, Field

class BodyTypeRequest(BaseModel):
    height: float = Field(..., gt=0, example=170)
    weight: float = Field(..., gt=0, example=65)
    age: int = Field(..., gt=0, example=25)

class BodyTypeResponse(BaseModel):
    BodyTypeIndex: int
    BodyTypeDescription: str
