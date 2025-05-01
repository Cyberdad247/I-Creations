import axios from 'axios';
import type { Agent, AgentTool, AgentMemory, AgentCreate, AgentUpdate } from '../types/agent';
import { getToken } from '../../../services/auth'; // Corrected import path

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Add a request interceptor to include the token
axios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers = config.headers || {}; // Initialize headers if undefined
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Core Agent CRUD Operations
export const getAgents = async (): Promise<Agent[]> => {
  try {
    const response = await axios.get<Agent[]>(`${API_URL}/agents`);
    return response.data;
  } catch (error: unknown) {
    console.error('Error fetching agents:', error.message, error.response?.data);
    // TODO: Display user-friendly error message in the UI
    // TODO: Integrate with a client-side logging service (e.g., Sentry, Datadog)
    throw new Error(error.response?.data?.message || 'Failed to fetch agents');
  }
};

export const getAgent = async (agentId: string): Promise<Agent> => {
  try {
    const response = await axios.get<Agent>(`${API_URL}/agents/${agentId}`);
    return response.data;
  } catch (error: unknown) {
    console.error('Error fetching agent:', error.message, error.response?.data);
    // TODO: Display user-friendly error message in the UI
    // TODO: Integrate with a client-side logging service (e.g., Sentry, Datadog)
    throw new Error(error.response?.data?.message || 'Failed to fetch agent');
  }
};

export const createAgent = async (agent: AgentCreate): Promise<Agent> => {
  try {
    const response = await axios.post<Agent>(`${API_URL}/agents`, agent);
    return response.data;
  } catch (error: unknown) {
    console.error('Error creating agent:', error.message, error.response?.data);
    // TODO: Display user-friendly error message in the UI
    // TODO: Integrate with a client-side logging service (e.g., Sentry, Datadog)
    throw new Error(error.response?.data?.message || 'Failed to create agent');
  }
};

export const updateAgent = async (agentId: string, agent: AgentUpdate): Promise<Agent> => {
  try {
    const response = await axios.put<Agent>(`${API_URL}/agents/${agentId}`, agent);
    return response.data;
  } catch (error: unknown) {
    console.error('Error updating agent:', error.message, error.response?.data);
    // TODO: Display user-friendly error message in the UI
    // TODO: Integrate with a client-side logging service (e.g., Sentry, Datadog)
    throw new Error(error.response?.data?.message || 'Failed to update agent');
  }
};

export const deleteAgent = async (agentId: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/agents/${agentId}`);
  } catch (error: unknown) {
    console.error('Error deleting agent:', error.message, error.response?.data);
    // TODO: Display user-friendly error message in the UI
    // TODO: Integrate with a client-side logging service (e.g., Sentry, Datadog)
    throw new Error(error.response?.data?.message || 'Failed to delete agent');
  }
};

export const getTools = async (): Promise<AgentTool[]> => {
  try {
    const response = await axios.get<AgentTool[]>(`${API_URL}/api/v1/tools`);
    return response.data;
  } catch (error: unknown) {
    console.error('Error fetching tools:', error.message, error.response?.data);
    // TODO: Display user-friendly error message in the UI
    // TODO: Integrate with a client-side logging service (e.g., Sentry, Datadog)
    throw new Error(error.response?.data?.message || 'Failed to fetch tools');
  }
};

export const updateTools = async (tools: AgentTool[]): Promise<void> => {
  try {
    await axios.put(`${API_URL}/api/v1/tools`, tools);
  } catch (error: unknown) {
    console.error('Error updating tools:', error.message, error.response?.data);
    // TODO: Display user-friendly error message in the UI
    // TODO: Integrate with a client-side logging service (e.g., Sentry, Datadog)
    throw new Error(error.response?.data?.message || 'Failed to update tools');
  }
};

export const getMemory = async (): Promise<AgentMemory[]> => {
  try {
    const response = await axios.get<AgentMemory[]>(`${API_URL}/api/v1/memory`);
    return response.data;
  } catch (error: unknown) {
    console.error('Error fetching memory:', error.message, error.response?.data);
    // TODO: Display user-friendly error message in the UI
    // TODO: Integrate with a client-side logging service (e.g., Sentry, Datadog)
    throw new Error(error.response?.data?.message || 'Failed to fetch memory');
  }
};

export const updateMemory = async (memory: AgentMemory[]): Promise<void> => {
  try {
    await axios.put(`${API_URL}/api/v1/memory`, memory);
  } catch (error: unknown) {
    console.error('Error updating memory:', error.message, error.response?.data);
    // TODO: Display user-friendly error message in the UI
    // TODO: Integrate with a client-side logging service (e.g., Sentry, Datadog)
    throw new Error(error.response?.data?.message || 'Failed to update memory');
  }
};
