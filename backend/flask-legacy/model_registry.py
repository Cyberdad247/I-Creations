"""
Model Registry module for the Creation AI Ecosystem.
Manages the registration and selection of AI models.
"""

from typing import Dict, List, Optional, Any
import uuid
from datetime import datetime


class ModelRegistry:
    """
    Class for managing AI models in the Creation AI Ecosystem.
    Provides functionality for registering, retrieving, and selecting models.
    """
    
    def __init__(self):
        """
        Initialize a new model registry with basic properties.
        """
        self.id = str(uuid.uuid4())
        self.models = {}  # model_name -> model_object
        self.created_at = datetime.now()
        self.updated_at = datetime.now()
        self.metadata = {}
        self.default_model = None
    
    def register_model(self, model: Any) -> None:
        """
        Register a model in the registry.
        
        Args:
            model: The model object to register
        """
        self.models[model.model_name] = model
        self.updated_at = datetime.now()
        
        # If this is the first model, set it as default
        if self.default_model is None:
            self.default_model = model.model_name
    
    def unregister_model(self, model_name: str) -> bool:
        """
        Unregister a model from the registry.
        
        Args:
            model_name: The name of the model to unregister
            
        Returns:
            bool: True if the model was unregistered, False if it wasn't found
        """
        if model_name in self.models:
            del self.models[model_name]
            
            # If the default model was removed, set a new default if possible
            if self.default_model == model_name:
                self.default_model = next(iter(self.models.keys())) if self.models else None
            
            self.updated_at = datetime.now()
            return True
        return False
    
    def get_model(self, model_name: str) -> Optional[Any]:
        """
        Get a model by name.
        
        Args:
            model_name: The name of the model to retrieve
            
        Returns:
            Optional[Any]: The model object, or None if not found
        """
        return self.models.get(model_name)
    
    def get_default_model(self) -> Optional[Any]:
        """
        Get the default model.
        
        Returns:
            Optional[Any]: The default model object, or None if no models are registered
        """
        if self.default_model:
            return self.models.get(self.default_model)
        return None
    
    def set_default_model(self, model_name: str) -> bool:
        """
        Set the default model.
        
        Args:
            model_name: The name of the model to set as default
            
        Returns:
            bool: True if the default was set, False if the model wasn't found
        """
        if model_name in self.models:
            self.default_model = model_name
            self.updated_at = datetime.now()
            return True
        return False
    
    def list_models(self) -> List[str]:
        """
        Get a list of all registered model names.
        
        Returns:
            List[str]: A list of model names
        """
        return list(self.models.keys())
    
    def get_models_by_capability(self, capability: str) -> List[Any]:
        """
        Get models that have a specific capability.
        
        Args:
            capability: The capability to filter by
            
        Returns:
            List[Any]: A list of model objects with the specified capability
        """
        return [model for model in self.models.values() if capability in model.capabilities]
    
    def select_model_for_task(self, task_requirements: Dict[str, Any]) -> Optional[Any]:
        """
        Select the most appropriate model for a task based on requirements.
        
        Args:
            task_requirements: Dictionary of task requirements
            
        Returns:
            Optional[Any]: The selected model, or None if no suitable model is found
        """
        # This is a simplified implementation
        # In a real system, this would use more sophisticated matching algorithms
        
        required_capabilities = task_requirements.get("capabilities", [])
        
        # Find models that have all required capabilities
        suitable_models = []
        for model in self.models.values():
            if all(cap in model.capabilities for cap in required_capabilities):
                suitable_models.append(model)
        
        if not suitable_models:
            return self.get_default_model()
        
        # For demonstration, just return the first suitable model
        return suitable_models[0]
    
    def add_metadata(self, key: str, value: Any) -> None:
        """
        Add metadata to the model registry.
        
        Args:
            key: The metadata key
            value: The metadata value
        """
        self.metadata[key] = value
        self.updated_at = datetime.now()
    
    def to_dict(self) -> Dict[str, Any]:
        """
        Convert the model registry to a dictionary representation.
        
        Returns:
            Dict: A dictionary representation of the model registry
        """
        return {
            "id": self.id,
            "models": [model.to_dict() for model in self.models.values()],
            "default_model": self.default_model,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "metadata": self.metadata
        }
    
    def __str__(self) -> str:
        """
        String representation of the model registry.
        
        Returns:
            str: A string representation of the model registry
        """
        return f"ModelRegistry(models={len(self.models)}, default={self.default_model})"
    
    def __repr__(self) -> str:
        """
        Detailed string representation of the model registry.
        
        Returns:
            str: A detailed string representation of the model registry
        """
        return f"ModelRegistry(id={self.id}, models={len(self.models)}, default={self.default_model})"
