"""
Base Agent module for the Creation AI Ecosystem.
Defines the core agent structure and functionality.
"""

from typing import Dict, List, Optional, Any
import uuid
from datetime import datetime


class BaseAgent:
    """
    Base class for all agents in the Creation AI Ecosystem.
    Provides core functionality for agent definition and management.
    """
    
    def __init__(self, name: str, description: str):
        """
        Initialize a new agent with basic properties.
        
        Args:
            name: The name of the agent
            description: A description of the agent's purpose and capabilities
        """
        self.id = str(uuid.uuid4())
        self.name = name
        self.description = description
        self.persona = None
        self.skills = {}
        self.role = None
        self.version = 1.0
        self.created_at = datetime.now()
        self.updated_at = datetime.now()
        self.metadata = {}
        self.status = "inactive"
    
    def update_version(self) -> None:
        """
        Increment the agent version number and update the timestamp.
        """
        self.version += 0.1
        self.updated_at = datetime.now()
    
    def add_skill(self, skill: Any) -> None:
        """
        Add a skill to the agent's skill set.
        
        Args:
            skill: The skill object to add
        """
        self.skills[skill.skill_name] = skill
        self.updated_at = datetime.now()
    
    def remove_skill(self, skill_name: str) -> bool:
        """
        Remove a skill from the agent's skill set.
        
        Args:
            skill_name: The name of the skill to remove
            
        Returns:
            bool: True if the skill was removed, False if it wasn't found
        """
        if skill_name in self.skills:
            del self.skills[skill_name]
            self.updated_at = datetime.now()
            return True
        return False
    
    def set_persona(self, persona: Any) -> None:
        """
        Set the agent's persona.
        
        Args:
            persona: The persona object to assign to the agent
        """
        self.persona = persona
        self.updated_at = datetime.now()
    
    def set_role(self, role: Any) -> None:
        """
        Set the agent's role.
        
        Args:
            role: The role object to assign to the agent
        """
        self.role = role
        self.updated_at = datetime.now()
    
    def activate(self) -> None:
        """
        Activate the agent, making it available for task assignment.
        """
        self.status = "active"
        self.updated_at = datetime.now()
    
    def deactivate(self) -> None:
        """
        Deactivate the agent, making it unavailable for task assignment.
        """
        self.status = "inactive"
        self.updated_at = datetime.now()
    
    def add_metadata(self, key: str, value: Any) -> None:
        """
        Add metadata to the agent.
        
        Args:
            key: The metadata key
            value: The metadata value
        """
        self.metadata[key] = value
        self.updated_at = datetime.now()
    
    def to_dict(self) -> Dict[str, Any]:
        """
        Convert the agent to a dictionary representation.
        
        Returns:
            Dict: A dictionary representation of the agent
        """
        skills_dict = {name: skill.to_dict() for name, skill in self.skills.items()}
        
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "persona": self.persona.to_dict() if self.persona else None,
            "skills": skills_dict,
            "role": self.role.to_dict() if self.role else None,
            "version": self.version,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "metadata": self.metadata,
            "status": self.status
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'BaseAgent':
        """
        Create an agent from a dictionary representation.
        
        Args:
            data: Dictionary containing agent data
            
        Returns:
            BaseAgent: A new agent instance
        """
        from .persona import Persona
        from .skill import Skill
        from .role_template import RoleTemplate
        
        agent = cls(name=data["name"], description=data["description"])
        agent.id = data.get("id", agent.id)
        agent.version = data.get("version", agent.version)
        
        if data.get("persona"):
            agent.persona = Persona.from_dict(data["persona"])
        
        if data.get("skills"):
            for skill_name, skill_data in data["skills"].items():
                agent.skills[skill_name] = Skill.from_dict(skill_data)
        
        if data.get("role"):
            agent.role = RoleTemplate.from_dict(data["role"])
        
        if data.get("created_at"):
            agent.created_at = datetime.fromisoformat(data["created_at"])
        
        if data.get("updated_at"):
            agent.updated_at = datetime.fromisoformat(data["updated_at"])
        
        agent.metadata = data.get("metadata", {})
        agent.status = data.get("status", "inactive")
        
        return agent
    
    def __str__(self) -> str:
        """
        String representation of the agent.
        
        Returns:
            str: A string representation of the agent
        """
        return f"Agent(name={self.name}, version={self.version}, status={self.status})"
    
    def __repr__(self) -> str:
        """
        Detailed string representation of the agent.
        
        Returns:
            str: A detailed string representation of the agent
        """
        return f"Agent(id={self.id}, name={self.name}, version={self.version}, skills={len(self.skills)}, status={self.status})"
