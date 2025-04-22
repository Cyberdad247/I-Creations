"""
Configuration file for the Creation AI Ecosystem.
Contains global settings and environment variables.
"""

import os
from dotenv import load_dotenv

# Load environment variables from .env file if it exists
load_dotenv()

# General configuration
DEBUG = os.getenv("DEBUG", "True").lower() == "true"
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")

# API configuration
API_HOST = os.getenv("API_HOST", "0.0.0.0")
API_PORT = int(os.getenv("API_PORT", "5000"))
API_VERSION = "v1"
API_PREFIX = f"/api/{API_VERSION}"

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///creation_ai.db")

# AI Model configuration
DEFAULT_MODEL = os.getenv("DEFAULT_MODEL", "gpt-3.5-turbo")
MODEL_API_KEYS = {
    "openai": os.getenv("OPENAI_API_KEY", ""),
    "anthropic": os.getenv("ANTHROPIC_API_KEY", ""),
    "cohere": os.getenv("COHERE_API_KEY", ""),
}

# Security configuration
SECRET_KEY = os.getenv("SECRET_KEY", "development-secret-key")
TOKEN_EXPIRATION = int(os.getenv("TOKEN_EXPIRATION", "86400"))  # 24 hours in seconds

# Feature flags
ENABLE_MANUS_AI = os.getenv("ENABLE_MANUS_AI", "True").lower() == "true"
ENABLE_MONICA_AI = os.getenv("ENABLE_MONICA_AI", "True").lower() == "true"

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
LOGS_DIR = os.path.join(BASE_DIR, "logs")

# Ensure directories exist
os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(LOGS_DIR, exist_ok=True)
