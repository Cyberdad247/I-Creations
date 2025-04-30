import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getAgentTools, updateAgentTools } from '../services/agentService';
import { AgentTool } from '../types/agent';

const AgentToolsPage: React.FC = () => {
  const router = useRouter();
  const { agentId } = router.query;
  const [tools, setTools] = useState<AgentTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgentTools = async () => {
      try {
        const data = await getAgentTools(agentId as string);
        setTools(data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch agent tools');
        setLoading(false);
      }
    };

    if (agentId) {
      fetchAgentTools();
    }
  }, [agentId]);

  const handleToolChange = (index: number, field: keyof AgentTool, value: string) => {
    const updatedTools = [...tools];
    (updatedTools[index] as any)[field] = value;
    setTools(updatedTools);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateAgentTools(agentId as string, tools);
      setError(null);
      // Refresh tools after update
      const updatedTools = await getAgentTools(agentId as string);
      setTools(updatedTools);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update agent tools');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Agent Tools</h1>
      {tools.map((tool, index) => (
        <div key={index} className="mb-4 p-4 border rounded">
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Tool Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={tools[index].name}
              onChange={(e) => handleToolChange(index, 'name', e.target.value)}
              placeholder="Enter tool name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tool Description</label>
            <textarea
              className="w-full p-2 border rounded min-h-[100px]"
              value={tools[index].description}
              onChange={(e) => handleToolChange(index, 'description', e.target.value)}
              placeholder="Enter tool description"
            />
          </div>
        </div>
      ))}
      <button 
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={handleSave}
      >
        Save Tools
      </button>
    </div>
  );
};

export default AgentToolsPage;
