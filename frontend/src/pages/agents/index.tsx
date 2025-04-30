    import React, { useState, useEffect } from 'react';
import { getAgents } from '../../services/agentService';
import { Agent } from '../../types/agent';

const AgentListPage: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const data = await getAgents();
        setAgents(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load agents');
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  if (loading) return <div>Loading agents...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Agent List</h1>
      <div className="space-y-4">
        {agents.map(agent => (
          <div key={agent.id} className="p-4 border rounded">
            <h2 className="text-xl font-semibold">{agent.name}</h2>
            <p className="text-gray-600">{agent.description}</p>
            <div className="text-sm text-gray-500 mt-2">
              Created: {agent.createdAt}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentListPage;
