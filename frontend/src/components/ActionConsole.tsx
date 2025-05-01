import type React from 'react';
import { useEffect, useState } from 'react';

interface ActionConsoleProps {
  agentId: string;
}

const ActionConsole: React.FC<ActionConsoleProps> = ({ agentId }) => {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    // Construct the WebSocket URL with the agentId
    const wsUrl = `ws://localhost:8000/ws/agents/${agentId}/execute`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log(`WebSocket connection established for agent ${agentId}`);
      // Optional: Send an initial message or authentication token
    };

    ws.onmessage = (event) => {
      console.log('Message from server:', event.data);
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setMessages((prevMessages) => [...prevMessages, `Error: ${error}`]);
    };

    ws.onclose = (event) => {
      console.log('WebSocket connection closed:', event.code, event.reason);
      setMessages((prevMessages) => [...prevMessages, `Connection closed: ${event.code}`]);
    };

    return () => {
      ws.close();
    };
  }, [agentId]); // Re-run effect if agentId changes

  return (
    <div className="action-console">
      <h2>Action Console (Agent: {agentId})</h2>
      <div className="messages">
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
    </div>
  );
};

export default ActionConsole;
