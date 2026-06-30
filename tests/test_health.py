from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)


def test_health_check() -> None:
    """
    Test that the health endpoint returns 200 and matches the expected JSON structure.
    """
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "environment" in data
    assert "version" in data


def test_root_endpoint() -> None:
    """
    Test that the root landing endpoint returns 200 and provides navigation guidance.
    """
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "docs" in data["message"]
