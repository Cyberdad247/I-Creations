import React, { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NavBar from './NavBar';
import Footer from './Footer';
import { Toast } from './Toast';
import { useRouter } from 'next/router';

const Layout = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);
  const router = useRouter();

  const pageVariants = {
    initial: {
      opacity: 0,
      x: "-100vw"
    },
    in: {
      opacity: 1,
      x: 0
    },
    out: {
      opacity: 0,
      x: "100vw"
    }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 flex flex-col">
      <NavBar />
      <AnimatePresence mode="wait">
        <motion.main
          key={router.pathname}
          variants={pageVariants}
          initial="initial"
          animate="in"
          exit="out"
          transition={pageTransition}
          className="flex-1 flex flex-col items-center justify-center text-center px-4"
        >
          {children}
        </motion.main>
      </AnimatePresence>
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
