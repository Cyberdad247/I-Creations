import { Schema, model, Document } from 'mongoose';
import { AgentLog } from '../models/Agent';

interface AgentLogDocument extends AgentLog, Document {}

const AgentLogSchema = new Schema({
  agentId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  level: { 
    type: String, 
    enum: ['info', 'warning', 'error'], 
    required: true 
  },
  message: { type: String, required: true },
  metadata: { type: Map, of: Schema.Types.Mixed }
});

export default model<AgentLogDocument>('AgentLog', AgentLogSchema);
