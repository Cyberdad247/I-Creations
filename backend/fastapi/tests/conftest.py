import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.fastapi.main import app
from backend.fastapi.database import Base, get_db

# Use an in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="session")
def client():
    # Create the database tables
    Base.metadata.create_all(bind=engine)
    with TestClient(app) as c:
        yield c
    # Drop the database tables after the session is over
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def db_session():
    """Create a new database session for each test that rolls back after the test."""
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)

    # Override the get_db dependency
    app.dependency_overrides[get_db] = lambda: session

    yield session

    session.close()
    transaction.rollback()
    connection.close()

# Apply the db_session fixture to all tests that require a database session
# This can be done by adding 'db_session' as an argument to the test functions