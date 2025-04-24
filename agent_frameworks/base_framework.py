from abc import ABC, abstractmethod

class BaseAgentFramework(ABC):
    """
    Abstract base class for agentic framework adapters.
    All framework integrations must implement this interface.
    """
    @abstractmethod
    def create_agent(self, config):
        pass

    @abstractmethod
    def run_agent(self, agent, input_data):
        pass

    @abstractmethod
    def shutdown_agent(self, agent):
        pass

    @abstractmethod
    def get_framework_name(self) -> str:
        pass
