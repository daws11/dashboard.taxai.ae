
import React, { useState } from 'react';

const AIAgentSelector: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<'voice' | 'chat' | null>(null);

  const agents = [
    {
      id: 'voice' as const,
      name: 'Voice Agent',
      description: 'AI-powered voice assistant for natural conversations',
      status: 'active'
    },
    {
      id: 'chat' as const,
      name: 'Chat Agent',
      description: 'Text-based AI assistant for instant messaging',
      status: 'inactive'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-blue-100 dark:border-gray-700 transition-colors duration-300">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">AI Agent Selection</h2>
      <div className="space-y-4">
        {agents.map((agent) => (
          <div 
            key={agent.id}
            className={`p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${
              selectedAgent === agent.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500'
            }`}
            onClick={() => setSelectedAgent(agent.id)}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-900 dark:text-white">{agent.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                agent.status === 'active'
                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}>
                {agent.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{agent.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIAgentSelector;
