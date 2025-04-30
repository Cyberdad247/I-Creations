"""
Orchestration Engine module for the Creation AI Ecosystem.
Defines the central intelligence that coordinates activities of smaller agents.
"""

from typing import Dict, List, Optional, Any, Tuple
import uuid
from datetime import datetime
import json


class OrchestrationEngine:
    """
    Class for the Super Agent Orchestration Engine in the Creation AI Ecosystem.
    Coordinates the activities of smaller agents to complete complex tasks.
    """
    
    def __init__(self):
        """
        Initialize a new orchestration engine with basic properties.
        """
        self.id = str(uuid.uuid4())
        self.agents = []
        self.execution_history = []
        self.created_at = datetime.now()
        self.updated_at = datetime.now()
        self.active_executions = {}  # execution_id -> execution_state
        self.metadata = {}
    
    def add_agent(self, agent: Any) -> None:
        """
        Add an agent to the orchestration engine.
        
        Args:
            agent: The agent object to add
        """
        self.agents.append(agent)
        self.updated_at = datetime.now()
    
    def remove_agent(self, agent_id: str) -> bool:
        """
        Remove an agent from the orchestration engine.
        
        Args:
            agent_id: The ID of the agent to remove
            
        Returns:
            bool: True if the agent was removed, False if it wasn't found
        """
        for i, agent in enumerate(self.agents):
            if agent.id == agent_id:
                self.agents.pop(i)
                self.updated_at = datetime.now()
                return True
        return False
    
    def decompose_task(self, query: str) -> list:
        """
        Decompose a complex query into subtasks (stub implementation).
        """
        # Example: split query by sentences as subtasks
        return [{"id": str(uuid.uuid4()), "description": s.strip()} for s in query.split('.') if s.strip()]

    def select_agent(self, task: dict, agents: list) -> object:
        """
        Select an agent for a given task (stub: pick first available).
        """
        for agent in agents:
            if getattr(agent, 'status', None) == 'offline':
                return agent
        return None

    def create_execution_plan(self, query: str, agents: list) -> dict:
        """
        Create an execution plan for a query (stub implementation).
        """
        subtasks = self.decompose_task(query)
        plan = {"id": str(uuid.uuid4()), "subtasks": []}
        for subtask in subtasks:
            agent = self.select_agent(subtask, agents)
            plan["subtasks"].append({"task": subtask, "agent": agent.id if agent else None})
        return plan

    def execute_plan(self, plan: dict) -> dict:
        """
        Execute a plan (stub: mark all subtasks as complete).
        """
        for sub in plan.get("subtasks", []):
            sub["status"] = "completed"
        return {"plan_id": plan["id"], "result": "all subtasks completed"}
    
    def get_execution_status(self, execution_id: str) -> Dict[str, Any]:
        """
        Get the status of an execution plan.
        
        Args:
            execution_id: The ID of the execution plan
            
        Returns:
            Dict: The current state of the execution plan
        """
        # Check active executions
        if execution_id in self.active_executions:
            return self.active_executions[execution_id]
        
        # Check execution history
        for execution in self.execution_history:
            if execution["id"] == execution_id:
                return execution
        
        raise ValueError(f"Execution plan {execution_id} not found")
    
    def cancel_execution(self, execution_id: str) -> bool:
        """
        Cancel an active execution plan.
        
        Args:
            execution_id: The ID of the execution plan to cancel
            
        Returns:
            bool: True if the execution was cancelled, False otherwise
        """
        if execution_id in self.active_executions:
            execution_plan = self.active_executions[execution_id]
            execution_plan["status"] = "Cancelled"
            execution_plan["updated_at"] = datetime.now().isoformat()
            
            # Move from active to history
            self.execution_history.append(execution_plan)
            del self.active_executions[execution_id]
            
            return True
        
        return False
    
    def add_metadata(self, key: str, value: Any) -> None:
        """
        Add metadata to the orchestration engine.
        
        Args:
            key: The metadata key
            value: The metadata value
        """
        self.metadata[key] = value
        self.updated_at = datetime.now()
    
    def to_dict(self) -> Dict[str, Any]:
        """
        Convert the orchestration engine to a dictionary representation.
        
        Returns:
            Dict: A dictionary representation of the orchestration engine
        """
        return {
            "id": self.id,
            "agents": [agent.id for agent in self.agents],
            "active_executions": len(self.active_executions),
            "execution_history": len(self.execution_history),
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "metadata": self.metadata
        }
    
    def __str__(self) -> str:
        """
        String representation of the orchestration engine.
        
        Returns:
            str: A string representation of the orchestration engine
        """
        return f"OrchestrationEngine(agents={len(self.agents)}, active_executions={len(self.active_executions)})"
    
    def __repr__(self) -> str:
        """
        Detailed string representation of the orchestration engine.
        
        Returns:
            str: A detailed string representation of the orchestration engine
        """
        return f"OrchestrationEngine(id={self.id}, agents={len(self.agents)}, active_executions={len(self.active_executions)}, history={len(self.execution_history)})"
