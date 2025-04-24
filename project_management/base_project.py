"""
BaseProject class for the Creation AI Ecosystem.
Defines the core project structure and management functionality.
"""
from typing import Dict, Any, List, Optional
import uuid
from datetime import datetime

class BaseProject:
    def __init__(self, name: str, description: str, goal: str):
        self.id = str(uuid.uuid4())
        self.name = name
        self.description = description
        self.goal = goal
        self.status = "Not Started"
        self.tasks: List[Any] = []
        self.agents: List[Any] = []
        self.dependencies: Dict[str, str] = {}  # task_id -> agent_id
        self.metadata: Dict[str, Any] = {}
        self.created_at = datetime.now()
        self.updated_at = datetime.now()

    def add_task(self, task: Any) -> None:
        self.tasks.append(task)
        self.updated_at = datetime.now()

    def remove_task(self, task_id: str) -> bool:
        for t in self.tasks:
            if getattr(t, 'id', None) == task_id:
                self.tasks.remove(t)
                self.updated_at = datetime.now()
                return True
        return False

    def add_agent(self, agent: Any) -> None:
        self.agents.append(agent)
        self.updated_at = datetime.now()

    def remove_agent(self, agent_id: str) -> bool:
        for a in self.agents:
            if getattr(a, 'id', None) == agent_id:
                self.agents.remove(a)
                self.updated_at = datetime.now()
                return True
        return False

    def assign_agent(self, task_id: str, agent_id: str) -> bool:
        self.dependencies[task_id] = agent_id
        self.updated_at = datetime.now()
        return True

    def unassign_agent(self, task_id: str) -> bool:
        if task_id in self.dependencies:
            del self.dependencies[task_id]
            self.updated_at = datetime.now()
            return True
        return False

    def update_status(self, status: str) -> None:
        self.status = status
        self.updated_at = datetime.now()

    def add_metadata(self, key: str, value: Any) -> None:
        self.metadata[key] = value
        self.updated_at = datetime.now()

    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'goal': self.goal,
            'status': self.status,
            'tasks': [t.to_dict() for t in self.tasks],
            'agents': [a.get_info() for a in self.agents],
            'dependencies': self.dependencies,
            'metadata': self.metadata,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any], tasks: List[Any] = None, agents: List[Any] = None) -> 'BaseProject':
        obj = cls(data['name'], data['description'], data['goal'])
        obj.status = data.get('status', 'Not Started')
        obj.tasks = tasks or []
        obj.agents = agents or []
        obj.dependencies = data.get('dependencies', {})
        obj.metadata = data.get('metadata', {})
        obj.created_at = datetime.fromisoformat(data['created_at']) if data.get('created_at') else datetime.now()
        obj.updated_at = datetime.fromisoformat(data['updated_at']) if data.get('updated_at') else datetime.now()
        return obj

    def __str__(self) -> str:
        return f"BaseProject(name={self.name}, status={self.status})"

    def __repr__(self) -> str:
        return f"BaseProject(id={self.id}, name={self.name}, status={self.status})"
