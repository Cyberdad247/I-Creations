from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .models.base import Base

# Use SQLite for development, PostgreSQL for production
import os
DB_TYPE = os.getenv("DB_TYPE", "sqlite")

if DB_TYPE == "postgres":
    SQLALCHEMY_DATABASE_URL = "postgresql://postgres:postgres@localhost/agent_platform"
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
else:
    SQLALCHEMY_DATABASE_URL = "sqlite:///./agent_platform.db"
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
    )
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
