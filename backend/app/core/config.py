from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """GeoStrata Enterprise Core Configuration Settings."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

    # Base Application Metadata
    PROJECT_NAME: str = "GeoStrata – National 3D ULPIN Platform"
    PROJECT_VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = False

    # API Routing Prefixes
    API_V1_STR: str = "/api/v1"
    API_V2_STR: str = "/api/v2"

    # Security & Cryptography
    SECRET_KEY: str = "geostrata-insecure-secret-key-change-for-production-min-32-chars"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Asynchronous PostgreSQL & PostGIS Connection
    DATABASE_URL: str = "postgresql+asyncpg://geostrata_admin:GeoStrataSecurePassword2026!@localhost:5432/geostrata_db"
    DATABASE_POOL_SIZE: int = 20
    DATABASE_MAX_OVERFLOW: int = 10
    DATABASE_POOL_TIMEOUT: int = 30

    # Redis Connection
    REDIS_URL: str = "redis://:RedisGeoStrataSecureKey2026!@localhost:6379/0"

    # CORS Policy Configuration
    CORS_ORIGINS: List[Union[str, AnyHttpUrl]] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000"
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)


settings = Settings()
