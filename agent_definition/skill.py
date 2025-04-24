"""
Skill class for the Creation AI Ecosystem.
Represents agent capabilities, proficiency, and techniques.
"""
from typing import Dict, Any, List, Optional

class Skill:
    def __init__(self, skill_name: str, proficiency_level: str, description: str = ""):
        self.skill_name = skill_name
        self.proficiency_level = proficiency_level
        self.description = description
        self.sub_skills: List['Skill'] = []
        self.techniques: List[str] = []
        self.metadata: Dict[str, Any] = {}

    def add_sub_skill(self, sub_skill: 'Skill') -> None:
        self.sub_skills.append(sub_skill)

    def remove_sub_skill(self, sub_skill_name: str) -> bool:
        for s in self.sub_skills:
            if s.skill_name == sub_skill_name:
                self.sub_skills.remove(s)
                return True
        return False

    def add_technique(self, technique: str) -> None:
        self.techniques.append(technique)

    def remove_technique(self, technique: str) -> bool:
        if technique in self.techniques:
            self.techniques.remove(technique)
            return True
        return False

    def add_metadata(self, key: str, value: Any) -> None:
        self.metadata[key] = value

    def to_dict(self) -> Dict[str, Any]:
        return {
            'skill_name': self.skill_name,
            'proficiency_level': self.proficiency_level,
            'description': self.description,
            'sub_skills': [s.to_dict() for s in self.sub_skills],
            'techniques': self.techniques,
            'metadata': self.metadata
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Skill':
        skill = cls(data['skill_name'], data['proficiency_level'], data.get('description', ""))
        skill.sub_skills = [cls.from_dict(s) for s in data.get('sub_skills', [])]
        skill.techniques = data.get('techniques', [])
        skill.metadata = data.get('metadata', {})
        return skill

    def __str__(self) -> str:
        return f"Skill({self.skill_name}, {self.proficiency_level})"
