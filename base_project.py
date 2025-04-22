"""
Base Project module for the Creation AI Ecosystem.
Defines the core project structure and functionality.
"""

from typing import Dict, List, Optional, Any
import uuid
from datetime import datetime


class BaseProject:
    """
    Base class for all projects in the Creation AI Ecosystem.
    Provides core functionality for project definition and management.
    """
    
    def __init__(self, name: str, description: str, goal: str):
        """
        Initialize a new project with basic properties.
        
        Args:
            name: The name of the project
            description: A description of the project's purpose
            goal: The primary goal of the project
        """
        self.id = str(uuid.uuid4())
        self.name = name
        self.description = description
        self.goal = goal
        self.tasks = []
        self.agents = []
        self.dependencies = {}  # task_id -> agent_id
        self.status = "Not Started"
        self.created_at = datetime.now()
        self.updated_at = datetime.now()
        self.metadata = {}
        self.progress = 0.0  # 0.0 to 1.0
    
    def add_task(self, task: Any) -> None:
        """
        Add a task to the project.
        
        Args:
            task: The task object to add
        """
        self.tasks.append(task)
        self.updated_at = datetime.now()
    
    def remove_task(self, task_id: str) -> bool:
        """
        Remove a task from the project.
        
        Args:
            task_id: The ID of the task to remove
            
        Returns:
            bool: True if the task was removed, False if it wasn't found
        """
        for i, task in enumerate(self.tasks):
            if task.id == task_id:
                self.tasks.pop(i)
                # Remove any dependencies for this task
                if task_id in self.dependencies:
                    del self.dependencies[task_id]
                self.updated_at = datetime.now()
                return True
        return False
    
    def add_agent(self, agent: Any) -> None:
        """
        Add an agent to the project.
        
        Args:
            agent: The agent object to add
        """
        self.agents.append(agent)
        self.updated_at = datetime.now()
    
    def remove_agent(self, agent_id: str) -> bool:
        """
        Remove an agent from the project.
        
        Args:
            agent_id: The ID of the agent to remove
            
        Returns:
            bool: True if the agent was removed, False if it wasn't found
        """
        for i, agent in enumerate(self.agents):
            if agent.id == agent_id:
                self.agents.pop(i)
                # Remove any dependencies for this agent
                for task_id, assigned_agent_id in list(self.dependencies.items()):
                    if assigned_agent_id == agent_id:
                        del self.dependencies[task_id]
                self.updated_at = datetime.now()
                return True
        return False
    
    def assign_agent(self, task_id: str, agent_id: str) -> bool:
        """
        Assign an agent to a task.
        
        Args:
            task_id: The ID of the task
            agent_id: The ID of the agent
            
        Returns:
            bool: True if the assignment was successful, False otherwise
        """
        # Check if task exists
        task_exists = any(task.id == task_id for task in self.tasks)
        # Check if agent exists
        agent_exists = any(agent.id == agent_id for agent in self.agents)
        
        if task_exists and agent_exists:
            self.dependencies[task_id] = agent_id
            self.updated_at = datetime.now()
            return True
        return False
    
    def unassign_agent(self, task_id: str) -> bool:
        """
        Unassign an agent from a task.
        
        Args:
            task_id: The ID of the task
            
        Returns:
            bool: True if the unassignment was successful, False otherwise
        """
        if task_id in self.dependencies:
            del self.dependencies[task_id]
            self.updated_at = datetime.now()
            return True
        return False
    
    def update_status(self, status: str) -> None:
        """
        Update the status of the project.
        
        Args:
            status: The new status of the project
        """
        self.status = status
        self.updated_at = datetime.now()
    
    def update_progress(self) -> None:
        """
        Update the progress of the project based on task completion.
        """
        if not self.tasks:
            self.progress = 0.0
            return
        
        completed_tasks = sum(1 for task in self.tasks if task.status.lower() == "completed")
        self.progress = completed_tasks / len(self.tasks)
        self.updated_at = datetime.now()
        
        # Update status based on progress
        if self.progress == 0.0:
            self.status = "Not Started"
        elif self.progress < 1.0:
            self.status = "In Progress"
        else:
            self.status = "Completed"
    
    def add_metadata(self, key: str, value: Any) -> None:
        """
        Add metadata to the project.
        
        Args:
            key: The metadata key
            value: The metadata value
        """
        self.metadata[key] = value
        self.updated_at = datetime.now()
    
    def to_dict(self) -> Dict[str, Any]:
        """
        Convert the project to a dictionary representation.
        
        Returns:
            Dict: A dictionary representation of the project
        """
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "goal": self.goal,
            "tasks": [task.to_dict() for task in self.tasks],
            "agents": [agent.id for agent in self.agents],
            "dependencies": self.dependencies,
            "status": self.status,
            "progress": self.progress,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "metadata": self.metadata
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any], tasks: List[Any] = None, agents: List[Any] = None) -> 'BaseProject':
        """
        Create a project from a dictionary representation.
        
        Args:
            data: Dictionary containing project data
            tasks: List of task objects (optional)
            agents: List of agent objects (optional)
            
        Returns:
            BaseProject: A new project instance
        """
        project = cls(
            name=data["name"],
            description=data["description"],
            goal=data["goal"]
        )
        
        project.id = data.get("id", project.id)
        project.status = data.get("status", "Not Started")
        project.progress = data.get("progress", 0.0)
        
        # Add tasks if provided
        if tasks:
            for task in tasks:
                project.add_task(task)
        
        # Add agents if provided
        if agents:
            for agent in agents:
                project.add_agent(agent)
        
        # Set dependencies
        project.dependencies = data.get("dependencies", {})
        
        if data.get("created_at"):
            project.created_at = datetime.fromisoformat(data["created_at"])
        
        if data.get("updated_at"):
            project.updated_at = datetime.fromisoformat(data["updated_at"])
        
        project.metadata = data.get("metadata", {})
        
        return project
    
    def __str__(self) -> str:
        """
        String representation of the project.
        
        Returns:
            str: A string representation of the project
        """
        return f"Project(name={self.name}, status={self.status}, progress={self.progress:.0%})"
    
    def __repr__(self) -> str:
        """
        Detailed string representation of the project.
        
        Returns:
            str: A detailed string representation of the project
        """
        return f"Project(id={self.id}, name={self.name}, tasks={len(self.tasks)}, agents={len(self.agents)}, status={self.status})"
