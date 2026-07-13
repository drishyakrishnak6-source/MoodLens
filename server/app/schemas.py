# YOUR FILE — response schemas for History routes.
# Converts SQLAlchemy Analysis objects into clean, guaranteed-JSON-safe output.

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
    
# Add these two classes into the EXISTING server/app/schemas.py
# (don't overwrite the whole file -- just add these alongside what's there)

from pydantic import BaseModel


class AnalyzeRequest(BaseModel):
    text: str


class AnalyzeResponse(BaseModel):
    sentiment: str
    confidence: float
    emotions: str
    entities: str