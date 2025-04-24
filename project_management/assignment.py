"""
Assignment class for the Creation AI Ecosystem.
Manages assignments of agents to tasks.
"""
from typing import Dict, Any, Optional
import uuid
from datetime import datetime

class Assignment:
    def __init__(self, task_id: str, agent_id: str):
        self.id = str(uuid.uuid4())
        self.task_id = task_id
        self.agent_id = agent_id
        self.status = "Assigned"
        self.created_at = datetime.now()
        self.updated_at = datetime.now()
        self.started_at: Optional[datetime] = None
        self.completed_at: Optional[datetime] = None
        self.metadata: Dict[str, Any] = {}
        self.notes = ""

    def start(self) -> None:
        self.status = "In Progress"
        self.started_at = datetime.now()
        self.updated_at = datetime.now()

    def complete(self) -> None:
        self.status = "Completed"
        self.completed_at = datetime.now()
        self.updated_at = datetime.now()

    def pause(self) -> None:
        self.status = "Paused"
        self.updated_at = datetime.now()

    def cancel(self) -> None:
        self.status = "Cancelled"
        self.updated_at = datetime.now()

    def add_note(self, note: str) -> None:
        if self.notes:
            self.notes += f"\n{note}"
        else:
            self.notes = note
        self.updated_at = datetime.now()

    def add_metadata(self, key: str, value: Any) -> None:
        self.metadata[key] = value
        self.updated_at = datetime.now()

    def to_dict(self) -> Dict[str, Any]:
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
        obj = cls(data['task_id'], data['agent_id'])
        obj.status = data.get('status', 'Assigned')
        obj.created_at = datetime.fromisoformat(data['created_at']) if data.get('created_at') else datetime.now()
        obj.updated_at = datetime.fromisoformat(data['updated_at']) if data.get('updated_at') else datetime.now()
        obj.started_at = datetime.fromisoformat(data['started_at']) if data.get('started_at') else None
        obj.completed_at = datetime.fromisoformat(data['completed_at']) if data.get('completed_at') else None
        obj.notes = data.get('notes', '')
        obj.metadata = data.get('metadata', {})
        return obj

    def __str__(self) -> str:
        return f"Assignment(task={self.task_id}, agent={self.agent_id}, status={self.status})"

    def __repr__(self) -> str:
        return f"Assignment(id={self.id}, task={self.task_id}, agent={self.agent_id}, status={self.status})"
