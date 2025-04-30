import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getAgentMemory, updateAgentMemory } from '../services/agentService';
import { AgentMemory } from '../types/agent';

const AgentMemoryPage: React.FC = () => {
  const router = useRouter();
  const { agentId } = router.query;
  const [memory, setMemory] = useState<AgentMemory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgentMemory = async () => {
      try {
        const data = await getAgentMemory(agentId as string);
        setMemory(data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch agent memory');
        setLoading(false);
      }
    };

    if (agentId) {
      fetchAgentMemory();
    }
  }, [agentId]);

  const handleMemoryChange = (index: number, field: keyof AgentMemory, value: string) => {
    const updatedMemory = [...memory];
    (updatedMemory[index] as any)[field] = value;
    setMemory(updatedMemory);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateAgentMemory(agentId as string, memory);
      setError(null);
      // Refresh memory after update
      const updatedMemory = await getAgentMemory(agentId as string);
      setMemory(updatedMemory);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update agent memory');
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
      <h1 className="text-2xl font-bold mb-4">Agent Memory</h1>
      {memory.map((mem, index) => (
        <div key={index} className="mb-4 p-4 border rounded">
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Memory Key</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={memory[index].key}
              onChange={(e) => handleMemoryChange(index, 'key', e.target.value)}
              placeholder="Enter memory key"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Memory Value</label>
            <textarea
              className="w-full p-2 border rounded min-h-[100px]"
              value={memory[index].value}
              onChange={(e) => handleMemoryChange(index, 'value', e.target.value)}
              placeholder="Enter memory value"
            />
          </div>
        </div>
      ))}
      <button 
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={handleSave}
      >
        Save Memory
      </button>
    </div>
  );
};

export default AgentMemoryPage;
