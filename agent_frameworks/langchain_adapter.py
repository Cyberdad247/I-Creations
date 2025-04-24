from .base_framework import BaseAgentFramework

class LangChainAdapter(BaseAgentFramework):
    def create_agent(self, config):
        """
        Create a LangChain agent using the provided config.
        config: dict with model, tools, etc.
        """
        from langchain.llms import OpenAI
        from langchain.agents import initialize_agent, AgentType
        model_name = config.get('model', 'gpt-3.5-turbo')
        api_key = config.get('api_key')
        llm = OpenAI(openai_api_key=api_key, model_name=model_name)
        tools = config.get('tools', [])
        agent = initialize_agent(tools, llm, agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION)
        return agent

    def run_agent(self, agent, input_data):
        """
        Run the LangChain agent on input_data.
        """
        return agent.run(input_data)

    def shutdown_agent(self, agent):
        """
        LangChain agents do not require explicit shutdown.
        """
        pass

    def get_framework_name(self) -> str:
        return "LangChain"
