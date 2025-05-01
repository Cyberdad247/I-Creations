import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from backend.fastapi.main import app
from backend.fastapi.database import Base, get_db
from backend.fastapi.models import Tool, User
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

# Test cases for tools routes

def test_create_tool():
    response = client.post(
        "/tools/",
        json={"name": "Test Tool", "description": "A tool for testing", "type": "api", "config": {}},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Test Tool"
    assert "id" in data

def test_read_tools():
    # Create a tool first
    client.post(
        "/tools/",
        json={"name": "Another Tool", "description": "Another tool", "type": "cli", "config": {}},
    )
    response = client.get("/tools/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1 # Should have at least the tool created in this test or previous tests
    assert any(tool["name"] == "Another Tool" for tool in data)

def test_read_tool():
    # Create a tool first
    create_response = client.post(
        "/tools/",
        json={"name": "Specific Tool", "description": "A specific tool", "type": "custom", "config": {}},
    )
    tool_id = create_response.json()["id"]

    response = client.get(f"/tools/{tool_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Specific Tool"
    assert data["id"] == tool_id

def test_read_tool_not_found():
    response = client.get("/tools/999") # Assuming tool ID 999 does not exist
    assert response.status_code == 404
    assert response.json() == {"detail": "Tool not found"}

def test_update_tool():
    # Create a tool first
    create_response = client.post(
        "/tools/",
        json={"name": "Tool to Update", "description": "Description to update", "type": "api", "config": {}},
    )
    tool_id = create_response.json()["id"]

    update_response = client.put(
        f"/tools/{tool_id}",
        json={"name": "Updated Tool Name", "description": "Updated description", "type": "cli"},
    )
    assert update_response.status_code == 200
    data = update_response.json()
    assert data["name"] == "Updated Tool Name"
    assert data["description"] == "Updated description"
    assert data["type"] == "cli"
    assert data["id"] == tool_id

def test_update_tool_not_found():
    update_response = client.put(
        "/tools/999", # Assuming tool ID 999 does not exist
        json={"name": "Updated Tool Name"},
    )
    assert update_response.status_code == 404
    assert update_response.json() == {"detail": "Tool not found"}

def test_delete_tool():
    # Create a tool first
    create_response = client.post(
        "/tools/",
        json={"name": "Tool to Delete", "description": "Description to delete", "type": "api", "config": {}},
    )
    tool_id = create_response.json()["id"]

    delete_response = client.delete(f"/tools/{tool_id}")
    assert delete_response.status_code == 204

    # Verify the tool is deleted
    get_response = client.get(f"/tools/{tool_id}")
    assert get_response.status_code == 404

def test_delete_tool_not_found():
    delete_response = client.delete("/tools/999") # Assuming tool ID 999 does not exist
    assert delete_response.status_code == 404
    assert delete_response.json() == {"detail": "Tool not found"}