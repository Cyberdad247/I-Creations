import { useState, useEffect } from 'react';
import { getMemory, updateMemory } from '../services/agentService';
import type { AgentMemory } from '../types/agent';

const AgentMemoryPage: React.FC = () => {
  const [memory, setMemory] = useState<AgentMemory[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchMemory = async () => {
      try {
        const data = await getMemory();
        setMemory(data);
        setLoading(false);
      } catch (error: unknown) {
        setErrorMessage(error instanceof Error ? error.message : 'Failed to fetch memory');
        setLoading(false);
      }
    };

    fetchMemory();
  }, []);

  const handleMemoryChange = (index: number, field: keyof AgentMemory, value: string) => {
    setMemory(memory.map((mem, i) => (i === index ? { ...mem, [field]: value } : mem)));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateMemory(memory);
      setErrorMessage(null);
      // Refresh memory after update
      const updatedMemory = await getMemory();
      setMemory(updatedMemory);
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to update memory');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (errorMessage) {
    return <div className="p-4 text-red-500">Error: {errorMessage}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Agent Memory</h1>
      {memory.map((mem, index) => (
        <div key={mem.key} className="mb-4 p-4 border rounded">
          <div className="mb-2">
            <label htmlFor={`memory-${index}-key`} className="block text-sm font-medium mb-1">
              Memory Key
            </label>
            <input
              id={`memory-${index}-key`}
              type="text"
              className="w-full p-2 border rounded"
              value={memory[index].key}
              onChange={(e) => handleMemoryChange(index, 'key', e.target.value)}
              placeholder="Enter memory key"
            />
          </div>
          <div>
            <label htmlFor={`memory-${index}-value`} className="block text-sm font-medium mb-1">
              Memory Value
            </label>
            <textarea
              id={`memory-${index}-value`}
              className="w-full p-2 border rounded min-h-[100px]"
              value={memory[index].value}
              onChange={(e) => handleMemoryChange(index, 'value', e.target.value)}
              placeholder="Enter memory value"
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={handleSave}
      >
        Save Memory
      </button>
    </div>
  );
};

export default AgentMemoryPage;
