"""
Persona class for the Creation AI Ecosystem.
Defines agent personality, traits, and communication style.
"""
from typing import Dict, Any

class Persona:
    def __init__(self, name: str, traits: Dict[str, Any], communication_style: str = "neutral"):
        self.name = name
        self.traits = traits
        self.communication_style = communication_style

    def get_info(self) -> Dict[str, Any]:
        return {
            'name': self.name,
            'traits': self.traits,
            'communication_style': self.communication_style,
        }
