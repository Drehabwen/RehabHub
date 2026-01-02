from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any

class Keypoint(BaseModel):
    name: Optional[str] = None
    x: float
    y: float
    score: Optional[float] = None
    z: Optional[float] = None 

class AssessmentRequest(BaseModel):
    patientId: Optional[str] = "guest"
    movementType: str
    movementName: Optional[str] = None
    timestamp: Optional[str] = None
    angles: Optional[Dict[str, float]] = None
    keypoints: List[Keypoint]

class AssessmentResponse(BaseModel):
    score: float
    feedback: str
    angles: Dict[str, float]
    details: Dict[str, Any]


class ApiEnvelopeAssessmentResponse(BaseModel):
    code: int = Field(default=200)
    message: str = Field(default="ok")
    data: AssessmentResponse
    timestamp: str
