import uuid
from typing import Optional
from pydantic import BaseModel


class AuditLogRead(BaseModel):
    id: uuid.UUID
    action: str
    entity_name: str
    entity_id: str
    actor_id: uuid.UUID
    actor_role: str
    ip_address: str
    record_hash: str
    correlation_id: str
