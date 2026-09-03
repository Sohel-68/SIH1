import uuid
from typing import Optional
from pydantic import BaseModel


class DocumentUploadMeta(BaseModel):
    strata_unit_id: Optional[uuid.UUID] = None
    document_type: str
    file_name: str
    file_size_bytes: int
    mime_type: str
    checksum_sha256: str


class DocumentRead(BaseModel):
    id: uuid.UUID
    strata_unit_id: Optional[uuid.UUID]
    document_type: str
    file_name: str
    checksum_sha256: str
    verification_status: str
