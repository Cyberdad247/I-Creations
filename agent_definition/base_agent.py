"""
BaseAgent class for the Creation AI Ecosystem.
Defines the core agent structure and interface.
"""
from typing import Any, Dict, List, Optional
import uuid
from datetime import datetime

class BaseAgent:
    def __init__(self, name: str, persona: 'Persona', skills: Optional[List[str]] = None):
        self.id = str(uuid.uuid4())
        self.name = name
        self.persona = persona
        self.skills = skills or []
        self.created_at = datetime.now()
        self.status = 'offline'

    def act(self, input_data: Any) -> Any:
        """Perform the agent's main action. To be implemented by subclasses."""
        raise NotImplementedError

    def update_status(self, status: str):
        self.status = status

    def get_info(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'name': self.name,
            'persona': self.persona.get_info() if self.persona else None,
            'skills': self.skills,
            'status': self.status,
            'created_at': self.created_at.isoformat(),
        }
