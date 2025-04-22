import { Schema, model, Document } from 'mongoose';
import { FailsafeSettings } from '../models/User';

interface FailsafeSettingsDocument extends FailsafeSettings, Document {}

const FailsafeSettingsSchema = new Schema({
  requireApproval: { type: Boolean, default: true },
  notifyOnReset: { type: Boolean, default: true },
  autoLockThreshold: { type: Number, default: 3 }
});

export default model<FailsafeSettingsDocument>('FailsafeSettings', FailsafeSettingsSchema);
