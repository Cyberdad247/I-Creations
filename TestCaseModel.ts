import { Schema, model, Document } from 'mongoose';
import { TestCase } from '../models/TestCase';

interface TestCaseDocument extends TestCase, Document {}

const TestCaseSchema = new Schema({
  name: { type: String, required: true },
  agentId: { type: String, required: true },
  input: { type: String, required: true },
  expectedOutput: { type: String },
  actualOutput: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'running', 'success', 'failure'], 
    default: 'pending' 
  },
  createdBy: { type: String, required: true }
}, { 
  timestamps: true 
});

export default model<TestCaseDocument>('TestCase', TestCaseSchema);
