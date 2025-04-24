"""
RoleTemplate class for the Creation AI Ecosystem.
Represents predefined roles with required skills and responsibilities.
"""
from typing import Dict, Any, List, Set
import uuid
from datetime import datetime

class RoleTemplate:
    def __init__(self, role_name: str, skills_required: List[str], description: str):
        self.id = str(uuid.uuid4())
        self.role_name = role_name
        self.skills_required = skills_required
        self.description = description
        self.responsibilities: List[str] = []
        self.created_at = datetime.now()
        self.updated_at = datetime.now()
        self.metadata: Dict[str, Any] = {}
        self.category = "General"

    def add_responsibility(self, responsibility: str) -> None:
        if responsibility not in self.responsibilities:
            self.responsibilities.append(responsibility)
            self.updated_at = datetime.now()

    def remove_responsibility(self, responsibility: str) -> bool:
        if responsibility in self.responsibilities:
            self.responsibilities.remove(responsibility)
            self.updated_at = datetime.now()
            return True
        return False

    def add_required_skill(self, skill_name: str) -> None:
        if skill_name not in self.skills_required:
            self.skills_required.append(skill_name)
            self.updated_at = datetime.now()

    def remove_required_skill(self, skill_name: str) -> bool:
        if skill_name in self.skills_required:
            self.skills_required.remove(skill_name)
            self.updated_at = datetime.now()
            return True
        return False

    def set_category(self, category: str) -> None:
        self.category = category
        self.updated_at = datetime.now()

    def add_metadata(self, key: str, value: Any) -> None:
        self.metadata[key] = value
        self.updated_at = datetime.now()

    def is_compatible_with_agent(self, agent_skills: Set[str]) -> bool:
        return set(self.skills_required).issubset(agent_skills)

    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'role_name': self.role_name,
            'skills_required': self.skills_required,
            'description': self.description,
            'responsibilities': self.responsibilities,
            'category': self.category,
            'metadata': self.metadata,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'RoleTemplate':
        obj = cls(data['role_name'], data['skills_required'], data['description'])
        obj.responsibilities = data.get('responsibilities', [])
        obj.category = data.get('category', 'General')
        obj.metadata = data.get('metadata', {})
        return obj

    def __str__(self) -> str:
        return f"RoleTemplate(name={self.role_name}, category={self.category})"

    def __repr__(self) -> str:
        return f"RoleTemplate(id={self.id}, name={self.role_name}, skills_required={self.skills_required})"
