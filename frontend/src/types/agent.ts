export interface Agent {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface AgentCreate {
  name: string;
  description: string;
}

export interface AgentUpdate {
  name?: string;
  description?: string;
}

export interface AgentTool {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export interface AgentMemory {
  key: string;
  value: string;
}
