import { Schema, model, Document } from 'mongoose';
import { Agent, AgentProperty } from '../models/Agent';

interface AgentDocument extends Agent, Document {}

const AgentPropertySchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['text', 'number', 'boolean', 'select'], required: true },
  value: { type: Schema.Types.Mixed, required: true },
  options: { type: [String] }
});

const AgentSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  properties: { type: [AgentPropertySchema], required: true },
  customCode: { type: String },
  status: { 
    type: String, 
    enum: ['online', 'offline', 'error'], 
    default: 'offline' 
  },
  errorRate: { type: Number, default: 0 },
  requestsPerHour: { type: Number, default: 0 },
  averageResponseTime: { type: Number, default: 0 },
  memoryUsage: { type: Number, default: 0 },
  lastActive: { type: Date },
  createdBy: { type: String, required: true }
}, { 
  timestamps: true 
});

export default model<AgentDocument>('Agent', AgentSchema);
