import React from 'react';

const NavBar: React.FC = () => (
  <nav className="w-full flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur border-b border-gray-200 shadow-sm sticky top-0 z-10">
    <div className="text-xl font-bold tracking-tight text-gray-900">I-Creations</div>
    <div className="space-x-6">
      <a href="#" className="text-gray-700 hover:text-blue-600 transition">Home</a>
      <a href="#" className="text-gray-700 hover:text-blue-600 transition">Agents</a>
      <a href="#" className="text-gray-700 hover:text-blue-600 transition">Dashboard</a>
      <a href="#" className="text-gray-700 hover:text-blue-600 transition">Contact</a>
    </div>
  </nav>
);

export default NavBar;
