import { Schema, model, Document } from 'mongoose';
import { User } from '../models/User';

interface UserDocument extends User, Document {}

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { 
    type: String, 
    enum: ['admin', 'developer', 'viewer'], 
    default: 'viewer' 
  },
  status: { 
    type: String, 
    enum: ['active', 'inactive'], 
    default: 'active' 
  },
  lastLogin: { type: Date }
}, { 
  timestamps: true 
});

export default model<UserDocument>('User', UserSchema);
