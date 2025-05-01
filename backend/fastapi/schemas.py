from pydantic import BaseModel, ConfigDict
from typing import List, Optional

class UserCreate(BaseModel):
    username: str
    password: str

class User(BaseModel):
    id: int
    username: str

    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None

class ToolBase(BaseModel):
    name: str
    description: Optional[str] = None

class ToolCreate(ToolBase):
    agent_id: int

class Tool(ToolBase):
    id: int
    agent_id: int

    model_config = ConfigDict(from_attributes=True)
class ToolUpdate(ToolBase):
    name: Optional[str] = None
    description: Optional[str] = None

class MemoryBase(BaseModel):
    memory_type: str
    parameters: Optional[dict] = None

class MemoryCreate(MemoryBase):
    agent_id: int

class Memory(MemoryBase):
    id: int
    agent_id: int

    model_config = ConfigDict(from_attributes=True)
class MemoryUpdate(MemoryBase):
    memory_type: Optional[str] = None
    parameters: Optional[dict] = None

class AgentBase(BaseModel):
    name: str
    description: Optional[str] = None

class AgentCreate(AgentBase):
    pass

class Agent(AgentBase):
    id: int
    tools: List[Tool] = []
    memories: List[Memory] = []

    model_config = ConfigDict(from_attributes=True)

class Settings(BaseModel):
    provider_name: str
    api_key: str

class SettingsCreate(BaseModel):
    provider_name: str
    api_key: str

class SettingsUpdate(BaseModel):
    provider_name: Optional[str] = None
    api_key: Optional[str] = None