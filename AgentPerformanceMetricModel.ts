import { AgentPerformanceMetric } from '../models/Agent';
import { Schema, model, Document } from 'mongoose';

interface AgentPerformanceMetricDocument extends AgentPerformanceMetric, Document {}

const AgentPerformanceMetricSchema = new Schema({
  agentId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  errorRate: { type: Number, required: true },
  requestsPerHour: { type: Number, required: true },
  responseTime: { type: Number, required: true },
  memoryUsage: { type: Number, required: true }
});

export default model<AgentPerformanceMetricDocument>('AgentPerformanceMetric', AgentPerformanceMetricSchema);
