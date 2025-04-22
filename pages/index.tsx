import React, { useState } from 'react';
import { Toast } from '../Toast';

export default function HomePage() {
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' | 'info' } | null>(null);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Welcome to I-Creations</h1>
      <p className="mb-6 text-gray-700">Your Agent Creation Ecosystem is ready.</p>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => setToast({ message: 'This is a sample toast notification!', type: 'info' })}
      >
        Show Sample Toast
      </button>
      <Toast
        message={toast?.message || ""}
        type={toast?.type}
        onClose={() => setToast(null)}
        duration={toast?.type === 'error' ? 3500 : 2000}
      />
    </div>
  );
}
