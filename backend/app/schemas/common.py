from typing import Generic, List, Optional, TypeVar
from pydantic import BaseModel, ConfigDict

T = TypeVar("T")


class APIEnvelope(BaseModel, Generic[T]):
    """Standardized API envelope wrapper for all responses."""
    success: bool = True
    message: str = "Operation completed successfully"
    data: Optional[T] = None
    correlation_id: Optional[str] = None


class PaginatedResponse(BaseModel, Generic[T]):
    """Standardized paginated list container."""
    items: List[T]
    total_count: int
    page: int
    page_size: int
    total_pages: int


class HealthStatus(BaseModel):
    """Health check payload."""
    status: str = "healthy"
    version: str = "1.0.0"
    database: str = "connected"
    redis: str = "connected"
    spatial_engine: str = "PostGIS 3.4 / SFCGAL active"
