"""
Main module for the Creation AI Ecosystem.
Provides the central integration point for all ecosystem components.
"""

from typing import Dict, List, Optional, Any
import os
import sys
import json
from datetime import datetime

from .agent_definition import BaseAgent, Persona, Skill, RoleTemplate
from .project_management import BaseProject, Task, Assignment
from .orchestration import OrchestrationEngine, TaskDecomposition
from .model_integration import AIModel, ModelRegistry
from .data_storage import DataStorage, KnowledgeGraph
from .manus_ai import Abilities
from .monica_ai import Sidebar
from .ui import CreationAIShell


class CreationAI:
    """
    Main class for the Creation AI Ecosystem.
    Integrates all components and provides a unified interface.
    """
    
    def __init__(self, config_path: str = None):
        """
        Initialize the Creation AI Ecosystem.
        
        Args:
            config_path: Optional path to a configuration file
        """
        self.id = f"creation-ai-{datetime.now().strftime('%Y%m%d%H%M%S')}"
        self.created_at = datetime.now()
        self.updated_at = datetime.now()
        self.metadata = {}
        
        # Load configuration if provided
        self.config = self._load_config(config_path)
        
        # Initialize components
        self.data_storage = DataStorage(self.config.get("data_storage_dir"))
        self.model_registry = ModelRegistry()
        self.knowledge_graph = KnowledgeGraph()
        self.orchestration_engine = OrchestrationEngine()
        self.task_decomposition = TaskDecomposition()
        self.manus_abilities = Abilities()
        self.monica_sidebar = Sidebar()
        
        # Initialize default models
        self._initialize_default_models()
        
        print(f"Creation AI Ecosystem initialized: {self.id}")
    
    def _load_config(self, config_path: str = None) -> Dict[str, Any]:
        """
        Load configuration from a file.
        
        Args:
            config_path: Path to the configuration file
            
        Returns:
            Dict: The configuration dictionary
        """
        default_config = {
            "data_storage_dir": os.path.join(os.getcwd(), "data"),
            "default_model": "GPT-3.5",
            "log_level": "INFO"
        }
        
        if not config_path:
            return default_config
        
        try:
            with open(config_path, 'r') as f:
                config = json.load(f)
                # Merge with default config
                return {**default_config, **config}
        except Exception as e:
            print(f"Error loading configuration: {e}")
            return default_config
    
    def _initialize_default_models(self) -> None:
        """
        Initialize default AI models.
        """
        # Create and register some default models
        gpt_model = AIModel("GPT-3.5", "https://api.openai.com/v1/chat/completions")
        gpt_model.add_capability("text-generation")
        gpt_model.add_capability("summarization")
        gpt_model.activate()
        self.model_registry.register_model(gpt_model)
        
        bert_model = AIModel("BERT", "https://api.example.com/bert")
        bert_model.add_capability("text-classification")
        bert_model.add_capability("sentiment-analysis")
        bert_model.activate()
        self.model_registry.register_model(bert_model)
        
        # Set default model
        default_model = self.config.get("default_model", "GPT-3.5")
        if default_model in [model.model_name for model in self.model_registry.models.values()]:
            self.model_registry.set_default_model(default_model)
    
    def create_agent(self, name: str, description: str) -> BaseAgent:
        """
        Create a new agent.
        
        Args:
            name: The name of the agent
            description: A description of the agent
            
        Returns:
            BaseAgent: The created agent
        """
        agent = BaseAgent(name, description)
        self.data_storage.store_agent(agent)
        return agent
    
    def create_project(self, name: str, description: str, goal: str) -> BaseProject:
        """
        Create a new project.
        
        Args:
            name: The name of the project
            description: A description of the project
            goal: The goal of the project
            
        Returns:
            BaseProject: The created project
        """
        project = BaseProject(name, description, goal)
        self.data_storage.store_project(project)
        return project
    
    def create_task(self, project_id: str, task_name: str, description: str) -> Optional[Task]:
        """
        Create a new task in a project.
        
        Args:
            project_id: The ID of the project
            task_name: The name of the task
            description: A description of the task
            
        Returns:
            Optional[Task]: The created task, or None if the project wasn't found
        """
        project = self.data_storage.get_project(project_id)
        if not project:
            return None
        
        task = Task(task_name, description)
        project.add_task(task)
        self.data_storage.store_project(project)
        return task
    
    def assign_task(self, project_id: str, task_id: str, agent_id: str) -> bool:
        """
        Assign a task to an agent.
        
        Args:
            project_id: The ID of the project
            task_id: The ID of the task
            agent_id: The ID of the agent
            
        Returns:
            bool: True if the assignment was successful, False otherwise
        """
        project = self.data_storage.get_project(project_id)
        if not project:
            return False
        
        agent = self.data_storage.get_agent(agent_id)
        if not agent:
            return False
        
        # Add the agent to the project if not already added
        agent_found = False
        for proj_agent in project.agents:
            if proj_agent.id == agent_id:
                agent_found = True
                break
        
        if not agent_found:
            project.add_agent(agent)
        
        # Assign the agent to the task
        if project.assign_agent(task_id, agent_id):
            # Create an assignment record
            assignment = Assignment(task_id, agent_id)
            
            # Update the project
            self.data_storage.store_project(project)
            return True
        
        return False
    
    def process_query(self, query: str) -> Dict[str, Any]:
        """
        Process a complex query using the orchestration engine.
        
        Args:
            query: The query to process
            
        Returns:
            Dict: The processing result
        """
        # Create an execution plan
        execution_plan = self.orchestration_engine.create_execution_plan(query)
        
        # Execute the plan
        result = self.orchestration_engine.execute_plan(execution_plan["id"])
        
        # Store the execution in history
        self.data_storage.store_execution(result)
        
        return result
    
    def use_manus_ability(self, ability_name: str, **kwargs) -> Dict[str, Any]:
        """
        Use a Manus AI ability.
        
        Args:
            ability_name: The name of the ability to use
            **kwargs: Arguments for the ability
            
        Returns:
            Dict: The result of the ability execution
        """
        return self.manus_abilities.execute_ability(ability_name, **kwargs)
    
    def use_monica_capability(self, capability_name: str, **kwargs) -> Dict[str, Any]:
        """
        Use a Monica AI capability.
        
        Args:
            capability_name: The name of the capability to use
            **kwargs: Arguments for the capability
            
        Returns:
            Dict: The result of the capability execution
        """
        return self.monica_sidebar.execute_capability(capability_name, **kwargs)
    
    def start_cli(self) -> None:
        """
        Start the command-line interface.
        """
        cli = CreationAIShell()
        cli.cmdloop()
    
    def add_metadata(self, key: str, value: Any) -> None:
        """
        Add metadata to the Creation AI instance.
        
        Args:
            key: The metadata key
            value: The metadata value
        """
        self.metadata[key] = value
        self.updated_at = datetime.now()
    
    def to_dict(self) -> Dict[str, Any]:
        """
        Convert the Creation AI instance to a dictionary representation.
        
        Returns:
            Dict: A dictionary representation of the Creation AI instance
        """
        return {
            "id": self.id,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "config": self.config,
            "metadata": self.metadata
        }
    
    def __str__(self) -> str:
        """
        String representation of the Creation AI instance.
        
        Returns:
            str: A string representation of the Creation AI instance
        """
        return f"CreationAI(id={self.id})"
    
    def __repr__(self) -> str:
        """
        Detailed string representation of the Creation AI instance.
        
        Returns:
            str: A detailed string representation of the Creation AI instance
        """
        return f"CreationAI(id={self.id}, created_at={self.created_at.isoformat()})"
