
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const AIAgentSelector: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<'voice' | 'chat' | null>(null);

  const agents = [
    {
      id: 'voice' as const,
      name: 'Voice Agent',
      description: 'AI-powered voice assistant for natural conversations',
      status: 'active',
      icon: '🎤',
      color: 'from-rose-500 to-pink-600'
    },
    {
      id: 'chat' as const,
      name: 'Chat Agent',
      description: 'Text-based AI assistant for instant messaging',
      status: 'inactive',
      icon: '💬',
      color: 'from-cyan-500 to-blue-600'
    }
  ];

  return (
    <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 shadow-xl">
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white text-base sm:text-lg">🤖</span>
          </div>
          <span className="truncate">AI Agent Selection</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        {agents.map((agent) => (
          <div 
            key={agent.id}
            className={`group relative p-4 sm:p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
              selectedAgent === agent.id
                ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 shadow-lg'
                : 'border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 bg-white/50 dark:bg-slate-700/30'
            }`}
            onClick={() => setSelectedAgent(agent.id)}
          >
            <div className="flex items-start gap-3 sm:gap-4">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${agent.color} rounded-xl flex items-center justify-center text-lg sm:text-xl shadow-lg flex-shrink-0`}>
                {agent.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2 sm:mb-3 gap-2">
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white truncate">{agent.name}</h3>
                  <Badge 
                    variant={agent.status === 'active' ? 'default' : 'secondary'}
                    className={`${agent.status === 'active' 
                      ? 'bg-emerald-500 text-white border-0' 
                      : 'bg-slate-200 text-slate-700 dark:bg-slate-600 dark:text-slate-300 border-0'
                    } text-xs flex-shrink-0`}
                  >
                    {agent.status}
                  </Badge>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {agent.description}
                </p>
              </div>
            </div>
            {selectedAgent === agent.id && (
              <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AIAgentSelector;
