import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from unittest.mock import MagicMock, AsyncMock

from backend.fastapi.main import app
from backend.fastapi.database import Base, get_db
from backend.fastapi.models import AgentModel, User
from backend.fastapi.auth import get_current_user
from backend.fastapi.agent_executor import AgentExecutor

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

# Test cases for agents routes

def test_create_agent():
    response = client.post(
        "/agents/",
        json={"name": "Test Agent", "prompt_template": "Test prompt", "tools": [], "memory": None},
    )
    assert response.status_code == 200 # FastAPI defaults to 200 for POST if not specified
    data = response.json()
    assert data["name"] == "Test Agent"
    assert "id" in data

def test_read_agents():
    # Create an agent first
    client.post(
        "/agents/",
        json={"name": "Another Agent", "prompt_template": "Another prompt", "tools": [], "memory": None},
    )
    response = client.get("/agents/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1 # Should have at least the agent created in this test or previous tests
    assert any(agent["name"] == "Another Agent" for agent in data)

def test_read_agent():
    # Create an agent first
    create_response = client.post(
        "/agents/",
        json={"name": "Specific Agent", "prompt_template": "Specific prompt", "tools": [], "memory": None},
    )
    agent_id = create_response.json()["id"]

    response = client.get(f"/agents/{agent_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Specific Agent"
    assert data["id"] == agent_id

def test_read_agent_not_found():
    response = client.get("/agents/999") # Assuming agent ID 999 does not exist
    assert response.status_code == 404
    assert response.json() == {"detail": "Agent not found"}

def test_update_agent():
    # Create an agent first
    create_response = client.post(
        "/agents/",
        json={"name": "Agent to Update", "prompt_template": "Prompt to update", "tools": [], "memory": None},
    )
    agent_id = create_response.json()["id"]

    update_response = client.put(
        f"/agents/{agent_id}",
        json={"name": "Updated Agent Name", "prompt_template": "Updated prompt"},
    )
    assert update_response.status_code == 200
    data = update_response.json()
    assert data["name"] == "Updated Agent Name"
    assert data["prompt_template"] == "Updated prompt"
    assert data["id"] == agent_id

def test_update_agent_not_found():
    update_response = client.put(
        "/agents/999", # Assuming agent ID 999 does not exist
        json={"name": "Updated Agent Name"},
    )
    assert update_response.status_code == 404
    assert response.json() == {"detail": "Agent not found"}

def test_delete_agent():
    # Create an agent first
    create_response = client.post(
        "/agents/",
        json={"name": "Agent to Delete", "prompt_template": "Prompt to delete", "tools": [], "memory": None},
    )
    agent_id = create_response.json()["id"]

    delete_response = client.delete(f"/agents/{agent_id}")
    assert delete_response.status_code == 200 # FastAPI defaults to 200 for DELETE if not specified
    assert delete_response.json() == {"message": "Agent deleted successfully"}

    # Verify the agent is deleted
    get_response = client.get(f"/agents/{agent_id}")
    assert get_response.status_code == 404

def test_delete_agent_not_found():
    delete_response = client.delete("/agents/999") # Assuming agent ID 999 does not exist
    assert delete_response.status_code == 404
    assert delete_response.json() == {"detail": "Agent not found"}

@pytest.mark.asyncio
async def test_execute_agent_endpoint():
    # Create a dummy agent in the test database
    db = TestingSessionLocal()
    agent = AgentModel(name="Executable Agent", prompt_template="Execute this", tools=[], memory=None)
    db.add(agent)
    db.commit()
    db.refresh(agent)
    agent_id = agent.id
    db.close()

    # Mock the AgentExecutor
    mock_executor = AsyncMock()
    # Patch the AgentModelExecutor in the agents route
    app.dependency_overrides[AgentExecutor] = lambda: mock_executor

    with client.websocket_connect(f"/agents/{agent_id}/execute") as websocket:
        # The route should call the execute_agent method on the mocked executor
        mock_executor.execute_agent.assert_called_once_with(agent, websocket)

        # Simulate the executor sending a completion message
        await websocket.send_text("STATUS: COMPLETE")

        # The route should close the websocket after execution
        # We can't directly assert websocket.close() was called on the server side
        # But the client side will receive the close frame.
        # We can try receiving after the expected close to see if it's closed.
        with pytest.raises(Exception): # Expecting an exception because the websocket should be closed
             websocket.receive_text()

    # Clean up the dependency override
    del app.dependency_overrides[AgentExecutor]

@pytest.mark.asyncio
async def test_execute_agent_endpoint_agent_not_found():
    # Mock the AgentExecutor (though it shouldn't be called in this case)
    mock_executor = AsyncMock()
    app.dependency_overrides[AgentExecutor] = lambda: mock_executor

    with client.websocket_connect("/agents/999/execute") as websocket:
        # The route should send an error message and close the websocket
        message = websocket.receive_text()
        assert message == "Error: Agent with ID 999 not found."

        # The executor should not have been called
        mock_executor.execute_agent.assert_not_called()

        # The websocket should be closed
        with pytest.raises(Exception): # Expecting an exception because the websocket should be closed
             websocket.receive_text()

    # Clean up the dependency override
    del app.dependency_overrides[AgentExecutor]