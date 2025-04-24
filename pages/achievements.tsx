import React from 'react';
import Layout from '../Layout';
import Badge from '../Badge';
import { motion } from 'framer-motion';

const AchievementsPage: React.FC = () => {
  const achievements = [
    { label: 'First Agent Created', color: 'bg-yellow-400 text-white', delay: 0 },
    { label: 'Level 3 Unlocked', color: 'bg-blue-500 text-white', delay: 0.1 },
    { label: '10 Agents Managed', color: 'bg-green-500 text-white', delay: 0.2 },
    { label: 'Workflow Master', color: 'bg-purple-500 text-white', delay: 0.3 },
  ];
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Achievements</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {achievements.map((ach, idx) => (
            <motion.div
              key={ach.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: ach.delay, duration: 0.5 }}
              className="flex flex-col items-center bg-white rounded-lg shadow p-6"
            >
              <Badge label={ach.label} colorClass={ach.color} />
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default AchievementsPage;
