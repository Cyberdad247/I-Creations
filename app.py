"""
Basic UI module for the Creation AI Ecosystem.
Provides a command-line interface for interacting with the ecosystem.
"""

import cmd
import sys
import json
from typing import Dict, List, Any, Optional
import os

from ..agent_definition import BaseAgent, Persona, Skill, RoleTemplate
from ..project_management import BaseProject, Task, Assignment
from ..orchestration import OrchestrationEngine, TaskDecomposition
from ..model_integration import AIModel, ModelRegistry
from ..data_storage import DataStorage, KnowledgeGraph
from ..manus_ai import Abilities
from ..monica_ai import Sidebar


class CreationAIShell(cmd.Cmd):
    """
    Command-line interface for the Creation AI Ecosystem.
    """
    
    intro = """
    ╔═══════════════════════════════════════════════════════════════╗
    ║                                                               ║
    ║                   Creation AI Ecosystem CLI                   ║
    ║                                                               ║
    ║  Type 'help' or '?' to list commands.                         ║
    ║  Type 'exit' or 'quit' to exit.                               ║
    ║                                                               ║
    ╚═══════════════════════════════════════════════════════════════╝
    """
    prompt = "Creation AI> "
    
    def __init__(self):
        """
        Initialize the CLI with ecosystem components.
        """
        super().__init__()
        
        # Initialize ecosystem components
        self.data_storage = DataStorage()
        self.model_registry = ModelRegistry()
        self.orchestration_engine = OrchestrationEngine()
        self.knowledge_graph = KnowledgeGraph()
        
        # Add some default models
        self._initialize_default_models()
    
    def _initialize_default_models(self):
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
        self.model_registry.set_default_model("GPT-3.5")
    
    def do_exit(self, arg):
        """
        Exit the CLI.
        """
        print("Exiting Creation AI Ecosystem CLI...")
        return True
    
    def do_quit(self, arg):
        """
        Exit the CLI.
        """
        return self.do_exit(arg)
    
    def do_create_agent(self, arg):
        """
        Create a new agent.
        Usage: create_agent <name> <description>
        """
        args = arg.split(maxsplit=1)
        if len(args) < 2:
            print("Error: Missing arguments. Usage: create_agent <name> <description>")
            return
        
        name, description = args
        agent = BaseAgent(name, description)
        
        # Store the agent
        self.data_storage.store_agent(agent)
        
        print(f"Agent created: {agent}")
        print(f"Agent ID: {agent.id}")
    
    def do_list_agents(self, arg):
        """
        List all agents.
        Usage: list_agents
        """
        agent_ids = self.data_storage.list_agents()
        
        if not agent_ids:
            print("No agents found.")
            return
        
        print(f"Found {len(agent_ids)} agents:")
        for agent_id in agent_ids:
            agent = self.data_storage.get_agent(agent_id)
            if agent:
                print(f"  - {agent}")
    
    def do_create_project(self, arg):
        """
        Create a new project.
        Usage: create_project <name> <description> <goal>
        """
        args = arg.split(maxsplit=2)
        if len(args) < 3:
            print("Error: Missing arguments. Usage: create_project <name> <description> <goal>")
            return
        
        name, description, goal = args
        project = BaseProject(name, description, goal)
        
        # Store the project
        self.data_storage.store_project(project)
        
        print(f"Project created: {project}")
        print(f"Project ID: {project.id}")
    
    def do_list_projects(self, arg):
        """
        List all projects.
        Usage: list_projects
        """
        project_ids = self.data_storage.list_projects()
        
        if not project_ids:
            print("No projects found.")
            return
        
        print(f"Found {len(project_ids)} projects:")
        for project_id in project_ids:
            project = self.data_storage.get_project(project_id)
            if project:
                print(f"  - {project}")
    
    def do_create_task(self, arg):
        """
        Create a new task.
        Usage: create_task <project_id> <name> <description>
        """
        args = arg.split(maxsplit=2)
        if len(args) < 3:
            print("Error: Missing arguments. Usage: create_task <project_id> <name> <description>")
            return
        
        project_id, name, description = args
        
        # Get the project
        project = self.data_storage.get_project(project_id)
        if not project:
            print(f"Error: Project with ID {project_id} not found.")
            return
        
        # Create the task
        task = Task(name, description)
        
        # Add the task to the project
        project.add_task(task)
        
        # Update the project
        self.data_storage.store_project(project)
        
        print(f"Task created: {task}")
        print(f"Task ID: {task.id}")
    
    def do_list_tasks(self, arg):
        """
        List all tasks in a project.
        Usage: list_tasks <project_id>
        """
        if not arg:
            print("Error: Missing project ID. Usage: list_tasks <project_id>")
            return
        
        project_id = arg.strip()
        
        # Get the project
        project = self.data_storage.get_project(project_id)
        if not project:
            print(f"Error: Project with ID {project_id} not found.")
            return
        
        if not project.tasks:
            print("No tasks found in this project.")
            return
        
        print(f"Found {len(project.tasks)} tasks in project {project.name}:")
        for task in project.tasks:
            print(f"  - {task}")
    
    def do_assign_task(self, arg):
        """
        Assign a task to an agent.
        Usage: assign_task <project_id> <task_id> <agent_id>
        """
        args = arg.split()
        if len(args) < 3:
            print("Error: Missing arguments. Usage: assign_task <project_id> <task_id> <agent_id>")
            return
        
        project_id, task_id, agent_id = args
        
        # Get the project
        project = self.data_storage.get_project(project_id)
        if not project:
            print(f"Error: Project with ID {project_id} not found.")
            return
        
        # Get the agent
        agent = self.data_storage.get_agent(agent_id)
        if not agent:
            print(f"Error: Agent with ID {agent_id} not found.")
            return
        
        # Find the task
        task_found = False
        for task in project.tasks:
            if task.id == task_id:
                task_found = True
                break
        
        if not task_found:
            print(f"Error: Task with ID {task_id} not found in project.")
            return
        
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
            # Update the project
            self.data_storage.store_project(project)
            print(f"Task {task_id} assigned to agent {agent.name}")
        else:
            print("Error: Failed to assign task to agent.")
    
    def do_list_models(self, arg):
        """
        List all registered AI models.
        Usage: list_models
        """
        model_names = self.model_registry.list_models()
        
        if not model_names:
            print("No models registered.")
            return
        
        print(f"Found {len(model_names)} registered models:")
        for model_name in model_names:
            model = self.model_registry.get_model(model_name)
            if model:
                print(f"  - {model}")
    
    def do_invoke_model(self, arg):
        """
        Invoke an AI model.
        Usage: invoke_model <model_name> <input_text>
        """
        args = arg.split(maxsplit=1)
        if len(args) < 2:
            print("Error: Missing arguments. Usage: invoke_model <model_name> <input_text>")
            return
        
        model_name, input_text = args
        
        # Get the model
        model = self.model_registry.get_model(model_name)
        if not model:
            print(f"Error: Model with name {model_name} not found.")
            return
        
        # Invoke the model
        result = model.invoke({"input": input_text})
        
        print("Model invocation result:")
        print(json.dumps(result, indent=2))
    
    def do_create_execution_plan(self, arg):
        """
        Create an execution plan for a complex query.
        Usage: create_execution_plan <query>
        """
        if not arg:
            print("Error: Missing query. Usage: create_execution_plan <query>")
            return
        
        query = arg.strip()
        
        # Create an execution plan
        execution_plan = self.orchestration_engine.create_execution_plan(query)
        
        print("Execution plan created:")
        print(json.dumps(execution_plan, indent=2))
    
    def do_execute_plan(self, arg):
        """
        Execute an existing execution plan.
        Usage: execute_plan <execution_id>
        """
        if not arg:
            print("Error: Missing execution ID. Usage: execute_plan <execution_id>")
            return
        
        execution_id = arg.strip()
        
        try:
            # Execute the plan
            result = self.orchestration_engine.execute_plan(execution_id)
            
            print("Execution result:")
            print(json.dumps(result, indent=2))
        except ValueError as e:
            print(f"Error: {e}")
    
    def do_help(self, arg):
        """
        List available commands with their descriptions.
        """
        if arg:
            # Show help for a specific command
            super().do_help(arg)
            return
        
        # Show all commands
        print("\nAvailable commands:")
        print("------------------")
        
        # Get all methods that start with 'do_'
        commands = [cmd[3:] for cmd in dir(self) if cmd.startswith('do_')]
        
        for cmd in sorted(commands):
            if cmd in ['help', 'exit', 'quit']:
                continue
            
            # Get the docstring for the command
            doc = getattr(self, f'do_{cmd}').__doc__
            if doc:
                # Extract the first line of the docstring
                desc = doc.strip().split('\n')[0]
                print(f"{cmd:20} - {desc}")
        
        print("\nUtility commands:")
        print("----------------")
        print(f"{'help':20} - Show this help message")
        print(f"{'exit':20} - Exit the CLI")
        print(f"{'quit':20} - Exit the CLI")
    
    def emptyline(self):
        """
        Do nothing on empty line.
        """
        pass


def main():
    """
    Main entry point for the CLI.
    """
    cli = CreationAIShell()
    try:
        cli.cmdloop()
    except KeyboardInterrupt:
        print("\nExiting Creation AI Ecosystem CLI...")
        sys.exit(0)


if __name__ == "__main__":
    main()
