"""
README.md for the Creation AI Ecosystem.
Provides documentation and usage instructions.
"""

# Creation AI Ecosystem

A comprehensive AI agent ecosystem with customizable agents, a Super Agent orchestrator, and integration of Manus AI and Monica AI capabilities.

## Overview

The Creation AI Ecosystem is a modular framework for creating, managing, and orchestrating AI agents. It provides a flexible architecture that allows for the creation of specialized agents with different skills and personas, orchestrated by a Super Agent that can decompose complex tasks and delegate them to the most appropriate agents.

The ecosystem integrates capabilities from Manus AI for information processing and content creation, and Monica AI for UI and design assistance.

## Features

- **Agent Definition Module**: Create customizable agents with skills and personas
- **Project Management Module**: Manage projects, tasks, and assignments
- **Orchestration Engine**: Coordinate activities of smaller agents to complete complex tasks
- **Model Integration**: Interface with various AI models through a standardized API
- **Data Storage**: Persistent storage of ecosystem data
- **Knowledge Graph**: Create and manage knowledge graphs
- **Manus AI Integration**: Specialized capabilities for information gathering, content creation, and more
- **Monica AI Integration**: UI and design capabilities
- **Command-Line Interface**: Interact with the ecosystem through a CLI

## Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/creation-ai-ecosystem.git
cd creation-ai-ecosystem
```

2. Install the required dependencies:
```
pip install -r requirements.txt
```

## Usage

### Command-Line Interface

To start the command-line interface:

```
python main.py --cli
```

This will launch an interactive shell where you can create agents, projects, tasks, and more.

### Custom Configuration

To use a custom configuration file:

```
python main.py --config path/to/config.json
```

### Programmatic Usage

You can also use the Creation AI Ecosystem programmatically in your Python code:

```python
from creation_ai_ecosystem import CreationAI

# Initialize the ecosystem
creation_ai = CreationAI()

# Create an agent
agent = creation_ai.create_agent("Research Agent", "Specialized in gathering information")

# Create a project
project = creation_ai.create_project("Research Project", "Gather information on AI trends", "Produce a comprehensive report")

# Create a task
task = creation_ai.create_task(project.id, "Literature Review", "Review recent academic papers on AI")

# Assign the task to the agent
creation_ai.assign_task(project.id, task.id, agent.id)

# Process a complex query using the orchestration engine
result = creation_ai.process_query("Analyze the impact of transformer models on natural language processing")

# Use Manus AI abilities
info = creation_ai.use_manus_ability("information_gathering", query="AI trends in 2025")

# Use Monica AI capabilities
design = creation_ai.use_monica_capability("design_assistance", design_brief="Create a modern dashboard for AI analytics")
```

## Module Structure

- **Agent Definition**: Define agents with skills and personas
  - `BaseAgent`: Core agent functionality
  - `Persona`: Agent personality and characteristics
  - `Skill`: Agent capabilities
  - `RoleTemplate`: Predefined roles with required skills

- **Project Management**: Manage projects and tasks
  - `BaseProject`: Core project functionality
  - `Task`: Work items that can be assigned to agents
  - `Assignment`: Assignment of agents to tasks

- **Orchestration**: Coordinate agent activities
  - `OrchestrationEngine`: Super Agent that coordinates smaller agents
  - `TaskDecomposition`: Break down complex tasks into simpler subtasks

- **Model Integration**: Interface with AI models
  - `AIModel`: Standardized interface for AI models
  - `ModelRegistry`: Registry for managing models

- **Data Storage**: Persistent storage
  - `DataStorage`: Store and retrieve ecosystem data
  - `KnowledgeGraph`: Create and query knowledge graphs

- **Manus AI**: Specialized capabilities
  - `Abilities`: Information gathering, content creation, and more

- **Monica AI**: UI and design capabilities
  - `Sidebar`: Design assistance, UI prototyping, and more

- **UI**: User interface
  - `CreationAIShell`: Command-line interface

## Configuration

The ecosystem can be configured using a JSON configuration file. Example:

```json
{
  "data_storage_dir": "/path/to/data",
  "default_model": "GPT-3.5",
  "log_level": "INFO"
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
