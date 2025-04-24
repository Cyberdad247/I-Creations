from .base_framework import BaseAgentFramework

class OpenAIAdapter(BaseAgentFramework):
    def create_agent(self, config):
        """
        Create an agent using OpenAI (stub example).
        config: dict with model, api_key, etc.
        """
        from openai import OpenAI
        model_name = config.get('model', 'gpt-3.5-turbo')
        api_key = config.get('api_key')
        return OpenAI(api_key=api_key, model=model_name)

    def run_agent(self, agent, input_data):
        """
        Run the OpenAI agent on input_data (stub example).
        """
        return agent.invoke(input_data)

    def shutdown_agent(self, agent):
        """
        OpenAI API agents do not require explicit shutdown.
        """
        pass

    def get_framework_name(self) -> str:
        return "OpenAI"
