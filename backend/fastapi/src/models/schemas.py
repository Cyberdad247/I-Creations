from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class AgentBase(BaseModel):
    name: str
    description: Optional[str] = None
    is_active: bool = True
    config: Optional[str] = None
    version: Optional[str] = None
    status: Optional[str] = "idle"
    tools: Optional[str] = None
    memory: Optional[str] = None

class AgentCreate(AgentBase):
    pass

class AgentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None
    config: Optional[str] = None
    version: Optional[str] = None
    status: Optional[str] = None
    tools: Optional[str] = None
    memory: Optional[str] = None

class Agent(AgentBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
