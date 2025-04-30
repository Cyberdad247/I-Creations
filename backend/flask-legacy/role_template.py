"""
Role Template module for the Creation AI Ecosystem.
Defines predefined roles for agents.
"""

from typing import Dict, Any, List, Optional, Set
import uuid
from datetime import datetime


class RoleTemplate:
    """
    Class for defining role templates in the Creation AI Ecosystem.
    Represents predefined roles with required skills and responsibilities.
    """
    
    def __init__(self, role_name: str, skills_required: List[str], description: str):
        """
        Initialize a new role template with basic properties.
        
        Args:
            role_name: The name of the role
            skills_required: List of required skill names
            description: A description of the role
        """
        self.id = str(uuid.uuid4())
        self.role_name = role_name
        self.skills_required = skills_required
        self.description = description
        self.responsibilities = []
        self.created_at = datetime.now()
        self.updated_at = datetime.now()
        self.metadata = {}
        self.category = "General"
    
    def add_responsibility(self, responsibility: str) -> None:
        """
        Add a responsibility to this role.
        
        Args:
            responsibility: The responsibility to add
        """
        if responsibility not in self.responsibilities:
            self.responsibilities.append(responsibility)
            self.updated_at = datetime.now()
    
    def remove_responsibility(self, responsibility: str) -> bool:
        """
        Remove a responsibility from this role.
        
        Args:
            responsibility: The responsibility to remove
            
        Returns:
            bool: True if the responsibility was removed, False if it wasn't found
        """
        if responsibility in self.responsibilities:
            self.responsibilities.remove(responsibility)
            self.updated_at = datetime.now()
            return True
        return False
    
    def add_required_skill(self, skill_name: str) -> None:
        """
        Add a required skill to this role.
        
        Args:
            skill_name: The name of the required skill
        """
        if skill_name not in self.skills_required:
            self.skills_required.append(skill_name)
            self.updated_at = datetime.now()
    
    def remove_required_skill(self, skill_name: str) -> bool:
        """
        Remove a required skill from this role.
        
        Args:
            skill_name: The name of the required skill to remove
            
        Returns:
            bool: True if the skill was removed, False if it wasn't found
        """
        if skill_name in self.skills_required:
            self.skills_required.remove(skill_name)
            self.updated_at = datetime.now()
            return True
        return False
    
    def set_category(self, category: str) -> None:
        """
        Set the category of this role.
        
        Args:
            category: The category to assign to the role
        """
        self.category = category
        self.updated_at = datetime.now()
    
    def add_metadata(self, key: str, value: Any) -> None:
        """
        Add metadata to the role.
        
        Args:
            key: The metadata key
            value: The metadata value
        """
        self.metadata[key] = value
        self.updated_at = datetime.now()
    
    def is_compatible_with_agent(self, agent_skills: Set[str]) -> bool:
        """
        Check if an agent with the given skills is compatible with this role.
        
        Args:
            agent_skills: Set of skill names possessed by the agent
            
        Returns:
            bool: True if the agent has all required skills, False otherwise
        """
        return all(skill in agent_skills for skill in self.skills_required)
    
    def to_dict(self) -> Dict[str, Any]:
        """
        Convert the role template to a dictionary representation.
        
        Returns:
            Dict: A dictionary representation of the role template
        """
        return {
            "id": self.id,
            "role_name": self.role_name,
            "skills_required": self.skills_required,
            "description": self.description,
            "responsibilities": self.responsibilities,
            "category": self.category,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "metadata": self.metadata
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'RoleTemplate':
        """
        Create a role template from a dictionary representation.
        
        Args:
            data: Dictionary containing role template data
            
        Returns:
            RoleTemplate: A new role template instance
        """
        role = cls(
            role_name=data["role_name"],
            skills_required=data["skills_required"],
            description=data["description"]
        )
        
        role.id = data.get("id", role.id)
        role.responsibilities = data.get("responsibilities", [])
        role.category = data.get("category", "General")
        
        if data.get("created_at"):
            role.created_at = datetime.fromisoformat(data["created_at"])
        
        if data.get("updated_at"):
            role.updated_at = datetime.fromisoformat(data["updated_at"])
        
        role.metadata = data.get("metadata", {})
        
        return role
    
    def __str__(self) -> str:
        """
        String representation of the role template.
        
        Returns:
            str: A string representation of the role template
        """
        return f"RoleTemplate(name={self.role_name}, category={self.category})"
    
    def __repr__(self) -> str:
        """
        Detailed string representation of the role template.
        
        Returns:
            str: A detailed string representation of the role template
        """
        return f"RoleTemplate(id={self.id}, name={self.role_name}, skills_required={self.skills_required})"
