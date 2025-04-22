export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'developer' | 'viewer';
  status: 'active' | 'inactive';
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  roles: ('admin' | 'developer' | 'viewer')[];
}

export interface FailsafeSettings {
  requireApproval: boolean;
  notifyOnReset: boolean;
  autoLockThreshold: number;
}
