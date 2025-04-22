"""
__init__.py for the agent_definition package.
Imports and exposes the main classes.
"""

from .base_agent import BaseAgent
from .persona import Persona
from .skill import Skill
from .role_template import RoleTemplate

__all__ = ['BaseAgent', 'Persona', 'Skill', 'RoleTemplate']
