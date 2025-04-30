"""
Task module for the Creation AI Ecosystem.
Defines tasks that can be assigned to agents within projects.
"""

from typing import Dict, List, Optional, Any
import uuid
from datetime import datetime


class Task:
    """
    Class for defining tasks in the Creation AI Ecosystem.
    Represents work items that can be assigned to agents.
    """
    
    def __init__(self, task_name: str, description: str, status: str = "Open"):
        """
        Initialize a new task with basic properties.
        
        Args:
            task_name: The name of the task
            description: A description of the task
            status: The initial status of the task (default: "Open")
        """
        self.id = str(uuid.uuid4())
        self.task_name = task_name
        self.description = description
        self.status = status
        self.priority = "Medium"
        self.due_date = None
        self.created_at = datetime.now()
        self.updated_at = datetime.now()
        self.completed_at = None
        self.metadata = {}
        self.subtasks = []
        self.dependencies = []  # IDs of tasks that must be completed before this one
        self.tags = []
    
    def update_status(self, status: str) -> None:
        """
        Update the status of the task.
        
        Args:
            status: The new status of the task
        """
        old_status = self.status
        self.status = status
        self.updated_at = datetime.now()
        
        # If task is being marked as completed, record the completion time
        if status.lower() == "completed" and old_status.lower() != "completed":
            self.completed_at = datetime.now()
        # If task is being unmarked as completed, clear the completion time
        elif old_status.lower() == "completed" and status.lower() != "completed":
            self.completed_at = None
    
    def set_priority(self, priority: str) -> None:
        """
        Set the priority of the task.
        
        Args:
            priority: The priority level ("Low", "Medium", "High", "Critical")
        """
        valid_priorities = ["low", "medium", "high", "critical"]
        if priority.lower() in valid_priorities:
            self.priority = priority.capitalize()
            self.updated_at = datetime.now()
    
    def set_due_date(self, due_date: datetime) -> None:
        """
        Set the due date of the task.
        
        Args:
            due_date: The due date for the task
        """
        self.due_date = due_date
        self.updated_at = datetime.now()
    
    def add_subtask(self, subtask: 'Task') -> None:
        """
        Add a subtask to this task.
        
        Args:
            subtask: The subtask to add
        """
        self.subtasks.append(subtask)
        self.updated_at = datetime.now()
    
    def remove_subtask(self, subtask_id: str) -> bool:
        """
        Remove a subtask from this task.
        
        Args:
            subtask_id: The ID of the subtask to remove
            
        Returns:
            bool: True if the subtask was removed, False if it wasn't found
        """
        for i, subtask in enumerate(self.subtasks):
            if subtask.id == subtask_id:
                self.subtasks.pop(i)
                self.updated_at = datetime.now()
                return True
        return False
    
    def add_dependency(self, task_id: str) -> None:
        """
        Add a dependency to this task.
        
        Args:
            task_id: The ID of the task that must be completed before this one
        """
        if task_id not in self.dependencies:
            self.dependencies.append(task_id)
            self.updated_at = datetime.now()
    
    def remove_dependency(self, task_id: str) -> bool:
        """
        Remove a dependency from this task.
        
        Args:
            task_id: The ID of the dependency to remove
            
        Returns:
            bool: True if the dependency was removed, False if it wasn't found
        """
        if task_id in self.dependencies:
            self.dependencies.remove(task_id)
            self.updated_at = datetime.now()
            return True
        return False
    
    def add_tag(self, tag: str) -> None:
        """
        Add a tag to this task.
        
        Args:
            tag: The tag to add
        """
        if tag not in self.tags:
            self.tags.append(tag)
            self.updated_at = datetime.now()
    
    def remove_tag(self, tag: str) -> bool:
        """
        Remove a tag from this task.
        
        Args:
            tag: The tag to remove
            
        Returns:
            bool: True if the tag was removed, False if it wasn't found
        """
        if tag in self.tags:
            self.tags.remove(tag)
            self.updated_at = datetime.now()
            return True
        return False
    
    def add_metadata(self, key: str, value: Any) -> None:
        """
        Add metadata to the task.
        
        Args:
            key: The metadata key
            value: The metadata value
        """
        self.metadata[key] = value
        self.updated_at = datetime.now()
    
    def is_blocked(self, completed_task_ids: List[str]) -> bool:
        """
        Check if this task is blocked by dependencies.
        
        Args:
            completed_task_ids: List of IDs of completed tasks
            
        Returns:
            bool: True if the task is blocked, False otherwise
        """
        return any(dep_id not in completed_task_ids for dep_id in self.dependencies)
    
    def to_dict(self) -> Dict[str, Any]:
        """
        Convert the task to a dictionary representation.
        
        Returns:
            Dict: A dictionary representation of the task
        """
        return {
            "id": self.id,
            "task_name": self.task_name,
            "description": self.description,
            "status": self.status,
            "priority": self.priority,
            "due_date": self.due_date.isoformat() if self.due_date else None,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
            "subtasks": [subtask.to_dict() for subtask in self.subtasks],
            "dependencies": self.dependencies,
            "tags": self.tags,
            "metadata": self.metadata
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Task':
        """
        Create a task from a dictionary representation.
        
        Args:
            data: Dictionary containing task data
            
        Returns:
            Task: A new task instance
        """
        task = cls(
            task_name=data["task_name"],
            description=data["description"],
            status=data["status"]
        )
        
        task.id = data.get("id", task.id)
        task.priority = data.get("priority", "Medium")
        
        if data.get("due_date"):
            task.due_date = datetime.fromisoformat(data["due_date"])
        
        if data.get("created_at"):
            task.created_at = datetime.fromisoformat(data["created_at"])
        
        if data.get("updated_at"):
            task.updated_at = datetime.fromisoformat(data["updated_at"])
        
        if data.get("completed_at"):
            task.completed_at = datetime.fromisoformat(data["completed_at"])
        
        # Handle subtasks recursively
        if data.get("subtasks"):
            for subtask_data in data["subtasks"]:
                task.subtasks.append(cls.from_dict(subtask_data))
        
        task.dependencies = data.get("dependencies", [])
        task.tags = data.get("tags", [])
        task.metadata = data.get("metadata", {})
        
        return task
    
    def __str__(self) -> str:
        """
        String representation of the task.
        
        Returns:
            str: A string representation of the task
        """
        return f"Task(name={self.task_name}, status={self.status}, priority={self.priority})"
    
    def __repr__(self) -> str:
        """
        Detailed string representation of the task.
        
        Returns:
            str: A detailed string representation of the task
        """
        return f"Task(id={self.id}, name={self.task_name}, status={self.status}, subtasks={len(self.subtasks)})"
