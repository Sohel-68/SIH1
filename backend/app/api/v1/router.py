from fastapi import APIRouter
from app.api.v1.endpoints import (
    admin,
    ai,
    analytics,
    audit,
    auth,
    citizen,
    documents,
    gis,
    notifications,
    officer,
    property,
    reports,
    settings,
    shared,
    survey,
    sync,
    ulpin,
    viewer_3d,
)

api_router = APIRouter()

# Register all 18 module endpoints into v1 namespace
api_router.include_router(shared.router, tags=["Health & Shared"])
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(property.router, prefix="/properties", tags=["Property Hierarchy"])
api_router.include_router(ulpin.router, prefix="/ulpin", tags=["3D ULPIN Engine"])
api_router.include_router(gis.router, prefix="/gis", tags=["2D GIS & Vector Tiles"])
api_router.include_router(viewer_3d.router, prefix="/viewer-3d", tags=["3D Strata Digital Twin"])
api_router.include_router(survey.router, prefix="/survey", tags=["Field Survey"])
api_router.include_router(sync.router, prefix="/sync", tags=["Offline Synchronization"])
api_router.include_router(citizen.router, prefix="/citizen", tags=["Citizen Services"])
api_router.include_router(officer.router, prefix="/officer", tags=["Officer Approvals"])
api_router.include_router(admin.router, prefix="/admin", tags=["Administration"])
api_router.include_router(documents.router, prefix="/documents", tags=["Document Registry"])
api_router.include_router(audit.router, prefix="/audit", tags=["Immutable Audit Trail"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["Notifications"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Volumetric Analytics"])
api_router.include_router(reports.router, prefix="/reports", tags=["Cadastral Reports"])
api_router.include_router(settings.router, prefix="/settings", tags=["System Settings"])
api_router.include_router(ai.router, prefix="/ai", tags=["AI Spatial Extraction"])
