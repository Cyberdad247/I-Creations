from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..models import agent as models
from ..models import schemas
from ..database import get_db
from ..crud import (
    get_agent, get_agents, 
    create_agent, update_agent, 
    delete_agent
)

router = APIRouter()

class AgentTool(schemas.BaseModel):
    name: str
    description: str
    config: dict = {}

class AgentMemory(schemas.BaseModel):
    type: str
    content: str
    timestamp: str

@router.post("/", response_model=schemas.Agent)
def create_new_agent(agent: schemas.AgentCreate, db: Session = Depends(get_db)):
    return create_agent(db=db, agent=agent)

@router.get("/", response_model=list[schemas.Agent])
def read_agents(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    agents = get_agents(db, skip=skip, limit=limit)
    return agents

@router.get("/{agent_id}", response_model=schemas.Agent)
def read_agent(agent_id: int, db: Session = Depends(get_db)):
    db_agent = get_agent(db, agent_id=agent_id)
    if db_agent is None:
        raise HTTPException(status_code=404, detail="Agent not found")
    return db_agent

@router.put("/{agent_id}", response_model=schemas.Agent)
def update_existing_agent(
    agent_id: int, 
    agent: schemas.AgentUpdate, 
    db: Session = Depends(get_db)
):
    db_agent = update_agent(db, agent_id=agent_id, agent=agent)
    if db_agent is None:
        raise HTTPException(status_code=404, detail="Agent not found")
    return db_agent

@router.delete("/{agent_id}", response_model=schemas.Agent)
def delete_existing_agent(agent_id: int, db: Session = Depends(get_db)):
    db_agent = delete_agent(db, agent_id=agent_id)
    if db_agent is None:
        raise HTTPException(status_code=404, detail="Agent not found")
    return db_agent

@router.get("/{agent_id}/tools", response_model=List[AgentTool])
def get_agent_tools(agent_id: int, db: Session = Depends(get_db)):
    from ..crud import get_agent_tools as crud_get_tools
    tools = crud_get_tools(db, agent_id)
    if tools is None:
        raise HTTPException(status_code=404, detail="Agent not found")
    return tools

@router.put("/{agent_id}/tools", response_model=List[AgentTool])
def update_agent_tools(agent_id: int, tools: List[AgentTool], db: Session = Depends(get_db)):
    from ..crud import update_agent_tools as crud_update_tools
    updated_tools = crud_update_tools(db, agent_id, tools)
    if updated_tools is None:
        raise HTTPException(status_code=404, detail="Agent not found")
    return updated_tools

@router.get("/{agent_id}/memory", response_model=List[AgentMemory])
def get_agent_memory(agent_id: int, db: Session = Depends(get_db)):
    from ..crud import get_agent_memory as crud_get_memory
    memory = crud_get_memory(db, agent_id)
    if memory is None:
        raise HTTPException(status_code=404, detail="Agent not found")
    return memory

@router.put("/{agent_id}/memory", response_model=List[AgentMemory])
def update_agent_memory(agent_id: int, memory: List[AgentMemory], db: Session = Depends(get_db)):
    from ..crud import update_agent_memory as crud_update_memory
    updated_memory = crud_update_memory(db, agent_id, memory)
    if updated_memory is None:
        raise HTTPException(status_code=404, detail="Agent not found")
    return updated_memory
