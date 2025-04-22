import React from 'react';

const Footer: React.FC = () => (
  <footer className="w-full text-center py-6 text-gray-500 text-sm border-t border-gray-200 bg-white/70 mt-auto">
    &copy; {new Date().getFullYear()} I-Creations. All rights reserved.
  </footer>
);

export default Footer;
