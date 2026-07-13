# POST /analyze -- protected the same way History's routes are (JWT via
# get_current_user), so results save with the correct real user_id and show
# up on that user's History page automatically.

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Analysis, User
from ..auth import get_current_user
from ..schemas import AnalyzeRequest, AnalyzeResponse
from .. import app_ai as ai_service

router = APIRouter(prefix="/analyze", tags=["Analysis"])


@router.post("", response_model=AnalyzeResponse)
def analyze_text(
    payload: AnalyzeRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = ai_service.analyze(payload.text)

    new_analysis = Analysis(
        user_id=current_user.id,  # <-- the fix: real user, not left empty
        text=payload.text,
        sentiment=result["sentiment"],
        confidence=result["confidence"],
        emotions=result["emotions"],
        entities=result["entities"],
    )
    db.add(new_analysis)
    db.commit()

    return AnalyzeResponse(**result)