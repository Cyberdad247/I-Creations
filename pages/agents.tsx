import React from 'react';
import Layout from '../Layout';
import ProgressBar from '../ProgressBar';
import Badge from '../Badge';
import { motion } from 'framer-motion';

const AgentsPage: React.FC = () => {
  return (
    <Layout>
      <h1 className="text-4xl font-extrabold mb-4 text-gray-900">Agents</h1>
      <div className="mb-8 flex flex-col items-center">
        <ProgressBar progress={60} colorClass="bg-blue-600" />
        <span className="text-sm text-gray-700 mt-2">Agent Creation Progress: 60%</span>
        <div className="mt-4 flex gap-2">
          <Badge label="Novice Creator" colorClass="bg-green-500 text-white" />
          <Badge label="Badge: Explorer" colorClass="bg-yellow-400 text-white" />
        </div>
      </div>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.li
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.05, boxShadow: '0 8px 32px rgba(59,130,246,0.15)' }}
          className="bg-white rounded-lg shadow p-6 flex flex-col items-center cursor-pointer"
        >
          <span className="text-2xl font-bold text-blue-600 mb-2">Agent Alpha</span>
          <span className="text-gray-600 mb-2">Type: Chatbot</span>
          <Badge label="Level 3" colorClass="bg-blue-100 text-blue-700" />
        </motion.li>
        <motion.li
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          whileHover={{ scale: 1.05, boxShadow: '0 8px 32px rgba(16,185,129,0.15)' }}
          className="bg-white rounded-lg shadow p-6 flex flex-col items-center cursor-pointer"
        >
          <span className="text-2xl font-bold text-green-600 mb-2">Agent Beta</span>
          <span className="text-gray-600 mb-2">Type: Assistant</span>
          <Badge label="Level 2" colorClass="bg-green-100 text-green-700" />
        </motion.li>
      </ul>
    </Layout>
  );
};

export default AgentsPage;
