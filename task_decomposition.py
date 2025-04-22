"""
Task Decomposition module for the Creation AI Ecosystem.
Provides functionality for breaking down complex tasks into simpler subtasks.
"""

from typing import Dict, List, Optional, Any
import uuid
from datetime import datetime


class TaskDecomposition:
    """
    Class for decomposing complex tasks into simpler subtasks in the Creation AI Ecosystem.
    """
    
    def __init__(self):
        """
        Initialize a new task decomposition instance.
        """
        self.id = str(uuid.uuid4())
        self.created_at = datetime.now()
        self.updated_at = datetime.now()
        self.decomposition_strategies = {
            "sequential": self._decompose_sequential,
            "parallel": self._decompose_parallel,
            "hierarchical": self._decompose_hierarchical
        }
        self.metadata = {}
    
    def decompose(self, task: Dict[str, Any], strategy: str = "sequential") -> List[Dict[str, Any]]:
        """
        Decompose a task using the specified strategy.
        
        Args:
            task: The task to decompose
            strategy: The decomposition strategy to use
            
        Returns:
            List[Dict]: A list of subtask dictionaries
        """
        if strategy not in self.decomposition_strategies:
            raise ValueError(f"Unknown decomposition strategy: {strategy}")
        
        decomposition_func = self.decomposition_strategies[strategy]
        return decomposition_func(task)
    
    def _decompose_sequential(self, task: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Decompose a task into sequential subtasks.
        
        Args:
            task: The task to decompose
            
        Returns:
            List[Dict]: A list of sequential subtask dictionaries
        """
        # This is a simplified implementation
        # In a real system, this would use NLP or other techniques
        
        task_name = task.get("name", "")
        task_description = task.get("description", "")
        
        # Example sequential decomposition
        subtasks = [
            {
                "id": str(uuid.uuid4()),
                "name": f"Research for {task_name}",
                "description": f"Gather information for {task_description}",
                "priority": "High",
                "order": 1
            },
            {
                "id": str(uuid.uuid4()),
                "name": f"Analysis for {task_name}",
                "description": f"Analyze information for {task_description}",
                "priority": "Medium",
                "order": 2
            },
            {
                "id": str(uuid.uuid4()),
                "name": f"Implementation for {task_name}",
                "description": f"Implement solution for {task_description}",
                "priority": "Medium",
                "order": 3
            },
            {
                "id": str(uuid.uuid4()),
                "name": f"Verification for {task_name}",
                "description": f"Verify solution for {task_description}",
                "priority": "Low",
                "order": 4
            }
        ]
        
        return subtasks
    
    def _decompose_parallel(self, task: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Decompose a task into parallel subtasks.
        
        Args:
            task: The task to decompose
            
        Returns:
            List[Dict]: A list of parallel subtask dictionaries
        """
        # This is a simplified implementation
        # In a real system, this would use NLP or other techniques
        
        task_name = task.get("name", "")
        task_description = task.get("description", "")
        
        # Example parallel decomposition
        subtasks = [
            {
                "id": str(uuid.uuid4()),
                "name": f"Data collection for {task_name}",
                "description": f"Collect data for {task_description}",
                "priority": "Medium",
                "parallel_group": "data"
            },
            {
                "id": str(uuid.uuid4()),
                "name": f"Infrastructure setup for {task_name}",
                "description": f"Set up infrastructure for {task_description}",
                "priority": "Medium",
                "parallel_group": "infrastructure"
            },
            {
                "id": str(uuid.uuid4()),
                "name": f"Resource allocation for {task_name}",
                "description": f"Allocate resources for {task_description}",
                "priority": "Medium",
                "parallel_group": "resources"
            }
        ]
        
        return subtasks
    
    def _decompose_hierarchical(self, task: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Decompose a task into hierarchical subtasks.
        
        Args:
            task: The task to decompose
            
        Returns:
            List[Dict]: A list of hierarchical subtask dictionaries
        """
        # This is a simplified implementation
        # In a real system, this would use NLP or other techniques
        
        task_name = task.get("name", "")
        task_description = task.get("description", "")
        
        # Example hierarchical decomposition
        subtask1_id = str(uuid.uuid4())
        subtask2_id = str(uuid.uuid4())
        
        subtasks = [
            {
                "id": subtask1_id,
                "name": f"Main component for {task_name}",
                "description": f"Develop main component for {task_description}",
                "priority": "High",
                "level": 1,
                "parent_id": None
            },
            {
                "id": subtask2_id,
                "name": f"Secondary component for {task_name}",
                "description": f"Develop secondary component for {task_description}",
                "priority": "Medium",
                "level": 1,
                "parent_id": None
            },
            {
                "id": str(uuid.uuid4()),
                "name": f"Subcomponent 1 for main component",
                "description": f"Develop subcomponent 1 for main component",
                "priority": "Medium",
                "level": 2,
                "parent_id": subtask1_id
            },
            {
                "id": str(uuid.uuid4()),
                "name": f"Subcomponent 2 for main component",
                "description": f"Develop subcomponent 2 for main component",
                "priority": "Low",
                "level": 2,
                "parent_id": subtask1_id
            },
            {
                "id": str(uuid.uuid4()),
                "name": f"Subcomponent 1 for secondary component",
                "description": f"Develop subcomponent 1 for secondary component",
                "priority": "Low",
                "level": 2,
                "parent_id": subtask2_id
            }
        ]
        
        return subtasks
    
    def add_decomposition_strategy(self, name: str, strategy_func: callable) -> None:
        """
        Add a new decomposition strategy.
        
        Args:
            name: The name of the strategy
            strategy_func: The function implementing the strategy
        """
        self.decomposition_strategies[name] = strategy_func
        self.updated_at = datetime.now()
    
    def add_metadata(self, key: str, value: Any) -> None:
        """
        Add metadata to the task decomposition instance.
        
        Args:
            key: The metadata key
            value: The metadata value
        """
        self.metadata[key] = value
        self.updated_at = datetime.now()
    
    def to_dict(self) -> Dict[str, Any]:
        """
        Convert the task decomposition instance to a dictionary representation.
        
        Returns:
            Dict: A dictionary representation of the task decomposition instance
        """
        return {
            "id": self.id,
            "available_strategies": list(self.decomposition_strategies.keys()),
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "metadata": self.metadata
        }
    
    def __str__(self) -> str:
        """
        String representation of the task decomposition instance.
        
        Returns:
            str: A string representation of the task decomposition instance
        """
        return f"TaskDecomposition(strategies={len(self.decomposition_strategies)})"
    
    def __repr__(self) -> str:
        """
        Detailed string representation of the task decomposition instance.
        
        Returns:
            str: A detailed string representation of the task decomposition instance
        """
        return f"TaskDecomposition(id={self.id}, strategies={list(self.decomposition_strategies.keys())})"
