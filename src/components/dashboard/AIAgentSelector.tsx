
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { MessageCircle, Mic } from 'lucide-react';

const AIAgentSelector: React.FC = () => {
  const [agents, setAgents] = useState([
    {
      id: 'voice',
      name: 'Voice Agent',
      description: 'AI Assistant dengan kemampuan percakapan suara dan pemrosesan audio real-time',
      icon: Mic,
      isActive: true,
      features: ['Text-to-Speech', 'Speech Recognition', 'Real-time Processing']
    },
    {
      id: 'chat',
      name: 'Chat Agent',
      description: 'AI Assistant untuk percakapan teks dengan pemahaman konteks yang mendalam',
      icon: MessageCircle,
      isActive: false,
      features: ['Natural Language Processing', 'Context Awareness', 'Multi-language Support']
    }
  ]);

  const toggleAgent = (agentId: string) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId ? { ...agent, isActive: !agent.isActive } : agent
    ));
  };

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg border-blue-100 dark:border-gray-700 transition-colors duration-300">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-blue-900 dark:text-blue-100">
          Pilihan AI Agent
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Kelola layanan AI Agent yang tersedia
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {agents.map((agent) => (
          <div key={agent.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-700">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <agent.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{agent.name}</h3>
                  <Badge variant={agent.isActive ? 'default' : 'secondary'}
                         className={agent.isActive 
                           ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                           : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}>
                    {agent.isActive ? 'Aktif' : 'Tidak Aktif'}
                  </Badge>
                </div>
              </div>
              <Switch 
                checked={agent.isActive}
                onCheckedChange={() => toggleAgent(agent.id)}
              />
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {agent.description}
            </p>
            
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Fitur:</p>
              <div className="flex flex-wrap gap-1">
                {agent.features.map((feature, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AIAgentSelector;
