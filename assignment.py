"""
Assignment module for the Creation AI Ecosystem.
Handles the assignment of agents to tasks.
"""

from typing import Dict, List, Optional, Any
import uuid
from datetime import datetime


class Assignment:
    """
    Class for managing assignments of agents to tasks in the Creation AI Ecosystem.
    """
    
    def __init__(self, task_id: str, agent_id: str):
        """
        Initialize a new assignment with basic properties.
        
        Args:
            task_id: The ID of the task being assigned
            agent_id: The ID of the agent being assigned
        """
        self.id = str(uuid.uuid4())
        self.task_id = task_id
        self.agent_id = agent_id
        self.status = "Assigned"
        self.created_at = datetime.now()
        self.updated_at = datetime.now()
        self.started_at = None
        self.completed_at = None
        self.metadata = {}
        self.notes = ""
    
    def start(self) -> None:
        """
        Mark the assignment as started.
        """
        self.status = "In Progress"
        self.started_at = datetime.now()
        self.updated_at = datetime.now()
    
    def complete(self) -> None:
        """
        Mark the assignment as completed.
        """
        self.status = "Completed"
        self.completed_at = datetime.now()
        self.updated_at = datetime.now()
    
    def pause(self) -> None:
        """
        Mark the assignment as paused.
        """
        self.status = "Paused"
        self.updated_at = datetime.now()
    
    def cancel(self) -> None:
        """
        Mark the assignment as cancelled.
        """
        self.status = "Cancelled"
        self.updated_at = datetime.now()
    
    def add_note(self, note: str) -> None:
        """
        Add a note to the assignment.
        
        Args:
            note: The note to add
        """
        if self.notes:
            self.notes += f"\n{note}"
        else:
            self.notes = note
        self.updated_at = datetime.now()
    
    def add_metadata(self, key: str, value: Any) -> None:
        """
        Add metadata to the assignment.
        
        Args:
            key: The metadata key
            value: The metadata value
        """
        self.metadata[key] = value
        self.updated_at = datetime.now()
    
    def to_dict(self) -> Dict[str, Any]:
        """
        Convert the assignment to a dictionary representation.
        
        Returns:
            Dict: A dictionary representation of the assignment
        """
        return {
            "id": self.id,
            "task_id": self.task_id,
            "agent_id": self.agent_id,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "started_at": self.started_at.isoformat() if self.started_at else None,
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
            "notes": self.notes,
            "metadata": self.metadata
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Assignment':
        """
        Create an assignment from a dictionary representation.
        
        Args:
            data: Dictionary containing assignment data
            
        Returns:
            Assignment: A new assignment instance
        """
        assignment = cls(
            task_id=data["task_id"],
            agent_id=data["agent_id"]
        )
        
        assignment.id = data.get("id", assignment.id)
        assignment.status = data.get("status", "Assigned")
        
        if data.get("created_at"):
            assignment.created_at = datetime.fromisoformat(data["created_at"])
        
        if data.get("updated_at"):
            assignment.updated_at = datetime.fromisoformat(data["updated_at"])
        
        if data.get("started_at"):
            assignment.started_at = datetime.fromisoformat(data["started_at"])
        
        if data.get("completed_at"):
            assignment.completed_at = datetime.fromisoformat(data["completed_at"])
        
        assignment.notes = data.get("notes", "")
        assignment.metadata = data.get("metadata", {})
        
        return assignment
    
    def __str__(self) -> str:
        """
        String representation of the assignment.
        
        Returns:
            str: A string representation of the assignment
        """
        return f"Assignment(task={self.task_id}, agent={self.agent_id}, status={self.status})"
    
    def __repr__(self) -> str:
        """
        Detailed string representation of the assignment.
        
        Returns:
            str: A detailed string representation of the assignment
        """
        return f"Assignment(id={self.id}, task={self.task_id}, agent={self.agent_id}, status={self.status})"
