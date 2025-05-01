import React, { useState, useEffect } from 'react';
// Import service functions for interacting with the backend agent API
import { getAgents, executeAgent } from '../services/agentService';
// Import the ActionConsole component for displaying agent execution output
import ActionConsole from '../components/ActionConsole';

// Define the Agent interface (assuming it's defined elsewhere, e.g., in a types file)
// interface Agent {
//   id: string;
//   name: string;
//   description: string;
//   createdAt: string; // Or Date type if parsed
//   // Add other agent properties as needed
// }

// AgentsPage component to display and manage AI agents
export default function AgentsPage() {
  // State to store the list of agents
  const [agents, setAgents] = useState<Agent[]>([]);
  // State to manage loading state while fetching agents
  const [loading, setLoading] = useState(true);
  // State to store any error that occurs during data fetching
  const [error, setError] = useState<string | null>(null);
  // State to track the ID of the agent currently being executed
  const [executingAgentId, setExecutingAgentId] = useState<string | null>(null);

  // Handler function to execute a specific agent
  const handleExecuteAgent = async (agentId: string) => {
    try {
      // Call the backend API to execute the agent
      await executeAgent(agentId);
      // Set the agent ID being executed to display the ActionConsole
      setExecutingAgentId(agentId);
    } catch (error) {
      console.error('Error executing agent:', error);
      // TODO: Implement user-friendly error display (e.g., a toast notification)
    }
  };

  // useEffect hook to fetch agents when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the list of agents from the backend
        const data = await getAgents();
        // Update the agents state with the fetched data
        setAgents(data);
      } catch (err) {
        // Catch and set any errors that occur during fetching
        setError(err instanceof Error ? err.message : 'Failed to load agents');
      } finally {
        // Set loading to false once fetching is complete (either success or error)
        setLoading(false);
      }
    };
    // Call the fetchData function
    fetchData();
  }, []); // The empty dependency array ensures this effect runs only once on mount

  // Display loading message while data is being fetched
  if (loading) return <div>Loading...</div>;
  // Display error message if fetching failed
  if (error) return <div>Error: {error}</div>;

  // Render the list of agents and the ActionConsole if an agent is being executed
  return (
    <div>
      <h1>Agents</h1>
      {/* List of agents */}
      <ul>
        {agents.map((agent) => (
          <li key={agent.id}>
            <h2>{agent.name}</h2>
            <p>{agent.description}</p>
            <small>Created: {agent.createdAt}</small>
            {/* Button to execute the agent */}
            <button type="button" onClick={() => handleExecuteAgent(agent.id)}>
              Execute
            </button>
          </li>
        ))}
      </ul>
      {/* Render ActionConsole if an agent is being executed */}
      {executingAgentId && <ActionConsole agentId={executingAgentId} />}
    </div>
  );
}
