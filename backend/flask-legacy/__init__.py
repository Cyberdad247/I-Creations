"""
__init__.py for the Flask legacy application package.
Initializes Flask application and imports all modules.
"""

from flask import Flask
from .config import Config

app = Flask(__name__)
app.config.from_object(Config)

# Import all modules after app creation to avoid circular imports
from . import routes
from . import models
from . import services

# Expose main application components
from .base_agent import BaseAgent
from .persona import Persona
from .skill import Skill
from .role_template import RoleTemplate

__all__ = ['app', 'BaseAgent', 'Persona', 'Skill', 'RoleTemplate']
