"""
GeoStrata Models Registry.
Exports all SQLAlchemy ORM models for Alembic auto-discovery and service consumption.
"""

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin
from app.models.land_parcel import LandParcel
from app.models.building import Building
from app.models.tower import Tower
from app.models.floor import Floor
from app.models.unit import StrataUnit
from app.models.owner import Owner
from app.models.survey import Survey
from app.models.ulpin import ULPINRecord
from app.models.audit import AuditLog
from app.models.notification import Notification
from app.models.document import Document
from app.models.ai_result import AIResult
from app.models.analytics import AnalyticsSnapshot

__all__ = [
    "Base",
    "TimestampMixin",
    "UUIDPrimaryKeyMixin",
    "LandParcel",
    "Building",
    "Tower",
    "Floor",
    "StrataUnit",
    "Owner",
    "Survey",
    "ULPINRecord",
    "AuditLog",
    "Notification",
    "Document",
    "AIResult",
    "AnalyticsSnapshot"
]
