import uvicorn
from app.core.config import settings


def main():
    """
    Entry point to run the FastAPI application via Uvicorn.
    """
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.APP_ENV == "development",
    )


if __name__ == "__main__":
    main()
