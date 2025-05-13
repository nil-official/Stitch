from pydantic import BaseModel

class BodyTypeRequest(BaseModel):
    height: float
    weight: float
    age: int

class BodyTypeResponse(BaseModel):
    BodyTypeIndex: int
    BodyTypeDescription: str