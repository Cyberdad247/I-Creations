"""
Plugin/Registry system for agentic frameworks.

How to add a new agentic framework:
1. Create a new adapter in agent_frameworks/ (e.g., myframework_adapter.py) inheriting from BaseAgentFramework.
2. Implement the required methods: create_agent, run_agent, shutdown_agent, get_framework_name.
3. Register your adapter in the FRAMEWORK_REGISTRY below.

Usage:
from plugins import get_framework_adapter
adapter = get_framework_adapter('OpenAI')
agent = adapter.create_agent(config)
result = adapter.run_agent(agent, input_data)
"""
from agent_frameworks.openai_adapter import OpenAIAdapter
from agent_frameworks.langchain_adapter import LangChainAdapter
from agent_frameworks.google_agent2agent_adapter import GoogleAgent2AgentAdapter

FRAMEWORK_REGISTRY = {
    'OpenAI': OpenAIAdapter(),
    'LangChain': LangChainAdapter(),
    'GoogleAgent2Agent': GoogleAgent2AgentAdapter(),
}

def get_framework_adapter(name: str):
    """
    Retrieve the adapter instance for a given framework name.
    """
    adapter = FRAMEWORK_REGISTRY.get(name)
    if not adapter:
        raise ValueError(f"Framework '{name}' is not registered. Available: {list(FRAMEWORK_REGISTRY.keys())}")
    return adapter
