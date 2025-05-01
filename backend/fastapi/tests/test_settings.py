import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from backend.fastapi.main import app
from backend.fastapi.database import Base, get_db
from backend.fastapi.models import Settings, User
from backend.fastapi.auth import get_current_user

# Setup a test database
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create the database tables
Base.metadata.create_all(bind=engine)

# Override the get_db dependency to use the test database
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

# Mock the authentication dependency
def override_get_current_user():
    # Return a dummy user for testing authenticated routes
    return User(id=1, username="testuser", email="test@example.com", hashed_password="fakehashedpassword")

app.dependency_overrides[get_current_user] = override_get_current_user

client = TestClient(app)

# Test cases for settings routes

def test_create_setting():
    response = client.post(
        "/settings/",
        json={"key": "test_setting", "value": "test_value"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["key"] == "test_setting"
    assert "id" in data

def test_read_settings():
    # Create a setting first
    client.post(
        "/settings/",
        json={"key": "another_setting", "value": "another_value"},
    )
    response = client.get("/settings/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1 # Should have at least the setting created in this test or previous tests
    assert any(setting["key"] == "another_setting" for setting in data)

def test_read_setting():
    # Create a setting first
    create_response = client.post(
        "/settings/",
        json={"key": "specific_setting", "value": "specific_value"},
    )
    settings_id = create_response.json()["id"]

    response = client.get(f"/settings/{settings_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["key"] == "specific_setting"
    assert data["id"] == settings_id

def test_read_setting_not_found():
    response = client.get("/settings/999") # Assuming settings ID 999 does not exist
    assert response.status_code == 404
    assert response.json() == {"detail": "Settings not found"}

def test_update_setting():
    # Create a setting first
    create_response = client.post(
        "/settings/",
        json={"key": "setting_to_update", "value": "value_to_update"},
    )
    settings_id = create_response.json()["id"]

    update_response = client.put(
        f"/settings/{settings_id}",
        json={"value": "updated_value"},
    )
    assert update_response.status_code == 200
    data = update_response.json()
    assert data["value"] == "updated_value"
    assert data["id"] == settings_id

def test_update_setting_not_found():
    update_response = client.put(
        "/settings/999", # Assuming settings ID 999 does not exist
        json={"value": "updated_value"},
    )
    assert update_response.status_code == 404
    assert update_response.json() == {"detail": "Settings not found"}

def test_delete_setting():
    # Create a setting first
    create_response = client.post(
        "/settings/",
        json={"key": "setting_to_delete", "value": "value_to_delete"},
    )
    settings_id = create_response.json()["id"]

    delete_response = client.delete(f"/settings/{settings_id}")
    assert delete_response.status_code == 204

    # Verify the setting is deleted
    get_response = client.get(f"/settings/{settings_id}")
    assert get_response.status_code == 404

def test_delete_setting_not_found():
    delete_response = client.delete("/settings/999") # Assuming settings ID 999 does not exist
    assert delete_response.status_code == 404
    assert response.json() == {"detail": "Settings not found"}