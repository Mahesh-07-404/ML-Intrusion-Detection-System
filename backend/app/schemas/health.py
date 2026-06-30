from pydantic import BaseModel, Field


class HealthCheck(BaseModel):
    """
    Schema for Health Check endpoint response.
    """

    status: str = Field(
        ..., description="Health status indicator. Typically 'ok' or 'healthy'."
    )
    environment: str = Field(..., description="Current deployment environment.")
    version: str = Field(..., description="Version of the running API service.")
