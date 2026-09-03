from fastapi import APIRouter
from app.schemas.common import APIEnvelope

router = APIRouter()


@router.get("/vector-tiles/{z}/{x}/{y}", summary="Stream Mapbox Vector Tiles (MVT)")
async def get_vector_tiles(z: int, x: int, y: int):
    """Vector tile streaming contract with PostGIS ST_AsMVT."""
    return APIEnvelope(message="MVT vector tile pipeline ready.", data={"z": z, "x": x, "y": y})


@router.get("/geojson/layers", response_model=APIEnvelope[dict], summary="Query 2D cadastral GeoJSON layers")
async def get_geojson_layers():
    """Foundation GeoJSON endpoint."""
    return APIEnvelope(message="Cadastral GeoJSON layers ready.", data={"type": "FeatureCollection", "features": []})
