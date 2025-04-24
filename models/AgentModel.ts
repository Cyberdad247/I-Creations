import mongoose from 'mongoose';

const AgentSchema = new mongoose.Schema({
  id: String,
  name: String,
  refreshToken: String,
  refreshTokenExpires: Date,
  lastLogin: Date
});

// Minimal implementation of methods used in AdvancedErrorCorrectionService
AgentSchema.statics.findById = async function(id: string) {
  return this.findOne({ id });
};

const AgentModel = mongoose.model('Agent', AgentSchema);

export default AgentModel;
