from app.core.config import settings
from app.schemas.health import HealthCheck
from fastapi import APIRouter

router = APIRouter()


@router.get("/health", response_model=HealthCheck, tags=["System"])
def get_health() -> HealthCheck:
    """
    Returns the health status, environment, and version of the API.
    """
    return HealthCheck(status="ok", environment=settings.APP_ENV, version="1.0.0")
