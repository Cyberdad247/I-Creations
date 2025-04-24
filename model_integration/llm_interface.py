"""
LLMInterface class for the Creation AI Ecosystem.
Defines a standard interface for integrating with language models.
"""
from typing import Any, Dict

class LLMInterface:
    def __init__(self, model_name: str, provider: str):
        self.model_name = model_name
        self.provider = provider

    def generate(self, prompt: str, **kwargs) -> str:
        """Generate a response from the language model."""
        raise NotImplementedError

    def get_model_info(self) -> Dict[str, Any]:
        return {
            'model_name': self.model_name,
            'provider': self.provider,
        }
