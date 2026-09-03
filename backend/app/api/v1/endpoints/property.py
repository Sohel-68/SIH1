from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_db
from app.schemas.common import APIEnvelope
from app.schemas.property import LandParcelRead, StrataUnitRead

router = APIRouter()


@router.get("/parcels", response_model=APIEnvelope[List[LandParcelRead]], summary="List cadastral land parcels")
async def list_parcels(db: AsyncSession = Depends(get_db)):
    """Foundation endpoint for querying 2D ground parcels."""
    return APIEnvelope(message="Land parcels foundation ready.", data=[])


@router.get("/strata-units", response_model=APIEnvelope[List[StrataUnitRead]], summary="List 3D strata units")
async def list_strata_units(db: AsyncSession = Depends(get_db)):
    """Foundation endpoint for querying 3D vertical strata units."""
    return APIEnvelope(message="3D strata units foundation ready.", data=[])
