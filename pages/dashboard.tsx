import React from 'react';
import Layout from '../Layout';

const DashboardPage: React.FC = () => {
  // Example gaming-style UI: leaderboard, achievements, and stats
  return (
    <Layout>
      <h1 className="text-4xl font-extrabold mb-4 text-gray-900">Dashboard</h1>
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-lg font-bold text-blue-600 mb-2">Leaderboard</span>
          <ol className="list-decimal pl-4 text-left w-full">
            <li className="font-semibold text-green-600">You (Level 3)</li>
            <li>Agent Alpha</li>
            <li>Agent Beta</li>
          </ol>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-lg font-bold text-yellow-500 mb-2">Achievements</span>
          <ul className="flex flex-col gap-2">
            <li className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">First Agent Created</li>
            <li className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Reached Level 3</li>
          </ul>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-lg font-bold text-purple-600 mb-2">Stats</span>
          <div className="text-2xl font-extrabold">3</div>
          <div className="text-gray-600">Agents Created</div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
