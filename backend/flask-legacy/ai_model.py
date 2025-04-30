"""
AI Model module for the Creation AI Ecosystem.
Defines the interface for AI models.
"""

from typing import Dict, List, Optional, Any
import uuid
from datetime import datetime
import requests


class AIModel:
    """
    Class for AI model integration in the Creation AI Ecosystem.
    Provides a standardized interface for interacting with various AI models.
    """
    
    def __init__(self, model_name: str, api_endpoint: str):
        """
        Initialize a new AI model with basic properties.
        
        Args:
            model_name: The name of the AI model
            api_endpoint: The API endpoint for the model
        """
        self.id = str(uuid.uuid4())
        self.model_name = model_name
        self.api_endpoint = api_endpoint
        self.version = "1.0"
        self.created_at = datetime.now()
        self.updated_at = datetime.now()
        self.metadata = {}
        self.capabilities = []
        self.parameters = {}
        self.status = "inactive"
    
    def invoke(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Invoke the AI model with the provided data.
        
        Args:
            data: The input data for the model
            
        Returns:
            Dict: The model's response
        """
        # This is a simplified implementation
        # In a real system, this would make an actual API call to the model
        
        try:
            # Simulate API call
            print(f"Invoking model {self.model_name} at {self.api_endpoint} with data: {data}")
            
            # In a real implementation, this would be:
            # response = requests.post(self.api_endpoint, json=data, headers=headers)
            # return response.json()
            
            # For demonstration, return a mock response
            return {
                "model": self.model_name,
                "result": f"Result from {self.model_name} for input: {data.get('input', '')}",
                "timestamp": datetime.now().isoformat()
            }
        except Exception as e:
            return {
                "error": str(e),
                "model": self.model_name,
                "timestamp": datetime.now().isoformat()
            }
    
    def update_version(self, version: str) -> None:
        """
        Update the model version.
        
        Args:
            version: The new version
        """
        self.version = version
        self.updated_at = datetime.now()
    
    def add_capability(self, capability: str) -> None:
        """
        Add a capability to the model.
        
        Args:
            capability: The capability to add
        """
        if capability not in self.capabilities:
            self.capabilities.append(capability)
            self.updated_at = datetime.now()
    
    def remove_capability(self, capability: str) -> bool:
        """
        Remove a capability from the model.
        
        Args:
            capability: The capability to remove
            
        Returns:
            bool: True if the capability was removed, False if it wasn't found
        """
        if capability in self.capabilities:
            self.capabilities.remove(capability)
            self.updated_at = datetime.now()
            return True
        return False
    
    def set_parameter(self, key: str, value: Any) -> None:
        """
        Set a parameter for the model.
        
        Args:
            key: The parameter key
            value: The parameter value
        """
        self.parameters[key] = value
        self.updated_at = datetime.now()
    
    def get_parameter(self, key: str, default: Any = None) -> Any:
        """
        Get a parameter value.
        
        Args:
            key: The parameter key
            default: The default value to return if the key is not found
            
        Returns:
            Any: The parameter value or the default value
        """
        return self.parameters.get(key, default)
    
    def activate(self) -> None:
        """
        Activate the model.
        """
        self.status = "active"
        self.updated_at = datetime.now()
    
    def deactivate(self) -> None:
        """
        Deactivate the model.
        """
        self.status = "inactive"
        self.updated_at = datetime.now()
    
    def add_metadata(self, key: str, value: Any) -> None:
        """
        Add metadata to the model.
        
        Args:
            key: The metadata key
            value: The metadata value
        """
        self.metadata[key] = value
        self.updated_at = datetime.now()
    
    def to_dict(self) -> Dict[str, Any]:
        """
        Convert the AI model to a dictionary representation.
        
        Returns:
            Dict: A dictionary representation of the AI model
        """
        return {
            "id": self.id,
            "model_name": self.model_name,
            "api_endpoint": self.api_endpoint,
            "version": self.version,
            "capabilities": self.capabilities,
            "parameters": self.parameters,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "metadata": self.metadata
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'AIModel':
        """
        Create an AI model from a dictionary representation.
        
        Args:
            data: Dictionary containing AI model data
            
        Returns:
            AIModel: A new AI model instance
        """
        model = cls(
            model_name=data["model_name"],
            api_endpoint=data["api_endpoint"]
        )
        
        model.id = data.get("id", model.id)
        model.version = data.get("version", "1.0")
        model.capabilities = data.get("capabilities", [])
        model.parameters = data.get("parameters", {})
        model.status = data.get("status", "inactive")
        
        if data.get("created_at"):
            model.created_at = datetime.fromisoformat(data["created_at"])
        
        if data.get("updated_at"):
            model.updated_at = datetime.fromisoformat(data["updated_at"])
        
        model.metadata = data.get("metadata", {})
        
        return model
    
    def __str__(self) -> str:
        """
        String representation of the AI model.
        
        Returns:
            str: A string representation of the AI model
        """
        return f"AIModel(name={self.model_name}, version={self.version}, status={self.status})"
    
    def __repr__(self) -> str:
        """
        Detailed string representation of the AI model.
        
        Returns:
            str: A detailed string representation of the AI model
        """
        return f"AIModel(id={self.id}, name={self.model_name}, version={self.version}, capabilities={len(self.capabilities)})"
