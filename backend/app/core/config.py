from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings class using pydantic-settings.
    Loads configurations from environment variables and fallback to a .env file.
    """

    PROJECT_NAME: str = "ML-Intrusion-Detection-System"
    API_V1_STR: str = "/api/v1"

    # CORS Origins
    # Can be a comma-separated string or a list of hosts
    BACKEND_CORS_ORIGINS: list[str] | str = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8000",
    ]

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: str | list[str]) -> list[str] | str:
        """
        Validates and parses CORS origins. Converts comma-separated strings to list.
        """
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        return v

    APP_ENV: str = "development"
    DEBUG: bool = True
    LOG_LEVEL: str = "INFO"

    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", case_sensitive=True, extra="ignore"
    )


settings = Settings()
