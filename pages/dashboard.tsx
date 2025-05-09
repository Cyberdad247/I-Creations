import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../Layout';
import { motion } from 'framer-motion';
import { isAuthenticated } from '../services/auth';

const DashboardPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  // Example gaming-style UI: leaderboard, achievements, and stats
  return (
    <Layout>
      <h1 className="text-4xl font-extrabold mb-4 text-gray-900">Dashboard</h1>
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/agents">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.04, boxShadow: '0 8px 32px rgba(59,130,246,0.12)' }}
            className="bg-white rounded-lg shadow p-6 flex flex-col items-center cursor-pointer"
          >
            <span className="text-lg font-bold text-blue-600 mb-2">Leaderboard</span>
            <ol className="list-decimal pl-4 text-left w-full">
              <li className="font-semibold text-green-600">You (Level 3)</li>
              <li>Agent Alpha</li>
              <li>Agent Beta</li>
            </ol>
          </motion.div>
        </Link>
        <Link href="/achievements">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            whileHover={{ scale: 1.04, boxShadow: '0 8px 32px rgba(234,179,8,0.12)' }}
            className="bg-white rounded-lg shadow p-6 flex flex-col items-center cursor-pointer"
          >
            <span className="text-lg font-bold text-yellow-500 mb-2">Achievements</span>
            <ul className="flex flex-col gap-2">
              <li className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                First Agent Created
              </li>
              <li className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Reached Level 3</li>
            </ul>
          </motion.div>
        </Link>
        <Link href="/agents">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            whileHover={{ scale: 1.04, boxShadow: '0 8px 32px rgba(168,85,247,0.12)' }}
            className="bg-white rounded-lg shadow p-6 flex flex-col items-center cursor-pointer"
          >
            <span className="text-lg font-bold text-purple-600 mb-2">Stats</span>
            <div className="text-2xl font-extrabold">3</div>
            <div className="text-gray-600">Agents Created</div>
          </motion.div>
        </Link>
      </div>
    </Layout>
  );
};

export default DashboardPage;
