from app.api.v1.endpoints import health
from fastapi import APIRouter

api_router = APIRouter()

# Include endpoints routers
api_router.include_router(health.router)
# Additional endpoints (e.g. inference, models) will be included here in future sprints
