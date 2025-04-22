"""
Skill module for the Creation AI Ecosystem.
Defines the skills and capabilities of agents.
"""

from typing import Dict, Any, List, Optional
import uuid
from datetime import datetime


class Skill:
    """
    Class for defining agent skills in the Creation AI Ecosystem.
    Represents capabilities, proficiency levels, and techniques.
    """
    
    def __init__(self, skill_name: str, proficiency_level: str, description: str):
        """
        Initialize a new skill with basic properties.
        
        Args:
            skill_name: The name of the skill
            proficiency_level: The proficiency level (e.g., "Beginner", "Intermediate", "Advanced", "Expert")
            description: A description of the skill
        """
        self.id = str(uuid.uuid4())
        self.skill_name = skill_name
        self.proficiency_level = proficiency_level
        self.description = description
        self.sub_skills = {}
        self.techniques = []
        self.created_at = datetime.now()
        self.updated_at = datetime.now()
        self.metadata = {}
        
        # Numerical representation of proficiency level (0.0 to 1.0)
        self.proficiency_value = self._convert_proficiency_to_value(proficiency_level)
    
    def _convert_proficiency_to_value(self, level: str) -> float:
        """
        Convert a string proficiency level to a numerical value.
        
        Args:
            level: The proficiency level as a string
            
        Returns:
            float: A numerical value between 0.0 and 1.0
        """
        proficiency_map = {
            "novice": 0.2,
            "beginner": 0.4,
            "intermediate": 0.6,
            "advanced": 0.8,
            "expert": 1.0
        }
        
        return proficiency_map.get(level.lower(), 0.5)
    
    def add_sub_skill(self, sub_skill: 'Skill') -> None:
        """
        Add a sub-skill to this skill.
        
        Args:
            sub_skill: The sub-skill to add
        """
        self.sub_skills[sub_skill.skill_name] = sub_skill
        self.updated_at = datetime.now()
    
    def remove_sub_skill(self, sub_skill_name: str) -> bool:
        """
        Remove a sub-skill from this skill.
        
        Args:
            sub_skill_name: The name of the sub-skill to remove
            
        Returns:
            bool: True if the sub-skill was removed, False if it wasn't found
        """
        if sub_skill_name in self.sub_skills:
            del self.sub_skills[sub_skill_name]
            self.updated_at = datetime.now()
            return True
        return False
    
    def add_technique(self, technique: str) -> None:
        """
        Add a technique to this skill.
        
        Args:
            technique: The technique to add
        """
        if technique not in self.techniques:
            self.techniques.append(technique)
            self.updated_at = datetime.now()
    
    def remove_technique(self, technique: str) -> bool:
        """
        Remove a technique from this skill.
        
        Args:
            technique: The technique to remove
            
        Returns:
            bool: True if the technique was removed, False if it wasn't found
        """
        if technique in self.techniques:
            self.techniques.remove(technique)
            self.updated_at = datetime.now()
            return True
        return False
    
    def update_proficiency(self, level: str) -> None:
        """
        Update the proficiency level of this skill.
        
        Args:
            level: The new proficiency level
        """
        self.proficiency_level = level
        self.proficiency_value = self._convert_proficiency_to_value(level)
        self.updated_at = datetime.now()
    
    def add_metadata(self, key: str, value: Any) -> None:
        """
        Add metadata to the skill.
        
        Args:
            key: The metadata key
            value: The metadata value
        """
        self.metadata[key] = value
        self.updated_at = datetime.now()
    
    def to_dict(self) -> Dict[str, Any]:
        """
        Convert the skill to a dictionary representation.
        
        Returns:
            Dict: A dictionary representation of the skill
        """
        sub_skills_dict = {name: skill.to_dict() for name, skill in self.sub_skills.items()}
        
        return {
            "id": self.id,
            "skill_name": self.skill_name,
            "proficiency_level": self.proficiency_level,
            "proficiency_value": self.proficiency_value,
            "description": self.description,
            "sub_skills": sub_skills_dict,
            "techniques": self.techniques,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "metadata": self.metadata
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Skill':
        """
        Create a skill from a dictionary representation.
        
        Args:
            data: Dictionary containing skill data
            
        Returns:
            Skill: A new skill instance
        """
        skill = cls(
            skill_name=data["skill_name"],
            proficiency_level=data["proficiency_level"],
            description=data["description"]
        )
        
        skill.id = data.get("id", skill.id)
        skill.techniques = data.get("techniques", [])
        
        if data.get("sub_skills"):
            for sub_skill_name, sub_skill_data in data["sub_skills"].items():
                skill.sub_skills[sub_skill_name] = cls.from_dict(sub_skill_data)
        
        if data.get("created_at"):
            skill.created_at = datetime.fromisoformat(data["created_at"])
        
        if data.get("updated_at"):
            skill.updated_at = datetime.fromisoformat(data["updated_at"])
        
        skill.metadata = data.get("metadata", {})
        
        return skill
    
    def __str__(self) -> str:
        """
        String representation of the skill.
        
        Returns:
            str: A string representation of the skill
        """
        return f"Skill(name={self.skill_name}, level={self.proficiency_level})"
    
    def __repr__(self) -> str:
        """
        Detailed string representation of the skill.
        
        Returns:
            str: A detailed string representation of the skill
        """
        return f"Skill(id={self.id}, name={self.skill_name}, level={self.proficiency_level}, sub_skills={len(self.sub_skills)})"
