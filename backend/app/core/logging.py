import logging
import sys

from app.core.config import settings


def setup_logging() -> None:
    """
    Configure logging for the FastAPI application.
    Sets up custom logging format and adapts Uvicorn log levels to settings.
    """
    log_level_name = settings.LOG_LEVEL.upper()
    # Fallback to INFO if invalid level provided
    log_level = getattr(logging, log_level_name, logging.INFO)

    log_format = "[%(asctime)s] %(levelname)s in %(module)s [%(filename)s:%(lineno)d] - %(message)s"

    # Configure root logger
    logging.basicConfig(
        level=log_level, format=log_format, handlers=[logging.StreamHandler(sys.stdout)]
    )

    # Apply same log level to Uvicorn loggers
    for logger_name in ("uvicorn", "uvicorn.error", "uvicorn.access", "fastapi"):
        logger = logging.getLogger(logger_name)
        logger.setLevel(log_level)
        # Prevent double logging by disabling propagation if handlers are already set
        logger.propagate = True
