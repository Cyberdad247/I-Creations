import React, { useEffect, useState } from 'react';

interface AgentLog {
  _id: string;
  timestamp: string;
  agentName: string;
  provider: string;
  message: string;
}

function formatDate(date: string) {
  return new Date(date).toLocaleString();
}

export default function MonitoringDashboard() {
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [providerFilter, setProviderFilter] = useState('');
  const [agentFilter, setAgentFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  useEffect(() => {
    // Fetch logs from backend API
    fetch('/api/logs')
      .then(res => res.json())
      .then(data => setLogs(data.logs || []));
  }, []);

  // Date filtering
  const filteredByDate = logs.filter(log => {
    const logDate = new Date(log.timestamp).getTime();
    const start = startDate ? new Date(startDate).getTime() : -Infinity;
    const end = endDate ? new Date(endDate).getTime() : Infinity;
    return logDate >= start && logDate <= end;
  });

  // Provider/agent filtering
  const filteredLogs = filteredByDate.filter(log =>
    (!providerFilter || log.provider === providerFilter) &&
    (!agentFilter || log.agentName === agentFilter)
  );

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / pageSize);
  const paginatedLogs = filteredLogs.slice((page - 1) * pageSize, page * pageSize);

  const uniqueProviders = Array.from(new Set(logs.map(l => l.provider)));
  const uniqueAgents = Array.from(new Set(logs.map(l => l.agentName)));

  // Advanced analytics
  const providerCounts = uniqueProviders.map(provider => ({
    provider,
    count: filteredByDate.filter(log => log.provider === provider).length
  }));
  const agentCounts = uniqueAgents.map(agent => ({
    agent,
    count: filteredByDate.filter(log => log.agentName === agent).length
  }));

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Monitoring Dashboard</h1>
      <div className="flex flex-wrap gap-4 mb-4 items-end">
        <select value={agentFilter} onChange={e => { setAgentFilter(e.target.value); setPage(1); }} className="border rounded px-2 py-1">
          <option value="">All Agents</option>
          {uniqueAgents.map(agent => (
            <option key={agent} value={agent}>{agent}</option>
          ))}
        </select>
        <select value={providerFilter} onChange={e => { setProviderFilter(e.target.value); setPage(1); }} className="border rounded px-2 py-1">
          <option value="">All Providers</option>
          {uniqueProviders.map(provider => (
            <option key={provider} value={provider}>{provider}</option>
          ))}
        </select>
        <label className="text-sm">From:
          <input type="date" value={startDate} onChange={e => { setStartDate(e.target.value); setPage(1); }} className="ml-1 border rounded px-2 py-1" />
        </label>
        <label className="text-sm">To:
          <input type="date" value={endDate} onChange={e => { setEndDate(e.target.value); setPage(1); }} className="ml-1 border rounded px-2 py-1" />
        </label>
      </div>
      {/* Advanced Analytics */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-2">Provider Usage</h2>
          <ul>
            {providerCounts.map(pc => (
              <li key={pc.provider} className="flex justify-between"><span>{pc.provider}</span><span>{pc.count}</span></li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-2">Agent Activity</h2>
          <ul>
            {agentCounts.map(ac => (
              <li key={ac.agent} className="flex justify-between"><span>{ac.agent}</span><span>{ac.count}</span></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Timestamp</th>
              <th className="px-4 py-2 text-left">Agent Name</th>
              <th className="px-4 py-2 text-left">Provider</th>
              <th className="px-4 py-2 text-left">Message</th>
            </tr>
          </thead>
          <tbody>
            {paginatedLogs.map(log => (
              <tr key={log._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 whitespace-nowrap">{formatDate(log.timestamp)}</td>
                <td className="px-4 py-2 whitespace-nowrap">{log.agentName}</td>
                <td className="px-4 py-2 whitespace-nowrap font-semibold text-blue-600">{log.provider}</td>
                <td className="px-4 py-2">{log.message}</td>
              </tr>
            ))}
            {paginatedLogs.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-400">No logs found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 rounded border bg-gray-100 disabled:opacity-50">Prev</button>
        <span>Page {page} of {totalPages || 1}</span>
        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages || totalPages === 0} className="px-3 py-1 rounded border bg-gray-100 disabled:opacity-50">Next</button>
      </div>
    </div>
  );
}