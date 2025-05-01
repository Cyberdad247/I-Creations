from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from backend.fastapi.database import Base

class ToolModel(Base):
    __tablename__ = 'tools'
    __table_args__ = {'extend_existing': True}
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(String)
    agent_id = Column(Integer, ForeignKey('agents.id'))
    agent = relationship("AgentModel", back_populates="tools")

class MemoryModel(Base):
    __tablename__ = 'memories'
    __table_args__ = {'extend_existing': True}
    id = Column(Integer, primary_key=True)
    memory_type = Column(String, nullable=False)
    parameters = Column(JSON)
    agent_id = Column(Integer, ForeignKey('agents.id'))
    agent = relationship("AgentModel", back_populates="memories")

class AgentModel(Base):
    __tablename__ = 'agents'
    __table_args__ = {'extend_existing': True}
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(String)
    tools = relationship("ToolModel", back_populates="agent")
    memories = relationship("MemoryModel", back_populates="agent")

class UserModel(Base):
    __tablename__ = 'users'
    __table_args__ = {'extend_existing': True}
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)