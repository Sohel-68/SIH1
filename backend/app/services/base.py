from typing import Generic, TypeVar
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.base import Base

ModelType = TypeVar("ModelType", bound=Base)


class BaseService(Generic[ModelType]):
    """
    Base service implementing Clean Architecture service boundary.
    Injected with scoped AsyncSession for repository operations.
    """
    def __init__(self, session: AsyncSession):
        self.session = session
