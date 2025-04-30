from sqlalchemy.orm import Session
from .models import agent as models
from .models import schemas
import json

def get_agent(db: Session, agent_id: int):
    return db.query(models.Agent).filter(models.Agent.id == agent_id).first()

def get_agents(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Agent).offset(skip).limit(limit).all()

def create_agent(db: Session, agent: schemas.AgentCreate):
    db_agent = models.Agent(**agent.dict())
    db.add(db_agent)
    db.commit()
    db.refresh(db_agent)
    return db_agent

def update_agent(db: Session, agent_id: int, agent: schemas.AgentUpdate):
    db_agent = get_agent(db, agent_id)
    if db_agent:
        for key, value in agent.dict().items():
            setattr(db_agent, key, value)
        db.commit()
        db.refresh(db_agent)
    return db_agent

def delete_agent(db: Session, agent_id: int):
    db_agent = get_agent(db, agent_id)
    if db_agent:
        db.delete(db_agent)
        db.commit()
    return db_agent

def get_agent_tools(db: Session, agent_id: int):
    agent = get_agent(db, agent_id)
    if not agent:
        return None
    return json.loads(agent.tools) if agent.tools else []

def update_agent_tools(db: Session, agent_id: int, tools: list):
    agent = get_agent(db, agent_id)
    if agent:
        agent.tools = json.dumps(tools)
        db.commit()
        db.refresh(agent)
    return json.loads(agent.tools) if agent.tools else []

def get_agent_memory(db: Session, agent_id: int):
    agent = get_agent(db, agent_id)
    if not agent:
        return None
    return json.loads(agent.memory) if agent.memory else []

def update_agent_memory(db: Session, agent_id: int, memory: list):
    agent = get_agent(db, agent_id)
    if agent:
        agent.memory = json.dumps(memory)
        db.commit()
        db.refresh(agent)
    return json.loads(agent.memory) if agent.memory else []
