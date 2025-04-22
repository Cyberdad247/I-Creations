import React, { ReactNode, useState } from 'react';
import NavBar from './NavBar';
import Footer from './Footer';
import { Toast } from './Toast';

const Layout = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  // Example: Expose a showToast function via context for global use (can be expanded)
  // For now, just render Toast if needed

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 flex flex-col">
      <NavBar />
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        {children}
      </main>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          duration={3000}
        />
      )}
      <Footer />
    </div>
  );
};

export default Layout;
