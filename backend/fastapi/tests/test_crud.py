import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from ..src.models.agent import Base
from ..src.crud import (
    create_agent, get_agent, 
    get_agents, update_agent,
    delete_agent
)
from ..src.schemas import AgentCreate, AgentUpdate

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="module")
def test_db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

def test_create_agent(test_db):
    agent_data = AgentCreate(
        name="Test Agent",
        description="Test Description",
        config="{}"
    )
    agent = create_agent(db=test_db, agent=agent_data)
    assert agent.id is not None
    assert agent.name == "Test Agent"

def test_get_agent(test_db):
    agent_data = AgentCreate(
        name="Test Agent",
        description="Test Description",
        config="{}"
    )
    agent = create_agent(db=test_db, agent=agent_data)
    db_agent = get_agent(db=test_db, agent_id=agent.id)
    assert db_agent.id == agent.id
    assert db_agent.name == "Test Agent"

def test_update_agent(test_db):
    agent_data = AgentCreate(
        name="Test Agent",
        description="Test Description",
        config="{}"
    )
    agent = create_agent(db=test_db, agent=agent_data)
    update_data = AgentUpdate(name="Updated Agent")
    updated_agent = update_agent(
        db=test_db, 
        agent_id=agent.id, 
        agent=update_data
    )
    assert updated_agent.name == "Updated Agent"

def test_delete_agent(test_db):
    agent_data = AgentCreate(
        name="Test Agent",
        description="Test Description",
        config="{}"
    )
    agent = create_agent(db=test_db, agent=agent_data)
    deleted_agent = delete_agent(db=test_db, agent_id=agent.id)
    assert deleted_agent.id == agent.id
    assert get_agent(db=test_db, agent_id=agent.id) is None