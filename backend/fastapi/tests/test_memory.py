import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from backend.fastapi.main import app
from backend.fastapi.database import Base, get_db
from backend.fastapi.models import Memory, User
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

# Test cases for memory routes

def test_create_memory():
    response = client.post(
        "/memory/",
        json={"name": "Test Memory", "type": "short_term", "config": {}},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Test Memory"
    assert "id" in data

def test_read_memories():
    # Create a memory first
    client.post(
        "/memory/",
        json={"name": "Another Memory", "type": "long_term", "config": {}},
    )
    response = client.get("/memory/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1 # Should have at least the memory created in this test or previous tests
    assert any(memory["name"] == "Another Memory" for memory in data)

def test_read_memory():
    # Create a memory first
    create_response = client.post(
        "/memory/",
        json={"name": "Specific Memory", "type": "episodic", "config": {}},
    )
    memory_id = create_response.json()["id"]

    response = client.get(f"/memory/{memory_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Specific Memory"
    assert data["id"] == memory_id

def test_read_memory_not_found():
    response = client.get("/memory/999") # Assuming memory ID 999 does not exist
    assert response.status_code == 404
    assert response.json() == {"detail": "Memory not found"}

def test_update_memory():
    # Create a memory first
    create_response = client.post(
        "/memory/",
        json={"name": "Memory to Update", "type": "short_term", "config": {}},
    )
    memory_id = create_response.json()["id"]

    update_response = client.put(
        f"/memory/{memory_id}",
        json={"name": "Updated Memory Name", "type": "long_term"},
    )
    assert update_response.status_code == 200
    data = update_response.json()
    assert data["name"] == "Updated Memory Name"
    assert data["type"] == "long_term"
    assert data["id"] == memory_id

def test_update_memory_not_found():
    update_response = client.put(
        "/memory/999", # Assuming memory ID 999 does not exist
        json={"name": "Updated Memory Name"},
    )
    assert update_response.status_code == 404
    assert update_response.json() == {"detail": "Memory not found"}

def test_delete_memory():
    # Create a memory first
    create_response = client.post(
        "/memory/",
        json={"name": "Memory to Delete", "type": "short_term", "config": {}},
    )
    memory_id = create_response.json()["id"]

    delete_response = client.delete(f"/memory/{memory_id}")
    assert delete_response.status_code == 204

    # Verify the memory is deleted
    get_response = client.get(f"/memory/{memory_id}")
    assert get_response.status_code == 404

def test_delete_memory_not_found():
    delete_response = client.delete("/memory/999") # Assuming memory ID 999 does not exist
    assert delete_response.status_code == 404
    assert delete_response.json() == {"detail": "Memory not found"}