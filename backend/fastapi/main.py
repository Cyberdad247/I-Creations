# Main application entry point for the FastAPI backend.

from fastapi import FastAPI, WebSocket
from backend.fastapi.database import engine, SessionLocal
from backend.fastapi.models import Base

# Import routers for different API endpoints
from backend.fastapi.routes.agents import router as agents_router
from backend.fastapi.routes.auth import router as auth_router
from backend.fastapi.routes.tools import router as tools_router
from backend.fastapi.routes.memory import router as memory_router
from backend.fastapi.routes.settings import router as settings_router

import logging
from fastapi.responses import JSONResponse

# Configure basic logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Custom exception class for application-specific errors
class AppException(Exception):
    def __init__(self, status_code: int, detail: any):
        self.status_code = status_code
        self.detail = detail

# Exception handler for AppException
@app.exception_handler(AppException)
async def app_exception_handler(request, exc: AppException):
    logger.error(f"AppException caught: {exc.detail}", exc_info=True)
    return JSONResponse(
        status_code=exc.status_code,
        content={"error_code": exc.status_code, "message": exc.detail},
    )

# Initialize the FastAPI application
app = FastAPI()

# Include routers to add API endpoints
app.include_router(agents_router)
app.include_router(auth_router)
app.include_router(tools_router)
app.include_router(memory_router)
app.include_router(settings_router)

# WebSocket endpoint for agent execution updates
@app.websocket("/ws/agent-execution")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    # Keep the connection open and handle incoming messages (example)
    while True:
        data = await websocket.receive_text()
        # Process received data (e.g., command to start agent execution)
        await websocket.send_text(f"Message received: {data}") # Example echo

# Startup event to create database tables
@app.on_event("startup")
def startup_event():
    # Create database tables based on models
    Base.metadata.create_all(bind=engine)
    # Optional: Initialize database with default data if needed
    db = SessionLocal()
    # Example: Add initial data
    # db.add(...)
    # db.commit()
    db.close()

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "FastAPI with SQLAlchemy is running"}