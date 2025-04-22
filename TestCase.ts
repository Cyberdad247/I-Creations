export interface TestCase {
  id: string;
  name: string;
  agentId: string;
  input: string;
  expectedOutput?: string;
  actualOutput?: string;
  status: 'pending' | 'running' | 'success' | 'failure';
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface TestResult {
  id: string;
  testCaseId: string;
  agentId: string;
  timestamp: Date;
  success: boolean;
  input: string;
  expectedOutput?: string;
  actualOutput: string;
  executionTime: number;
  metadata?: Record<string, any>;
}
