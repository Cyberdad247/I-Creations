from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.sql import func
from .db import Base

class Agent(Base):
    __tablename__ = "agents"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    config = Column(Text)  # JSON configuration stored as text
    version = Column(String(20))
    status = Column(String(20), default="idle")
    tools = Column(Text)  # JSON array of tools
    memory = Column(Text)  # JSON array of memory items
