import axios from 'axios';
import { Agent, AgentTool, AgentMemory, AgentCreate, AgentUpdate } from '../types/agent';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Core Agent CRUD Operations
export const getAgents = async (): Promise<Agent[]> => {
  try {
    const response = await axios.get<Agent[]>(`${API_URL}/agents`);
    return response.data;
  } catch (error) {
    console.error('Error fetching agents:', error);
    throw new Error('Failed to fetch agents');
  }
};

export const getAgent = async (agentId: string): Promise<Agent> => {
  try {
    const response = await axios.get<Agent>(`${API_URL}/agents/${agentId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching agent:', error);
    throw new Error('Failed to fetch agent');
  }
};

export const createAgent = async (agent: AgentCreate): Promise<Agent> => {
  try {
    const response = await axios.post<Agent>(`${API_URL}/agents`, agent);
    return response.data;
  } catch (error) {
    console.error('Error creating agent:', error);
    throw new Error('Failed to create agent');
  }
};

export const updateAgent = async (agentId: string, agent: AgentUpdate): Promise<Agent> => {
  try {
    const response = await axios.put<Agent>(`${API_URL}/agents/${agentId}`, agent);
    return response.data;
  } catch (error) {
    console.error('Error updating agent:', error);
    throw new Error('Failed to update agent');
  }
};

export const deleteAgent = async (agentId: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/agents/${agentId}`);
  } catch (error) {
    console.error('Error deleting agent:', error);
    throw new Error('Failed to delete agent');
  }
};

export const getAgentTools = async (agentId: string): Promise<AgentTool[]> => {
  try {
    const response = await axios.get<AgentTool[]>(`${API_URL}/agents/${agentId}/tools`);
    return response.data;
  } catch (error) {
    console.error('Error fetching agent tools:', error);
    throw new Error('Failed to fetch agent tools');
  }
};

export const updateAgentTools = async (agentId: string, tools: AgentTool[]): Promise<void> => {
  try {
    await axios.put(`${API_URL}/agents/${agentId}/tools`, tools);
  } catch (error) {
    console.error('Error updating agent tools:', error);
    throw new Error('Failed to update agent tools');
  }
};

export const getAgentMemory = async (agentId: string): Promise<AgentMemory[]> => {
  try {
    const response = await axios.get<AgentMemory[]>(`${API_URL}/agents/${agentId}/memory`);
    return response.data;
  } catch (error) {
    console.error('Error fetching agent memory:', error);
    throw new Error('Failed to fetch agent memory');
  }
};

export const updateAgentMemory = async (agentId: string, memory: AgentMemory[]): Promise<void> => {
  try {
    await axios.put(`${API_URL}/agents/${agentId}/memory`, memory);
  } catch (error) {
    console.error('Error updating agent memory:', error);
    throw new Error('Failed to update agent memory');
  }
};
