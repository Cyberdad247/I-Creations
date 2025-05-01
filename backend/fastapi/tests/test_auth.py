import pytest
from fastapi.testclient import TestClient
from backend.fastapi.main import app
from datetime import timedelta

def test_register_user(client: TestClient, db_session):
    response = client.post("/auth/register", json={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 200
    assert response.json()["username"] == "testuser"

def test_register_existing_user(client: TestClient, db_session):
    # Register a user first
    client.post("/auth/register", json={"username": "testuser", "password": "testpassword"})
    # Attempt to register the same user again
    response = client.post("/auth/register", json={"username": "testuser", "password": "anotherpassword"})
    assert response.status_code == 400
    assert response.json()["detail"] == "Username already registered"

def test_login_for_access_token(client: TestClient, db_session):
    # Register a user first
    client.post("/auth/register", json={"username": "testuser", "password": "testpassword"})
    # Attempt to login with the registered user
    response = client.post("/auth/token", data={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"

def test_login_incorrect_password(client: TestClient, db_session):
    response = client.post("/auth/token", data={"username": "testuser", "password": "wrongpassword"})
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect username or password"

def test_login_incorrect_username(client: TestClient, db_session):
    response = client.post("/auth/token", data={"username": "wronguser", "password": "testpassword"})
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect username or password"