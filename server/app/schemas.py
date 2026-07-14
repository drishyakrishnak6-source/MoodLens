# YOUR FILE — response schemas for History routes.
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict

class AnalysisOut(BaseModel):
    id: int
    text: str
    sentiment: str
    confidence: float
    emotions: Optional[str] = None
    entities: Optional[str] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class HistoryResponse(BaseModel):
    data: List[AnalysisOut]

class AnalyzeRequest(BaseModel):
    text: str

class AnalyzeResponse(BaseModel):
    sentiment: str
    confidence: float
    emotions: str
    entities: str

class UserRegister(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class OAuthLogin(BaseModel):
    token: str
    email: str
    name: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"