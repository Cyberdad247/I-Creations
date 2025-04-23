import dotenv from 'dotenv';
import axios from 'axios';
import { OpenAI } from 'langchain/llms/openai';
import { PromptTemplate } from 'langchain/prompts';
import { LLMChain } from 'langchain/chains';

dotenv.config();

class AgentOrchestrationService {
  private models: Record<string, OpenAI>;
  
  constructor() {
    // Initialize different models with varying parameters
    this.models = {
      'gpt-3.5-turbo': new OpenAI({ 
        modelName: 'gpt-3.5-turbo', 
        temperature: 0.7,
        openAIApiKey: process.env.OPENAI_API_KEY
      }),
      'gpt-4': new OpenAI({ 
        modelName: 'gpt-4', 
        temperature: 0.7,
        openAIApiKey: process.env.OPENAI_API_KEY
      })
    };
  }

  private async callProvider(provider: string, prompt: string, options: any = {}): Promise<string> {
    switch (provider) {
      case 'openai':
        return await this.models[options.model || 'gpt-3.5-turbo'].call(prompt);
      case 'ollama':
        return (await axios.post(
          `${process.env.OLLAMA_API_URL}/api/generate`,
          { model: options.model || process.env.OLLAMA_MODEL, prompt }
        )).data.response;
      case 'grok':
        return (await axios.post(
          `${process.env.GROK_API_URL}/chat/completions`,
          { prompt },
          { headers: { Authorization: `Bearer ${process.env.GROK_API_KEY}` } }
        )).data.choices[0].text;
      case 'gemini':
        return (await axios.post(
          `${process.env.GEMINI_API_URL}/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
          { contents: [{ parts: [{ text: prompt }] }] }
        )).data.candidates[0].content.parts[0].text;
      case 'openrouter':
        return (await axios.post(
          `${process.env.OPENROUTER_API_URL}/chat/completions`,
          { model: options.model || 'openrouter-model', messages: [{ role: 'user', content: prompt }] },
          { headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}` } }
        )).data.choices[0].message.content;
      case 'huggingface':
        return (await axios.post(
          `${process.env.HUGGINGFACE_API_URL}/${options.model || 'bigscience/bloom-560m'}`,
          { inputs: prompt },
          { headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` } }
        )).data[0]?.generated_text || '';
      case 'mistral':
        return (await axios.post(
          `${process.env.MISTRAL_API_URL}/chat/completions`,
          { model: options.model || 'mistral-tiny', messages: [{ role: 'user', content: prompt }] },
          { headers: { Authorization: `Bearer ${process.env.MISTRAL_API_KEY}` } }
        )).data.choices[0].message.content;
      default:
        throw new Error(`Provider ${provider} not supported`);
    }
  }

  async processAgentRequest(agentId: string, input: string, agentConfig: any): Promise<string> {
    try {
      // Select provider and model from agentConfig
      const provider = agentConfig.properties.find((p: any) => p.id === 'provider')?.value || 'openai';
      const model = agentConfig.properties.find((p: any) => p.id === 'model')?.value;
      const agentName = agentConfig.properties.find((p: any) => p.id === 'name')?.value || 'Assistant';
      const template = this.getPromptTemplate(agentConfig.type);
      const prompt = template.format({ agentName, input });
      // Call the selected provider
      return await this.callProvider(provider, prompt, { model });
    } catch (error) {
      console.error('Error processing agent request:', error);
      throw new Error('Failed to process agent request');
    }
  }
  
  private getPromptTemplate(agentType: string): PromptTemplate {
    // Define different prompt templates based on agent type
    switch (agentType) {
      case 'assistant':
        return new PromptTemplate({
          template: `You are {agentName}, a helpful AI assistant.
          
Please respond to the following request:
{input}`,
          inputVariables: ['agentName', 'input']
        });
        
      case 'researcher':
        return new PromptTemplate({
          template: `You are {agentName}, an AI research assistant specialized in gathering and analyzing information.
          
Please research the following topic and provide a comprehensive analysis:
{input}`,
          inputVariables: ['agentName', 'input']
        });
        
      case 'coder':
        return new PromptTemplate({
          template: `You are {agentName}, an AI coding assistant specialized in writing, reviewing, and explaining code.
          
Please respond to the following coding request:
{input}`,
          inputVariables: ['agentName', 'input']
        });
        
      default:
        return new PromptTemplate({
          template: `You are {agentName}, an AI assistant.
          
Please respond to the following:
{input}`,
          inputVariables: ['agentName', 'input']
        });
    }
  }
  
  async resetAgent(agentId: string): Promise<boolean> {
    try {
      // Logic to reset an agent to its initial state
      // This would involve clearing any learned patterns or customizations
      console.log(`Resetting agent ${agentId}`);
      return true;
    } catch (error) {
      console.error('Error resetting agent:', error);
      return false;
    }
  }
  
  async emergencyShutdown(): Promise<boolean> {
    try {
      // Logic to perform an emergency shutdown of all agents
      console.log('Performing emergency shutdown of all agents');
      return true;
    } catch (error) {
      console.error('Error during emergency shutdown:', error);
      return false;
    }
  }
}

export default new AgentOrchestrationService();
