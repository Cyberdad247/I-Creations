from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine, Base
from .routers import agents

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Agent Platform API",
    description="API for managing AI agents in the Creation AI Ecosystem",
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(agents.router, prefix="/api/v1/agents", tags=["agents"])

@app.get("/")
async def root():
    return {"message": "Agent Platform API is running"}