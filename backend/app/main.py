from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.api.v1.router import api_router as api_v1_router
from app.api.v2.router import api_v2_router
from app.core.config import settings
from app.core.database import engine
from app.core.exceptions import GeoStrataException
from app.core.middleware import AuditAndCorrelationMiddleware
from app.core.redis import close_redis_client, get_redis_client


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and graceful shutdown lifespan events."""
    # Startup: test database connection & initialize Redis client
    try:
        import app.models  # noqa: F401
        from app.models.base import Base
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        await get_redis_client()
    except Exception as e:
        print(f"[CRITICAL] Startup connection warning: {e}")

    yield

    # Graceful Shutdown
    await close_redis_client()
    await engine.dispose()


def create_application() -> FastAPI:
    """Enterprise Application Factory."""
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.PROJECT_VERSION,
        description=(
            "National 3D ULPIN (Bhu-Aadhaar) & Vertical Property Mapping Platform Core API. "
            "Conforms to ISO 19152 Land Administration Domain Model (LADM) 3D Cadastre standards."
        ),
        openapi_url="/api/openapi.json",
        docs_url="/docs",
        redoc_url="/redoc",
        lifespan=lifespan
    )

    # 1. Register Enterprise Correlation & Audit Middleware
    app.add_middleware(AuditAndCorrelationMiddleware)

    # 2. Configure Cross-Origin Resource Sharing (CORS)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["X-Correlation-ID", "X-Process-Time", "X-GeoStrata-Version"]
    )

    # 3. Global Exception Handler (RFC 7807 Problem Details compliant)
    @app.exception_handler(GeoStrataException)
    async def geostrata_exception_handler(request: Request, exc: GeoStrataException):
        correlation_id = getattr(request.state, "correlation_id", "unknown")
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "type": f"urn:geostrata:error:{exc.code.lower()}",
                "title": exc.code,
                "status": 400,
                "detail": exc.message,
                "details": exc.details,
                "correlation_id": correlation_id
            }
        )

    # 4. Mount Versioned Routers
    app.include_router(api_v1_router, prefix=settings.API_V1_STR)
    app.include_router(api_v2_router, prefix=settings.API_V2_STR)

    # 5. Root Health Endpoint
    @app.get("/", tags=["Health"])
    async def root():
        return {
            "platform": "GeoStrata National 3D ULPIN Engine",
            "version": settings.PROJECT_VERSION,
            "status": "OPERATIONAL",
            "api_v1": settings.API_V1_STR,
            "api_v2": settings.API_V2_STR,
            "docs": "/docs"
        }

    return app


app = create_application()
