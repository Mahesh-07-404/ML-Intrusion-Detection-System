from app.api.v1.api import api_router
from app.core.config import settings
from app.core.logging import setup_logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Initialize logging configuration before app setup
setup_logging()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Enterprise-grade Machine Learning Intrusion Detection System API Backend",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Set up CORS middleware for cross-origin frontend requests
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Register API v1 routes
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/", tags=["System"])
def root() -> dict:
    """
    API root landing path. Offers brief greeting and links to Swagger docs.
    """
    return {
        "message": "Welcome to ML Intrusion Detection System API. Access swagger docs at /docs."
    }
