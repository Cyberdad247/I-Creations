"""
Data Storage module for the Creation AI Ecosystem.
Manages persistent storage of ecosystem data.
"""

from typing import Dict, List, Optional, Any
import uuid
from datetime import datetime
import json
import os


class DataStorage:
    """
    Class for managing data storage in the Creation AI Ecosystem.
    Provides functionality for storing and retrieving various types of data.
    """
    
    def __init__(self, storage_dir: str = None):
        """
        Initialize a new data storage instance.
        
        Args:
            storage_dir: Directory for storing data files (optional)
        """
        self.id = str(uuid.uuid4())
        self.created_at = datetime.now()
        self.updated_at = datetime.now()
        self.agent_repository = {}
        self.project_repository = {}
        self.execution_history = []
        self.knowledge_graph = {}
        self.user_preferences = {}
        self.metadata = {}
        
        # Set storage directory
        if storage_dir:
            self.storage_dir = storage_dir
        else:
            self.storage_dir = os.path.join(os.getcwd(), "data")
        
        # Create storage directory if it doesn't exist
        os.makedirs(self.storage_dir, exist_ok=True)
    
    def store_agent(self, agent: Any) -> None:
        """
        Store an agent in the repository.
        
        Args:
            agent: The agent object to store
        """
        self.agent_repository[agent.id] = agent
        self.updated_at = datetime.now()
        
        # Persist to file
        self._save_to_file("agents", agent.id, agent.to_dict())
    
    def get_agent(self, agent_id: str) -> Optional[Any]:
        """
        Get an agent from the repository.
        
        Args:
            agent_id: The ID of the agent to retrieve
            
        Returns:
            Optional[Any]: The agent object, or None if not found
        """
        # Try to get from memory first
        if agent_id in self.agent_repository:
            return self.agent_repository[agent_id]
        
        # Try to load from file
        agent_data = self._load_from_file("agents", agent_id)
        if agent_data:
            from ..agent_definition import BaseAgent
            agent = BaseAgent.from_dict(agent_data)
            self.agent_repository[agent_id] = agent
            return agent
        
        return None
    
    def list_agents(self) -> List[str]:
        """
        Get a list of all agent IDs.
        
        Returns:
            List[str]: A list of agent IDs
        """
        # Get IDs from memory
        ids = list(self.agent_repository.keys())
        
        # Get IDs from files
        file_ids = self._list_files("agents")
        
        # Combine and remove duplicates
        return list(set(ids + file_ids))
    
    def delete_agent(self, agent_id: str) -> bool:
        """
        Delete an agent from the repository.
        
        Args:
            agent_id: The ID of the agent to delete
            
        Returns:
            bool: True if the agent was deleted, False if it wasn't found
        """
        if agent_id in self.agent_repository:
            del self.agent_repository[agent_id]
            self.updated_at = datetime.now()
            
            # Delete from file
            self._delete_file("agents", agent_id)
            return True
        
        # Try to delete from file even if not in memory
        return self._delete_file("agents", agent_id)
    
    def store_project(self, project: Any) -> None:
        """
        Store a project in the repository.
        
        Args:
            project: The project object to store
        """
        self.project_repository[project.id] = project
        self.updated_at = datetime.now()
        
        # Persist to file
        self._save_to_file("projects", project.id, project.to_dict())
    
    def get_project(self, project_id: str) -> Optional[Any]:
        """
        Get a project from the repository.
        
        Args:
            project_id: The ID of the project to retrieve
            
        Returns:
            Optional[Any]: The project object, or None if not found
        """
        # Try to get from memory first
        if project_id in self.project_repository:
            return self.project_repository[project_id]
        
        # Try to load from file
        project_data = self._load_from_file("projects", project_id)
        if project_data:
            from ..project_management import BaseProject
            project = BaseProject.from_dict(project_data)
            self.project_repository[project_id] = project
            return project
        
        return None
    
    def list_projects(self) -> List[str]:
        """
        Get a list of all project IDs.
        
        Returns:
            List[str]: A list of project IDs
        """
        # Get IDs from memory
        ids = list(self.project_repository.keys())
        
        # Get IDs from files
        file_ids = self._list_files("projects")
        
        # Combine and remove duplicates
        return list(set(ids + file_ids))
    
    def delete_project(self, project_id: str) -> bool:
        """
        Delete a project from the repository.
        
        Args:
            project_id: The ID of the project to delete
            
        Returns:
            bool: True if the project was deleted, False if it wasn't found
        """
        if project_id in self.project_repository:
            del self.project_repository[project_id]
            self.updated_at = datetime.now()
            
            # Delete from file
            self._delete_file("projects", project_id)
            return True
        
        # Try to delete from file even if not in memory
        return self._delete_file("projects", project_id)
    
    def store_execution(self, execution_data: Dict[str, Any]) -> None:
        """
        Store execution data in the history.
        
        Args:
            execution_data: The execution data to store
        """
        self.execution_history.append(execution_data)
        self.updated_at = datetime.now()
        
        # Persist to file
        execution_id = execution_data.get("id", str(uuid.uuid4()))
        self._save_to_file("executions", execution_id, execution_data)
    
    def get_execution(self, execution_id: str) -> Optional[Dict[str, Any]]:
        """
        Get execution data from the history.
        
        Args:
            execution_id: The ID of the execution to retrieve
            
        Returns:
            Optional[Dict]: The execution data, or None if not found
        """
        # Try to find in memory first
        for execution in self.execution_history:
            if execution.get("id") == execution_id:
                return execution
        
        # Try to load from file
        return self._load_from_file("executions", execution_id)
    
    def list_executions(self) -> List[str]:
        """
        Get a list of all execution IDs.
        
        Returns:
            List[str]: A list of execution IDs
        """
        # Get IDs from memory
        ids = [execution.get("id") for execution in self.execution_history if "id" in execution]
        
        # Get IDs from files
        file_ids = self._list_files("executions")
        
        # Combine and remove duplicates
        return list(set(ids + file_ids))
    
    def add_to_knowledge_graph(self, node_id: str, node_data: Dict[str, Any]) -> None:
        """
        Add a node to the knowledge graph.
        
        Args:
            node_id: The ID of the node
            node_data: The node data
        """
        self.knowledge_graph[node_id] = node_data
        self.updated_at = datetime.now()
        
        # Persist to file
        self._save_to_file("knowledge", node_id, node_data)
    
    def get_from_knowledge_graph(self, node_id: str) -> Optional[Dict[str, Any]]:
        """
        Get a node from the knowledge graph.
        
        Args:
            node_id: The ID of the node to retrieve
            
        Returns:
            Optional[Dict]: The node data, or None if not found
        """
        # Try to get from memory first
        if node_id in self.knowledge_graph:
            return self.knowledge_graph[node_id]
        
        # Try to load from file
        return self._load_from_file("knowledge", node_id)
    
    def store_user_preference(self, user_id: str, preference_key: str, preference_value: Any) -> None:
        """
        Store a user preference.
        
        Args:
            user_id: The ID of the user
            preference_key: The preference key
            preference_value: The preference value
        """
        if user_id not in self.user_preferences:
            self.user_preferences[user_id] = {}
        
        self.user_preferences[user_id][preference_key] = preference_value
        self.updated_at = datetime.now()
        
        # Persist to file
        user_prefs = self.user_preferences.get(user_id, {})
        self._save_to_file("preferences", user_id, user_prefs)
    
    def get_user_preference(self, user_id: str, preference_key: str, default: Any = None) -> Any:
        """
        Get a user preference.
        
        Args:
            user_id: The ID of the user
            preference_key: The preference key
            default: The default value to return if the preference is not found
            
        Returns:
            Any: The preference value or the default value
        """
        # Try to get from memory first
        if user_id in self.user_preferences:
            return self.user_preferences[user_id].get(preference_key, default)
        
        # Try to load from file
        user_prefs = self._load_from_file("preferences", user_id)
        if user_prefs:
            self.user_preferences[user_id] = user_prefs
            return user_prefs.get(preference_key, default)
        
        return default
    
    def add_metadata(self, key: str, value: Any) -> None:
        """
        Add metadata to the data storage instance.
        
        Args:
            key: The metadata key
            value: The metadata value
        """
        self.metadata[key] = value
        self.updated_at = datetime.now()
    
    def _save_to_file(self, category: str, item_id: str, data: Dict[str, Any]) -> bool:
        """
        Save data to a file.
        
        Args:
            category: The data category (e.g., "agents", "projects")
            item_id: The ID of the item
            data: The data to save
            
        Returns:
            bool: True if the data was saved successfully, False otherwise
        """
        try:
            # Create category directory if it doesn't exist
            category_dir = os.path.join(self.storage_dir, category)
            os.makedirs(category_dir, exist_ok=True)
            
            # Save data to file
            file_path = os.path.join(category_dir, f"{item_id}.json")
            with open(file_path, 'w') as f:
                json.dump(data, f, indent=2)
            
            return True
        except Exception as e:
            print(f"Error saving data to file: {e}")
            return False
    
    def _load_from_file(self, category: str, item_id: str) -> Optional[Dict[str, Any]]:
        """
        Load data from a file.
        
        Args:
            category: The data category (e.g., "agents", "projects")
            item_id: The ID of the item
            
        Returns:
            Optional[Dict]: The loaded data, or None if the file doesn't exist or there was an error
        """
        try:
            file_path = os.path.join(self.storage_dir, category, f"{item_id}.json")
            if not os.path.exists(file_path):
                return None
            
            with open(file_path, 'r') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading data from file: {e}")
            return None
    
    def _delete_file(self, category: str, item_id: str) -> bool:
        """
        Delete a data file.
        
        Args:
            category: The data category (e.g., "agents", "projects")
            item_id: The ID of the item
            
        Returns:
            bool: True if the file was deleted, False if it doesn't exist or there was an error
        """
        try:
            file_path = os.path.join(self.storage_dir, category, f"{item_id}.json")
            if not os.path.exists(file_path):
                return False
            
            os.remove(file_path)
            return True
        except Exception as e:
            print(f"Error deleting file: {e}")
            return False
    
    def _list_files(self, category: str) -> List[str]:
        """
        List all files in a category.
        
        Args:
            category: The data category (e.g., "agents", "projects")
            
        Returns:
            List[str]: A list of item IDs
        """
        try:
            category_dir = os.path.join(self.storage_dir, category)
            if not os.path.exists(category_dir):
                return []
            
            # Get all JSON files and extract IDs from filenames
            files = [f for f in os.listdir(category_dir) if f.endswith('.json')]
            return [f[:-5] for f in files]  # Remove .json extension
        except Exception as e:
            print(f"Error listing files: {e}")
            return []
    
    def to_dict(self) -> Dict[str, Any]:
        """
        Convert the data storage instance to a dictionary representation.
        
        Returns:
            Dict: A dictionary representation of the data storage instance
        """
        return {
            "id": self.id,
            "storage_dir": self.storage_dir,
            "agent_count": len(self.agent_repository),
            "project_count": len(self.project_repository),
            "execution_count": len(self.execution_history),
            "knowledge_node_count": len(self.knowledge_graph),
            "user_count": len(self.user_preferences),
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "metadata": self.metadata
        }
    
    def __str__(self) -> str:
        """
        String representation of the data storage instance.
        
        Returns:
            str: A string representation of the data storage instance
        """
        return f"DataStorage(agents={len(self.agent_repository)}, projects={len(self.project_repository)})"
    
    def __repr__(self) -> str:
        """
        Detailed string representation of the data storage instance.
        
        Returns:
            str: A detailed string representation of the data storage instance
        """
        return f"DataStorage(id={self.id}, agents={len(self.agent_repository)}, projects={len(self.project_repository)}, executions={len(self.execution_history)})"
