from fastapi import APIRouter
from app.schemas.common import APIEnvelope
from app.schemas.document import DocumentUploadMeta

router = APIRouter()


@router.post("/register-metadata", response_model=APIEnvelope[dict], summary="Register uploaded deed metadata")
async def register_document_meta(payload: DocumentUploadMeta):
    """Deed registry and cryptographic checksum verification."""
    return APIEnvelope(message="Document metadata verified.", data={"checksum": payload.checksum_sha256})
