"""
Task class for the Creation AI Ecosystem.
Represents work items that can be assigned to agents.
"""
from typing import Dict, Any, List, Optional
import uuid
from datetime import datetime

class Task:
    def __init__(self, task_name: str, description: str, status: str = "Open"):
        self.id = str(uuid.uuid4())
        self.task_name = task_name
        self.description = description
        self.status = status
        self.priority = "Normal"
        self.due_date: Optional[datetime] = None
        self.subtasks: List['Task'] = []
        self.dependencies: List[str] = []
        self.tags: List[str] = []
        self.metadata: Dict[str, Any] = {}
        self.created_at = datetime.now()
        self.updated_at = datetime.now()

    def update_status(self, status: str) -> None:
        self.status = status
        self.updated_at = datetime.now()

    def set_priority(self, priority: str) -> None:
        self.priority = priority
        self.updated_at = datetime.now()

    def set_due_date(self, due_date: datetime) -> None:
        self.due_date = due_date
        self.updated_at = datetime.now()

    def add_subtask(self, subtask: 'Task') -> None:
        self.subtasks.append(subtask)
        self.updated_at = datetime.now()

    def remove_subtask(self, subtask_id: str) -> bool:
        for s in self.subtasks:
            if s.id == subtask_id:
                self.subtasks.remove(s)
                self.updated_at = datetime.now()
                return True
        return False

    def add_dependency(self, task_id: str) -> None:
        if task_id not in self.dependencies:
            self.dependencies.append(task_id)
            self.updated_at = datetime.now()

    def remove_dependency(self, task_id: str) -> bool:
        if task_id in self.dependencies:
            self.dependencies.remove(task_id)
            self.updated_at = datetime.now()
            return True
        return False

    def add_tag(self, tag: str) -> None:
        if tag not in self.tags:
            self.tags.append(tag)
            self.updated_at = datetime.now()

    def remove_tag(self, tag: str) -> bool:
        if tag in self.tags:
            self.tags.remove(tag)
            self.updated_at = datetime.now()
            return True
        return False

    def add_metadata(self, key: str, value: Any) -> None:
        self.metadata[key] = value
        self.updated_at = datetime.now()

    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'task_name': self.task_name,
            'description': self.description,
            'status': self.status,
            'priority': self.priority,
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'subtasks': [s.to_dict() for s in self.subtasks],
            'dependencies': self.dependencies,
            'tags': self.tags,
            'metadata': self.metadata,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Task':
        obj = cls(data['task_name'], data['description'], data.get('status', 'Open'))
        obj.priority = data.get('priority', 'Normal')
        obj.due_date = datetime.fromisoformat(data['due_date']) if data.get('due_date') else None
        obj.subtasks = [cls.from_dict(s) for s in data.get('subtasks', [])]
        obj.dependencies = data.get('dependencies', [])
        obj.tags = data.get('tags', [])
        obj.metadata = data.get('metadata', {})
        return obj

    def __str__(self) -> str:
        return f"Task({self.task_name}, {self.status})"
