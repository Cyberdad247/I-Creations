export interface Agent {
  id: string;
  name: string;
  description: string;
  type: string;
  properties: AgentProperty[];
  customCode?: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'online' | 'offline' | 'error';
  errorRate: number;
  requestsPerHour: number;
  averageResponseTime: number;
  memoryUsage: number;
  lastActive?: Date;
  createdBy: string;
}

export interface AgentProperty {
  id: string;
  name: string;
  type: 'text' | 'number' | 'boolean' | 'select';
  value: string | number | boolean;
  options?: string[];
}

export interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  properties: AgentProperty[];
}

export interface AgentPerformanceMetric {
  agentId: string;
  timestamp: Date;
  errorRate: number;
  requestsPerHour: number;
  responseTime: number;
  memoryUsage: number;
}

export interface AgentLog {
  id: string;
  agentId: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error';
  message: string;
  metadata?: Record<string, any>;
}
