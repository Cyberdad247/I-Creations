"""
Persona module for the Creation AI Ecosystem.
Defines the personality traits and characteristics of agents.
"""

from typing import Dict, Any, List, Optional
import uuid
from datetime import datetime


class Persona:
    """
    Class for defining agent personas in the Creation AI Ecosystem.
    Represents personality traits, communication styles, and behavioral patterns.
    """
    
    def __init__(self, personality_traits: Dict[str, float]):
        """
        Initialize a new persona with personality traits.
        
        Args:
            personality_traits: Dictionary of personality traits and their values (0.0 to 1.0)
                                e.g., {"Openness": 0.8, "Conscientiousness": 0.9}
        """
        self.id = str(uuid.uuid4())
        self.personality_traits = personality_traits
        self.communication_style = {}
        self.behavioral_patterns = {}
        self.cultural_context = {}
        self.created_at = datetime.now()
        self.updated_at = datetime.now()
        self.name = "Default Persona"
        self.description = "Default persona with basic personality traits"
    
    def set_name(self, name: str) -> None:
        """
        Set the name of the persona.
        
        Args:
            name: The name to assign to the persona
        """
        self.name = name
        self.updated_at = datetime.now()
    
    def set_description(self, description: str) -> None:
        """
        Set the description of the persona.
        
        Args:
            description: The description to assign to the persona
        """
        self.description = description
        self.updated_at = datetime.now()
    
    def set_communication_style(self, style_name: str, value: float) -> None:
        """
        Set a communication style attribute.
        
        Args:
            style_name: The name of the communication style attribute
            value: The value of the attribute (0.0 to 1.0)
        """
        self.communication_style[style_name] = max(0.0, min(1.0, value))
        self.updated_at = datetime.now()
    
    def set_behavioral_pattern(self, pattern_name: str, value: float) -> None:
        """
        Set a behavioral pattern attribute.
        
        Args:
            pattern_name: The name of the behavioral pattern
            value: The value of the pattern (0.0 to 1.0)
        """
        self.behavioral_patterns[pattern_name] = max(0.0, min(1.0, value))
        self.updated_at = datetime.now()
    
    def set_cultural_context(self, context_name: str, value: Any) -> None:
        """
        Set a cultural context attribute.
        
        Args:
            context_name: The name of the cultural context attribute
            value: The value of the attribute
        """
        self.cultural_context[context_name] = value
        self.updated_at = datetime.now()
    
    def update_personality_trait(self, trait_name: str, value: float) -> None:
        """
        Update a personality trait value.
        
        Args:
            trait_name: The name of the personality trait
            value: The new value of the trait (0.0 to 1.0)
        """
        self.personality_traits[trait_name] = max(0.0, min(1.0, value))
        self.updated_at = datetime.now()
    
    def get_personality_profile(self) -> Dict[str, Any]:
        """
        Get a complete personality profile.
        
        Returns:
            Dict: A dictionary containing all personality attributes
        """
        return {
            "personality_traits": self.personality_traits,
            "communication_style": self.communication_style,
            "behavioral_patterns": self.behavioral_patterns,
            "cultural_context": self.cultural_context
        }
    
    def to_dict(self) -> Dict[str, Any]:
        """
        Convert the persona to a dictionary representation.
        
        Returns:
            Dict: A dictionary representation of the persona
        """
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "personality_traits": self.personality_traits,
            "communication_style": self.communication_style,
            "behavioral_patterns": self.behavioral_patterns,
            "cultural_context": self.cultural_context,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Persona':
        """
        Create a persona from a dictionary representation.
        
        Args:
            data: Dictionary containing persona data
            
        Returns:
            Persona: A new persona instance
        """
        persona = cls(personality_traits=data.get("personality_traits", {}))
        persona.id = data.get("id", persona.id)
        persona.name = data.get("name", "Default Persona")
        persona.description = data.get("description", "Default persona with basic personality traits")
        persona.communication_style = data.get("communication_style", {})
        persona.behavioral_patterns = data.get("behavioral_patterns", {})
        persona.cultural_context = data.get("cultural_context", {})
        
        if data.get("created_at"):
            persona.created_at = datetime.fromisoformat(data["created_at"])
        
        if data.get("updated_at"):
            persona.updated_at = datetime.fromisoformat(data["updated_at"])
        
        return persona
    
    def __str__(self) -> str:
        """
        String representation of the persona.
        
        Returns:
            str: A string representation of the persona
        """
        return f"Persona(name={self.name}, traits={len(self.personality_traits)})"
    
    def __repr__(self) -> str:
        """
        Detailed string representation of the persona.
        
        Returns:
            str: A detailed string representation of the persona
        """
        return f"Persona(id={self.id}, name={self.name}, traits={self.personality_traits})"
