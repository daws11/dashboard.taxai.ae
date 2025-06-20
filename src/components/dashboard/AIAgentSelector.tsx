import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, Mic, MessageCircle } from 'lucide-react';

const AIAgentSelector: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<'voice' | 'chat' | null>(null);

  const agents = [
    {
      id: 'voice' as const,
      name: 'Agent Yosr',
      description: 'Your AI-powered tax consultant, offering instant, chat-based guidance to intelligently optimize your finances for maximum savings and effortless compliance.',
      status: 'active',
      icon: Mic
    },
    {
      id: 'chat' as const,
      name: 'Agent Atto',
      description: 'Your AI-powered tax consultant, offering instant, chat-based guidance to intelligently optimize your finances for maximum savings and effortless compliance.',
      status: 'inactive',
      icon: MessageCircle
    }
  ];

  const handleAgentClick = (agentId: 'voice' | 'chat') => {
    if (agentId === 'voice') {
      window.open('https://www.talk.taxai.ae/', '_blank');
    } else if (agentId === 'chat') {
      window.open('https://www.ask.taxai.ae/', '_blank');
    }
    setSelectedAgent(agentId);
  };

  return (
    <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
            <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-slate-600 dark:text-slate-300" />
          </div>
          <span className="truncate">AI Agent Selection</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        {agents.map((agent) => (
          <div 
            key={agent.id}
            className={`group relative p-4 sm:p-6 lg:p-8 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
              selectedAgent === agent.id
                ? 'border-slate-900 dark:border-white bg-slate-50/80 dark:bg-slate-700/50 shadow-lg'
                : 'border-slate-200 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-400 bg-slate-50/40 dark:bg-slate-700/20'
            }`}
            onClick={() => handleAgentClick(agent.id)}
          >
            <div className="flex items-start gap-4 sm:gap-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center shadow-sm">
                <agent.icon className="h-6 w-6 sm:h-7 sm:w-7 text-slate-600 dark:text-slate-300" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-3 sm:mb-4 gap-3">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white truncate">{agent.name}</h3>
                  <Badge 
                    variant={agent.status === 'active' ? 'default' : 'secondary'}
                    className={`${agent.status === 'active' 
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-0' 
                      : 'bg-slate-200 text-slate-700 dark:bg-slate-600 dark:text-slate-300 border-0'
                    } text-xs font-semibold px-3 py-1 flex-shrink-0`}
                  >
                    {agent.status}
                  </Badge>
                </div>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  {agent.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AIAgentSelector;
