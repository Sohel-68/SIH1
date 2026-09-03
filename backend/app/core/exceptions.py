from typing import Any, Dict, Optional
from fastapi import HTTPException, status


class GeoStrataException(Exception):
    """Base domain exception for GeoStrata platform."""
    def __init__(self, message: str, code: str = "INTERNAL_ERROR", details: Optional[Dict[str, Any]] = None):
        self.message = message
        self.code = code
        self.details = details or {}
        super().__init__(message)


class EntityNotFoundException(GeoStrataException):
    """Raised when a land parcel, strata unit, or title is not found."""
    def __init__(self, entity_name: str, entity_id: Any):
        super().__init__(
            message=f"{entity_name} with identifier '{entity_id}' does not exist.",
            code="ENTITY_NOT_FOUND",
            details={"entity": entity_name, "id": str(entity_id)}
        )


class SpatialOverlapException(GeoStrataException):
    """Raised when 3D strata units violate non-overlapping spatial invariants."""
    def __init__(self, message: str = "3D Strata Unit intersects an existing volumetric boundary."):
        super().__init__(
            message=message,
            code="SPATIAL_3D_COLLISION",
            details={"invariant": "ISO-19152-NON-OVERLAPPING-STRATA"}
        )


class InvalidULPINException(GeoStrataException):
    """Raised when an invalid 2D or 3D ULPIN string or checksum is provided."""
    def __init__(self, ulpin: str):
        super().__init__(
            message=f"The ULPIN '{ulpin}' does not conform to national Bhu-Aadhaar 3D standards.",
            code="INVALID_ULPIN_FORMAT",
            details={"ulpin": ulpin}
        )


class PermissionDeniedException(GeoStrataException):
    """Raised when an actor lacks RBAC permissions."""
    def __init__(self, required_role: str):
        super().__init__(
            message=f"Access denied. Requires '{required_role}' authorization level.",
            code="FORBIDDEN_ROLE",
            details={"required_role": required_role}
        )
