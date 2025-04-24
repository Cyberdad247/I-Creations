import mongoose from 'mongoose';

const AgentLogSchema = new mongoose.Schema({
  agentId: String,
  level: String,
  message: String,
  metadata: Object,
  createdAt: { type: Date, default: Date.now }
});

// Minimal implementation of methods used in AdvancedErrorCorrectionService
AgentLogSchema.statics.create = async function(logData: any) {
  return this.insertMany([logData]);
};

const AgentLogModel = mongoose.model('AgentLog', AgentLogSchema);

export default AgentLogModel;
