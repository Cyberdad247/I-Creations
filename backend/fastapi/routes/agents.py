from fastapi import APIRouter, HTTPException, Depends, WebSocket
from sqlalchemy.orm import Session
from typing import List
from backend.fastapi.models import AgentModel, UserModel
from backend.fastapi.database import get_db
from backend.fastapi.auth import get_current_active_user
from backend.fastapi.agent_executor import AgentExecutor
from backend.fastapi.schemas import Agent, AgentCreate, NaturalLanguageQuery

router = APIRouter(prefix="/agents", tags=["agents"])

@router.post("/create_from_query")
async def create_agent_from_query(query: NaturalLanguageQuery, db: Session = Depends(get_db), current_user: UserModel = Depends(get_current_active_user)) -> Agent:
    # Placeholder for natural language query processing
    # In a real implementation, this would involve calling an NLP model
    # to interpret the query and extract agent parameters.
    print(f"Received natural language query: {query.query}")

    # Placeholder for mapping query intent to agent configuration
    # This is a simplified example; a real implementation would be more complex
    # and likely involve looking up templates or using a configuration generator.
    agent_config = AgentCreate(
        name=f"Agent from query: {query.query[:20]}...",
        description=f"Created from natural language query: {query.query}"
    )

    # Utilize the existing agent creation logic
    return await create_agent(agent=agent_config, db=db, current_user=current_user)

@router.get("/")
async def get_agents(db: Session = Depends(get_db), current_user: UserModel = Depends(get_current_active_user)) -> List[Agent]:
    agents = db.query(AgentModel).all()
    return agents

@router.post("/")
async def create_agent(agent: AgentCreate, db: Session = Depends(get_db), current_user: UserModel = Depends(get_current_active_user)) -> Agent:
    db_agent = AgentModel(**agent.model_dump())
    db.add(db_agent)
    db.commit()
    db.refresh(db_agent)
    return db_agent

@router.get("/{agent_id}")
async def get_agent(agent_id: int, db: Session = Depends(get_db), current_user: UserModel = Depends(get_current_active_user)) -> Agent:
    db_agent = db.query(AgentModel).filter(AgentModel.id == agent_id).first()
    if db_agent is None:
        raise HTTPException(status_code=404, detail="Agent not found")
    return db_agent

@router.put("/{agent_id}")
async def update_agent(agent_id: int, agent: AgentCreate, db: Session = Depends(get_db), current_user: UserModel = Depends(get_current_active_user)) -> Agent:
    db_agent = db.query(AgentModel).filter(AgentModel.id == agent_id).first()
    if db_agent is None:
        raise HTTPException(status_code=404, detail="Agent not found")
    update_data = agent.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_agent, key, value)
    db.commit()
    db.refresh(db_agent)
    return db_agent

@router.delete("/{agent_id}")
async def delete_agent(agent_id: int, db: Session = Depends(get_db), current_user: UserModel = Depends(get_current_active_user)):
    db_agent = db.query(AgentModel).filter(AgentModel.id == agent_id).first()
    if db_agent is None:
        raise HTTPException(status_code=404, detail="Agent not found")
    db.delete(db_agent)
    db.commit()
    return {"message": "Agent deleted successfully"}

@router.post("/{agent_id}/execute")
async def execute_agent_endpoint(agent_id: int, websocket: WebSocket, db: Session = Depends(get_db), current_user: UserModel = Depends(get_current_active_user)):
    await websocket.accept()
    db_agent = db.query(AgentModel).filter(AgentModel.id == agent_id).first()
    if db_agent is None:
        await websocket.send_text(f"Error: Agent with ID {agent_id} not found.")
        await websocket.close()
        return

    executor = AgentModelExecutor()
    await executor.execute_agent(db_agent, websocket)

    await websocket.close()
    return {"message": f"Agent execution completed for agent ID: {agent_id}."}