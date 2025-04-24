from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from data_storage.vector_db import DataStorage
import uuid
from orchestration.orchestration_engine import OrchestrationEngine
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from datetime import timedelta, datetime

# --- Constants for JWT Authentication ---
SECRET_KEY = "your-secret-key"  # Replace with a secure value in production
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token")

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        return {"user_id": user_id}
    except JWTError:
        raise credentials_exception

# --- Pydantic Models ---
class AgentModel(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    persona: Optional[Dict[str, Any]] = None
    skills: Optional[List[str]] = []
    status: Optional[str] = "offline"

class ProjectModel(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    goal: str
    status: Optional[str] = "Not Started"
    tasks: Optional[List[str]] = []
    agents: Optional[List[str]] = []

class TaskModel(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    task_name: str
    description: str
    status: Optional[str] = "Open"
    priority: Optional[str] = "Normal"
    due_date: Optional[str] = None
    subtasks: Optional[List[str]] = []
    dependencies: Optional[List[str]] = []
    tags: Optional[List[str]] = []

class AssignmentModel(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    task_id: str
    agent_id: str
    status: Optional[str] = "Assigned"

# --- FastAPI App Setup ---
app = FastAPI(title="I-Creations Agent API", version="0.2.0")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

data_storage = DataStorage()
orchestration_engine = OrchestrationEngine()

# --- Agent Endpoints ---
@app.get("/agents", response_model=List[AgentModel])
def list_agents():
    return [a.to_dict() for a in data_storage.agent_repository.values()]

@app.post("/agents", response_model=AgentModel)
def create_agent(agent: AgentModel):
    data_storage.store_agent(agent)
    return agent

@app.get("/agents/{agent_id}", response_model=AgentModel)
def get_agent(agent_id: str):
    agent = data_storage.get_agent(agent_id)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    return agent.to_dict()

@app.put("/agents/{agent_id}", response_model=AgentModel)
def update_agent(agent_id: str, agent_update: AgentModel):
    agent = data_storage.get_agent(agent_id)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    for k, v in agent_update.dict().items():
        setattr(agent, k, v)
    data_storage.store_agent(agent)
    return agent.to_dict()

@app.delete("/agents/{agent_id}")
def delete_agent(agent_id: str):
    if not data_storage.delete_agent(agent_id):
        raise HTTPException(status_code=404, detail="Agent not found")
    return {"result": "deleted"}

# --- Project Endpoints ---
@app.get("/projects", response_model=List[ProjectModel])
def list_projects():
    return [p.to_dict() for p in data_storage.project_repository.values()]

@app.post("/projects", response_model=ProjectModel)
def create_project(project: ProjectModel):
    data_storage.store_project(project)
    return project

@app.get("/projects/{project_id}", response_model=ProjectModel)
def get_project(project_id: str):
    project = data_storage.get_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project.to_dict()

@app.put("/projects/{project_id}", response_model=ProjectModel)
def update_project(project_id: str, project_update: ProjectModel):
    project = data_storage.get_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    for k, v in project_update.dict().items():
        setattr(project, k, v)
    data_storage.store_project(project)
    return project.to_dict()

@app.delete("/projects/{project_id}")
def delete_project(project_id: str):
    if not data_storage.delete_project(project_id):
        raise HTTPException(status_code=404, detail="Project not found")
    return {"result": "deleted"}

# --- Task Endpoints ---
@app.get("/tasks", response_model=List[TaskModel])
def list_tasks():
    return [t.to_dict() for t in data_storage.list_tasks()]

@app.post("/tasks", response_model=TaskModel)
def create_task(task: TaskModel):
    data_storage.store_task(task)
    return task

@app.get("/tasks/{task_id}", response_model=TaskModel)
def get_task(task_id: str):
    task = data_storage.get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task.to_dict()

@app.put("/tasks/{task_id}", response_model=TaskModel)
def update_task(task_id: str, task_update: TaskModel):
    task = data_storage.get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    for k, v in task_update.dict().items():
        setattr(task, k, v)
    data_storage.store_task(task)
    return task.to_dict()

@app.delete("/tasks/{task_id}")
def delete_task(task_id: str):
    if not data_storage.delete_task(task_id):
        raise HTTPException(status_code=404, detail="Task not found")
    return {"result": "deleted"}

# --- Assignment Endpoints ---
@app.get("/assignments", response_model=List[AssignmentModel])
def list_assignments():
    return [a.to_dict() for a in data_storage.list_assignments()]

@app.get("/assignments/{assignment_id}", response_model=AssignmentModel)
def get_assignment(assignment_id: str):
    assignment = data_storage.get_assignment(assignment_id)
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    return assignment.to_dict()

@app.post("/assignments", response_model=AssignmentModel)
def create_assignment(assignment: AssignmentModel, user=Depends(get_current_user)):
    from assignment import Assignment
    assignment_obj = Assignment.from_dict(assignment.dict())
    data_storage.store_assignment(assignment_obj)
    agent = data_storage.get_agent(assignment.agent_id)
    if agent:
        agent.status = "assigned"
        data_storage.store_agent(agent)
    task = data_storage.get_task(assignment.task_id)
    if task:
        task.status = "assigned"
        data_storage.store_task(task)
    return assignment

@app.delete("/assignments/{assignment_id}")
def delete_assignment(assignment_id: str):
    if not data_storage.delete_assignment(assignment_id):
        raise HTTPException(status_code=404, detail="Assignment not found")
    return {"result": "deleted"}

# --- Orchestration Endpoints ---
@app.post("/orchestrate")
def orchestrate(payload: Dict[str, Any], user=Depends(get_current_user)):
    query = payload.get("query")
    if not query:
        raise HTTPException(status_code=400, detail="Missing query")
    agents = list(data_storage.agent_repository.values())
    plan = orchestration_engine.create_execution_plan(query, agents)
    result = orchestration_engine.execute_plan(plan)
    return {"plan": plan, "result": result}

# --- Auth Endpoints ---
@app.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # Dummy user validation for demonstration; replace with real user lookup
    if form_data.username == "admin" and form_data.password == "password":
        access_token = create_access_token(
            data={"sub": form_data.username},
            expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        return {"access_token": access_token, "token_type": "bearer"}
    raise HTTPException(status_code=401, detail="Incorrect username or password")

@app.get("/auth/check")
def check_auth():
    # Placeholder for authentication check
    return {"authenticated": True}

# --- Health Check ---
@app.get("/health")
def health():
    return {"status": "ok", "message": "Server is running"}

# --- Interactive Tutorial Endpoints ---
@app.get("/api/onboarding/steps", tags=["Onboarding"])
async def get_onboarding_steps():
    """Returns structured onboarding steps for new users"""
    return {
        "version": "1.0",
        "steps": [
            {
                "id": "welcome",
                "title": "Welcome Tour",
                "description": "Introduction to the platform",
                "estimated_time": "2 minutes",
                "completed": False,
                "actions": ["next", "skip"]
            },
            {
                "id": "agent-creation",
                "title": "Create Your First Agent",
                "description": "Step-by-step agent creation guide",
                "estimated_time": "5 minutes", 
                "completed": False,
                "actions": ["next", "back", "skip"]
            },
            {
                "id": "first-project",
                "title": "Start Your First Project",
                "description": "Learn how to create and manage projects",
                "estimated_time": "3 minutes",
                "completed": False,
                "actions": ["next", "back", "skip"]
            }
        ]
    }

@app.get("/api/tooltips/{context}", tags=["Tooltips"])
async def get_contextual_tip(context: str):
    """Returns contextual help based on user's current activity"""
    tips = {
        "agent-name": {
            "title": "Naming Your Agent",
            "content": "Choose a clear, descriptive name that reflects your agent's purpose",
            "examples": ["Customer Support Bot", "Data Analysis Assistant"]
        },
        "agent-skills": {
            "title": "Selecting Skills",
            "content": "Pick skills that match your agent's intended tasks. You can add more later.",
            "examples": ["Language Understanding", "Data Processing"]
        },
        "project-goal": {
            "title": "Defining Project Goals",
            "content": "Be specific about what you want to achieve with this project",
            "examples": ["Build a customer support chatbot", "Analyze sales data"]
        }
    }
    return tips.get(context, {
        "title": "Help Tip",
        "content": "Here's some helpful information",
        "examples": []
    })
