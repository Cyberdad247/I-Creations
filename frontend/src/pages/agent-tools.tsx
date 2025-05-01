import { useState, useEffect } from 'react';
import { getTools, updateTools } from '../services/agentService';
import { AgentTool } from '../types/agent';

const AgentToolsPage: React.FC = () => {
  const [tools, setTools] = useState<AgentTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const data = await getTools();
        setTools(data);
        setLoading(false);
      } catch (error: unknown) {
        setErrorMessage(error instanceof Error ? error.message : 'Failed to fetch tools');
        setLoading(false);
      }
    };

    fetchTools();
  }, []);

  const handleToolChange = (index: number, field: keyof AgentTool, value: string) => {
    const updatedTools = [...tools];
    (updatedTools[index] as AgentTool)[field] = value;
    setTools(updatedTools);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateTools(tools);
      setErrorMessage(null);
      // Refresh tools after update
      const updatedTools = await getTools();
      setTools(updatedTools);
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to update tools');
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
      <h1 className="text-2xl font-bold mb-4">Agent Tools</h1>
      {tools.map((tool, index) => (
        <div key={tool.name} className="mb-4 p-4 border rounded">
          <div className="mb-2">
            <label htmlFor={`tool-${index}-name`} className="block text-sm font-medium mb-1">
              Tool Name
            </label>
            <input
              id={`tool-${index}-name`}
              type="text"
              className="w-full p-2 border rounded"
              value={tools[index].name}
              onChange={(e) => handleToolChange(index, 'name', e.target.value)}
              placeholder="Enter tool name"
            />
          </div>
          <div>
            <label htmlFor={`tool-${index}-description`} className="block text-sm font-medium mb-1">
              Tool Description
            </label>
            <textarea
              id={`tool-${index}-description`}
              className="w-full p-2 border rounded min-h-[100px]"
              value={tools[index].description}
              onChange={(e) => handleToolChange(index, 'description', e.target.value)}
              placeholder="Enter tool description"
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={handleSave}
      >
        Save Tools
      </button>
    </div>
  );
};

export default AgentToolsPage;
