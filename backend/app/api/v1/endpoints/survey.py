from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_db
from app.schemas.common import APIEnvelope
from app.schemas.survey import SurveyRead, SurveySubmissionDTO

router = APIRouter()


@router.post("/submit", response_model=APIEnvelope[dict], status_code=status.HTTP_201_CREATED, summary="Submit field survey record")
async def submit_survey(payload: SurveySubmissionDTO, db: AsyncSession = Depends(get_db)):
    """Receives field surveyor GPS capture and telemetry."""
    return APIEnvelope(message="Field survey captured.", data={"survey_order_number": payload.survey_order_number, "status": "SUBMITTED"})


@router.get("/assigned", response_model=APIEnvelope[List[SurveyRead]], summary="Fetch surveys assigned to officer")
async def get_assigned_surveys(db: AsyncSession = Depends(get_db)):
    """List pending field survey assignments."""
    return APIEnvelope(message="Assigned surveys retrieved.", data=[])
