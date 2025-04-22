'use client';

import React, { useState } from 'react';
import { Toast } from "./Toast";

interface Agent {
  id: string;
  name: string;
  description: string;
  type: string;
}

interface TestCase {
  id: string;
  name: string;
  input: string;
  expectedOutput?: string;
  actualOutput?: string;
  status?: 'pending' | 'running' | 'success' | 'failure';
}

const mockAgents: Agent[] = [
  { id: '1', name: 'General Assistant', description: 'A versatile AI assistant', type: 'assistant' },
  { id: '2', name: 'Research Agent', description: 'Specialized in research tasks', type: 'researcher' },
  { id: '3', name: 'Code Helper', description: 'Assists with coding tasks', type: 'coder' },
];

export default function TestingPlayground() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [userInput, setUserInput] = useState<string>('');
  const [agentResponse, setAgentResponse] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [newTestCase, setNewTestCase] = useState<{ name: string; input: string; expectedOutput: string }>({
    name: '',
    input: '',
    expectedOutput: '',
  });
  const [showTestCaseForm, setShowTestCaseForm] = useState<boolean>(false);
  const [errorRate, setErrorRate] = useState<number>(0);
  const [selfCorrectionEnabled, setSelfCorrectionEnabled] = useState<boolean>(true);
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' | 'info' } | null>(null);

  const handleAgentSelect = (agent: Agent) => {
    setSelectedAgent(agent);
    setAgentResponse('');
  };

  const handleSendMessage = () => {
    if (!userInput.trim()) {
      setToast({ message: 'Please enter a message.', type: 'error' });
      return;
    }
    setIsProcessing(true);
    setToast({ message: 'Processing message...', type: 'info' });

    // Simulate agent processing
    setTimeout(() => {
      let response = '';
      if (selectedAgent?.type === 'assistant') {
        response = `I'm your helpful assistant. In response to "${userInput}", I would suggest...`;
      } else if (selectedAgent?.type === 'researcher') {
        response = `Based on my research about "${userInput}", I found the following information...`;
      } else if (selectedAgent?.type === 'coder') {
        response = `Here's a code solution for "${userInput}":\n\n\`\`\`javascript\n// Sample code\nfunction solution() {\n  console.log("Hello world");\n}\n\`\`\``;
      }

      setAgentResponse(response);
      setIsProcessing(false);
      setToast({ message: 'Agent responded.', type: 'success' });
    }, 1500);
  };

  const handleCreateTestCase = () => {
    if (!newTestCase.name || !newTestCase.input) {
      setToast({ message: 'Test case name and input are required.', type: 'error' });
      return;
    }

    const testCase: TestCase = {
      id: Date.now().toString(),
      name: newTestCase.name,
      input: newTestCase.input,
      expectedOutput: newTestCase.expectedOutput,
      status: 'pending'
    };

    setTestCases([...testCases, testCase]);
    setNewTestCase({ name: '', input: '', expectedOutput: '' });
    setShowTestCaseForm(false);
    setToast({ message: 'Test case created.', type: 'success' });
  };

  const handleRunTestCase = (testCase: TestCase) => {
    const updatedTestCases = testCases.map(tc => {
      if (tc.id === testCase.id) {
        return { ...tc, status: 'running' as TestCase['status'] };
      }
      return tc;
    });

    setTestCases(updatedTestCases as TestCase[]);
    setToast({ message: `Running test: ${testCase.name}`, type: 'info' });

    setTimeout(() => {
      const success = Math.random() > 0.3;

      const updatedTestCases = testCases.map(tc => {
        if (tc.id === testCase.id) {
          let actualOutput = '';
          if (selectedAgent?.type === 'assistant') {
            actualOutput = `I'm your helpful assistant. In response to "${tc.input}", I would suggest...`;
          } else if (selectedAgent?.type === 'researcher') {
            actualOutput = `Based on my research about "${tc.input}", I found the following information...`;
          } else if (selectedAgent?.type === 'coder') {
            actualOutput = `Here's a code solution for "${tc.input}":\n\n\`\`\`javascript\n// Sample code\nfunction solution() {\n  console.log("Hello world");\n}\n\`\`\``;
          }

          return { 
            ...tc, 
            status: (success ? 'success' : 'failure') as TestCase['status'],
            actualOutput
          };
        }
        return tc;
      });

      setTestCases(updatedTestCases as TestCase[]);

      const failedTests = updatedTestCases.filter(tc => tc.status === 'failure').length;
      const totalTests = updatedTestCases.length;
      setErrorRate(totalTests > 0 ? (failedTests / totalTests) * 100 : 0);

      setToast({ message: success ? 'Test passed.' : 'Test failed.', type: success ? 'success' : 'error' });
    }, 2000);
  };

  const handleRunAllTests = () => {
    if (testCases.length === 0) {
      setToast({ message: 'No test cases to run.', type: 'error' });
      return;
    }

    setToast({ message: 'Running all test cases...', type: 'info' });

    const updatedTestCases = testCases.map(tc => ({ ...tc, status: 'running' as TestCase['status'] }));
    setTestCases(updatedTestCases as TestCase[]);

    testCases.forEach((testCase, index) => {
      setTimeout(() => {
        handleRunTestCase(testCase);
      }, 1000 * (index + 1));
    });
  };

  const handleToggleSelfCorrection = () => {
    setSelfCorrectionEnabled(!selfCorrectionEnabled);
  };

  const handleResetAgent = () => {
    if (confirm('Are you sure you want to reset this agent? This will clear all learning and customizations.')) {
      setAgentResponse('Agent has been reset to initial state.');
      setToast({ message: 'Agent reset.', type: 'info' });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Testing Playground</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Agent Selection */}
        <div className="md:col-span-1 bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Available Agents</h2>
          <div className="space-y-2">
            {mockAgents.map(agent => (
              <div 
                key={agent.id}
                className={`p-3 rounded-lg cursor-pointer transition ${
                  selectedAgent?.id === agent.id 
                    ? 'bg-blue-100 border-blue-300 border' 
                    : 'hover:bg-gray-100 border border-gray-200'
                }`}
                onClick={() => handleAgentSelect(agent)}
              >
                <h3 className="font-medium">{agent.name}</h3>
                <p className="text-sm text-gray-600">{agent.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Conversation Area */}
        <div className="md:col-span-3 flex flex-col">
          {selectedAgent ? (
            <>
              <div className="bg-white rounded-lg shadow p-4 mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Testing: {selectedAgent.name}</h2>
                  <div className="flex space-x-2">
                    <button 
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                      onClick={handleResetAgent}
                    >
                      Reset Agent
                    </button>
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="selfCorrection" 
                        checked={selfCorrectionEnabled}
                        onChange={handleToggleSelfCorrection}
                        className="mr-2"
                      />
                      <label htmlFor="selfCorrection" className="text-sm">Self-correction</label>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto mb-4">
                  {agentResponse ? (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="whitespace-pre-wrap">{agentResponse}</p>
                    </div>
                  ) : (
                    <div className="text-gray-500 text-center h-full flex items-center justify-center">
                      <p>Send a message to test the agent</p>
                    </div>
                  )}
                </div>
                
                <div className="flex">
                  <input
                    type="text"
                    className="flex-grow border rounded-l-lg p-2"
                    placeholder="Enter a message to test the agent..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-lg"
                    onClick={handleSendMessage}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : 'Send'}
                  </button>
                </div>
              </div>
              
              {/* Test Cases */}
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Test Cases</h2>
                  <div className="flex space-x-2">
                    <button 
                      className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                      onClick={() => setShowTestCaseForm(!showTestCaseForm)}
                    >
                      {showTestCaseForm ? 'Cancel' : 'Add Test Case'}
                    </button>
                    {testCases.length > 0 && (
                      <button 
                        className="bg-green-500 hover:bg-green-700 text-white text-sm font-medium py-1 px-2 rounded"
                        onClick={handleRunAllTests}
                      >
                        Run All Tests
                      </button>
                    )}
                  </div>
                </div>
                
                {showTestCaseForm && (
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h3 className="font-medium mb-2">New Test Case</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input 
                          type="text"
                          className="w-full border rounded p-2"
                          value={newTestCase.name}
                          onChange={(e) => setNewTestCase({...newTestCase, name: e.target.value})}
                          placeholder="E.g., Basic greeting test"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Input</label>
                        <textarea 
                          className="w-full border rounded p-2"
                          value={newTestCase.input}
                          onChange={(e) => setNewTestCase({...newTestCase, input: e.target.value})}
                          placeholder="Enter test input..."
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Expected Output (Optional)</label>
                        <textarea 
                          className="w-full border rounded p-2"
                          value={newTestCase.expectedOutput}
                          onChange={(e) => setNewTestCase({...newTestCase, expectedOutput: e.target.value})}
                          placeholder="Enter expected output..."
                          rows={2}
                        />
                      </div>
                      <div className="flex justify-end">
                        <button 
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
                          onClick={handleCreateTestCase}
                        >
                          Create Test Case
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {testCases.length > 0 ? (
                  <div>
                    <div className="mb-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Error Rate</h3>
                        <span className={`font-bold ${errorRate > 20 ? 'text-red-500' : 'text-green-500'}`}>
                          {errorRate.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div 
                          className={`h-2.5 rounded-full ${errorRate > 20 ? 'bg-red-500' : 'bg-green-500'}`} 
                          style={{ width: `${errorRate}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {testCases.map(testCase => (
                        <div key={testCase.id} className="border rounded-lg p-3">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium">{testCase.name}</h4>
                            <div className="flex items-center">
                              {testCase.status === 'pending' && (
                                <span className="text-gray-500 text-sm">Pending</span>
                              )}
                              {testCase.status === 'running' && (
                                <span className="text-blue-500 text-sm">Running...</span>
                              )}
                              {testCase.status === 'success' && (
                                <span className="text-green-500 text-sm">Success</span>
                              )}
                              {testCase.status === 'failure' && (
                                <span className="text-red-500 text-sm">Failed</span>
                              )}
                              <button 
                                className="ml-2 text-blue-500 hover:text-blue-700 text-sm"
                                onClick={() => handleRunTestCase(testCase)}
                                disabled={testCase.status === 'running'}
                              >
                                Run
                              </button>
                            </div>
                          </div>
                          <div className="text-sm">
                            <p><span className="font-medium">Input:</span> {testCase.input}</p>
                            {testCase.expectedOutput && (
                              <p><span className="font-medium">Expected:</span> {testCase.expectedOutput}</p>
                            )}
                            {testCase.actualOutput && (
                              <p><span className="font-medium">Actual:</span> {testCase.actualOutput}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500 text-center py-8">
                    <p>No test cases created yet</p>
                    <p className="text-sm">Create test cases to evaluate your agent's performance</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <h2 className="text-xl font-semibold mb-2">Select an Agent</h2>
              <p className="text-gray-600">Choose an agent from the list above to start testing</p>
            </div>
          )}
        </div>
      </div>
      <Toast
        message={toast?.message || ""}
        type={toast?.type}
        onClose={() => setToast(null)}
        duration={toast?.type === 'error' ? 3500 : 2000}
      />
    </div>
  );
}