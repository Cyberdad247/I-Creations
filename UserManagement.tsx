'use client';

import React, { useState } from 'react';
import { Toast } from "./Toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'developer' | 'viewer';
  status: 'active' | 'inactive';
  lastLogin: string;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  roles: ('admin' | 'developer' | 'viewer')[];
}

// Mock data for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2025-04-05T10:30:00Z'
  },
  {
    id: '2',
    name: 'Developer One',
    email: 'dev1@example.com',
    role: 'developer',
    status: 'active',
    lastLogin: '2025-04-05T09:15:00Z'
  },
  {
    id: '3',
    name: 'Developer Two',
    email: 'dev2@example.com',
    role: 'developer',
    status: 'inactive',
    lastLogin: '2025-04-01T14:20:00Z'
  },
  {
    id: '4',
    name: 'Viewer User',
    email: 'viewer@example.com',
    role: 'viewer',
    status: 'active',
    lastLogin: '2025-04-04T16:45:00Z'
  }
];

const mockPermissions: Permission[] = [
  {
    id: '1',
    name: 'Create Agents',
    description: 'Ability to create new agents',
    roles: ['admin', 'developer']
  },
  {
    id: '2',
    name: 'Edit Agents',
    description: 'Ability to modify existing agents',
    roles: ['admin', 'developer']
  },
  {
    id: '3',
    name: 'Delete Agents',
    description: 'Ability to delete agents',
    roles: ['admin']
  },
  {
    id: '4',
    name: 'View Agents',
    description: 'Ability to view agent details',
    roles: ['admin', 'developer', 'viewer']
  },
  {
    id: '5',
    name: 'Manage Users',
    description: 'Ability to add, edit, and remove users',
    roles: ['admin']
  },
  {
    id: '6',
    name: 'Configure System',
    description: 'Ability to modify system settings',
    roles: ['admin']
  },
  {
    id: '7',
    name: 'Reset Agents',
    description: 'Ability to reset agents to initial state',
    roles: ['admin', 'developer']
  }
];

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showAddUserForm, setShowAddUserForm] = useState<boolean>(false);
  const [newUser, setNewUser] = useState<Omit<User, 'id' | 'lastLogin'>>({
    name: '',
    email: '',
    role: 'viewer',
    status: 'active'
  });
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [failsafeSettings, setFailsafeSettings] = useState({
    requireApproval: true,
    notifyOnReset: true,
    autoLockThreshold: 3
  });
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' | 'info' } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
  };

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      setToast({ message: 'Name and email are required.', type: 'error' });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const user: User = {
        id: Date.now().toString(),
        ...newUser,
        lastLogin: 'Never'
      };
      setUsers([...users, user]);
      setNewUser({
        name: '',
        email: '',
        role: 'viewer',
        status: 'active'
      });
      setShowAddUserForm(false);
      setToast({ message: 'User added successfully!', type: 'success' });
      setLoading(false);
    }, 800);
  };

  const handleUpdateUser = (field: keyof User, value: string) => {
    if (!selectedUser) return;
    setLoading(true);
    const updatedUser = { ...selectedUser, [field]: value };
    setSelectedUser(updatedUser);
    const updatedUsers = users.map(user =>
      user.id === selectedUser.id ? updatedUser : user
    );
    setUsers(updatedUsers);
    setTimeout(() => {
      setToast({ message: 'User updated.', type: 'success' });
      setLoading(false);
    }, 600);
  };

  const handleDeleteUser = () => {
    if (!selectedUser) return;

    if (confirm(`Are you sure you want to delete ${selectedUser.name}?`)) {
      setLoading(true);
      setTimeout(() => {
        const updatedUsers = users.filter(user => user.id !== selectedUser.id);
        setUsers(updatedUsers);
        setSelectedUser(null);
        setToast({ message: 'User deleted.', type: 'success' });
        setLoading(false);
      }, 800);
    }
  };

  const handleFailsafeSettingChange = (setting: keyof typeof failsafeSettings, value: any) => {
    setFailsafeSettings({
      ...failsafeSettings,
      [setting]: value
    });
    setToast({ message: 'Failsafe setting updated.', type: 'info' });
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper function to format date
  const formatDate = (dateString: string) => {
    if (dateString === 'Never') return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User List */}
        <div className="md:col-span-1 bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Users</h2>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-medium py-1 px-2 rounded"
              onClick={() => setShowAddUserForm(!showAddUserForm)}
            >
              {showAddUserForm ? 'Cancel' : 'Add User'}
            </button>
          </div>

          <div className="mb-4">
            <input
              type="text"
              className="w-full border rounded p-2"
              placeholder="Search users..."
              title="Search Users"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {showAddUserForm && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="font-medium mb-2">New User</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    className="w-full border rounded p-2"
                    placeholder="Enter user name"
                    title="User Name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full border rounded p-2"
                    placeholder="Enter email address"
                    title="Email Address"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <select
                    className="w-full border rounded p-2"
                    title="User Role"
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                  >
                    <option value="admin">Admin</option>
                    <option value="developer">Developer</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>
                <div className="flex justify-end">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
                    onClick={handleAddUser}
                    disabled={loading}
                  >
                    {loading ? 'Adding...' : 'Add User'}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <div
                  key={user.id}
                  className={`p-3 rounded-lg cursor-pointer transition ${
                    selectedUser?.id === user.id
                      ? 'bg-blue-100 border-blue-300 border'
                      : 'hover:bg-gray-100 border border-gray-200'
                  }`}
                  onClick={() => handleUserSelect(user)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{user.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{user.role}</span>
                    <span>Last login: {formatDate(user.lastLogin)}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-center py-4">
                <p>No users found</p>
              </div>
            )}
          </div>
        </div>

        {/* User Details */}
        <div className="md:col-span-2">
          {selectedUser ? (
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">User Details</h2>
                <button
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                  onClick={handleDeleteUser}
                  disabled={loading}
                >
                  {loading ? 'Deleting...' : 'Delete User'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-medium mb-3">Profile Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Name</label>
                      <input
                        type="text"
                        className="w-full border rounded p-2"
                        placeholder="Enter user name"
                        title="User Name"
                        value={selectedUser.name}
                        onChange={(e) => handleUpdateUser('name', e.target.value)}
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <input
                        type="email"
                        className="w-full border rounded p-2"
                        placeholder="Enter email address"
                        title="Email Address"
                        value={selectedUser.email}
                        onChange={(e) => handleUpdateUser('email', e.target.value)}
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Role</label>
                      <select
                        className="w-full border rounded p-2"
                        title="User Role"
                        value={selectedUser.role}
                        onChange={(e) => handleUpdateUser('role', e.target.value)}
                        disabled={loading}
                      >
                        <option value="admin">Admin</option>
                        <option value="developer">Developer</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Status</label>
                      <select
                        className="w-full border rounded p-2"
                        title="User Status"
                        value={selectedUser.status}
                        onChange={(e) => handleUpdateUser('status', e.target.value)}
                        disabled={loading}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Permissions</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-3">
                      Permissions are assigned based on user role. The following permissions are available for the {selectedUser.role} role:
                    </p>
                    <div className="space-y-2">
                      {mockPermissions
                        .filter(permission => permission.roles.includes(selectedUser.role))
                        .map(permission => (
                          <div key={permission.id} className="flex items-center">
                            <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <div>
                              <p className="font-medium text-sm">{permission.name}</p>
                              <p className="text-xs text-gray-500">{permission.description}</p>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Activity Log</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Last login</span>
                      <span className="text-sm font-medium">{formatDate(selectedUser.lastLogin)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Account created</span>
                      <span className="text-sm font-medium">April 1, 2025</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Password last changed</span>
                      <span className="text-sm font-medium">Never</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <h2 className="text-xl font-semibold mb-2">Select a User</h2>
              <p className="text-gray-600">Choose a user from the list to view and edit details</p>
            </div>
          )}

          {/* Failsafe Settings */}
          <div className="bg-white rounded-lg shadow p-4 mt-6">
            <h2 className="text-xl font-semibold mb-4">Human Failsafe Controls</h2>
            <p className="text-gray-600 mb-4">
              Configure the human failsafe mechanisms that provide oversight and control over the agent platform.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">Approval Settings</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="requireApproval"
                      checked={failsafeSettings.requireApproval}
                      onChange={(e) => handleFailsafeSettingChange('requireApproval', e.target.checked)}
                      className="mr-2"
                    />
                    <label htmlFor="requireApproval">Require admin approval for critical agent changes</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="notifyOnReset"
                      checked={failsafeSettings.notifyOnReset}
                      onChange={(e) => handleFailsafeSettingChange('notifyOnReset', e.target.checked)}
                      className="mr-2"
                    />
                    <label htmlFor="notifyOnReset">Notify admin on agent reset</label>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-3">Lock Settings</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Auto-lock threshold</label>
                    <input
                      type="number"
                      className="w-full border rounded p-2"
                      value={failsafeSettings.autoLockThreshold}
                      onChange={(e) => handleFailsafeSettingChange('autoLockThreshold', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Toast
        message={toast?.message || ""}
        type={toast?.type}
        onClose={() => setToast(null)}
        duration={toast?.type === 'error' ? 3500 : 2000}
      />
    </div>
  );
}