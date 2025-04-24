import React from 'react';
import Link from 'next/link';

const NavBar: React.FC = () => (
  <nav className="w-full flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur border-b border-gray-200 shadow-sm sticky top-0 z-10">
    <Link href="/" className="text-xl font-bold tracking-tight text-gray-900 hover:text-blue-600 transition">
      I-Creations
    </Link>
    <div className="space-x-6">
      <Link href="/" className="text-gray-700 hover:text-blue-600 transition">Home</Link>
      <Link href="/agents" className="text-gray-700 hover:text-blue-600 transition">Agents</Link>
      <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 transition">Dashboard</Link>
      <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition">Contact</Link>
    </div>
  </nav>
);

export default NavBar;
