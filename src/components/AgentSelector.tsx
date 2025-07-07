"use client";

import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { useState } from "react";
import { useSession } from "next-auth/react";

interface AgentOption {
  key: 'voice' | 'chat';
  name: string;
  description: string;
  active: boolean;
}

const AGENTS: AgentOption[] = [
  {
    key: 'voice',
    name: 'Voice Agent',
    description: 'Voice-based AI service for conversational interaction.',
    active: false,
  },
  {
    key: 'chat',
    name: 'Chat Agent',
    description: 'Chat-based AI service for text communication.',
    active: true,
  },
];

export function AgentSelector() {
  const [selected, setSelected] = useState<'voice' | 'chat'>('chat');
  const { data: session } = useSession();

  const handleSelect = (agentKey: 'voice' | 'chat') => {
    setSelected(agentKey);
    let token: string | undefined = undefined;
    if (session && typeof session === 'object' && 'ssoJwt' in session && typeof (session as Record<string, unknown>).ssoJwt === 'string') {
      token = (session as Record<string, unknown>).ssoJwt as string;
    }
    if (agentKey === 'chat') {
      window.location.href = `https://ask.taxai.ae/${token ? `?token=${encodeURIComponent(token)}` : ''}`;
    } else if (agentKey === 'voice') {
      // window.location.href = `http://localhost:3001/${token ? `?token=${encodeURIComponent(token)}` : ''}`;
      window.location.href = `talk.taxai.ae/${token ? `?token=${encodeURIComponent(token)}` : ''}`;
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {AGENTS.map(agent => (
        <Card
          key={agent.key}
          className={`flex-1 p-6 border-2 transition-all ${selected === agent.key ? 'border-blue-600 bg-blue-50 dark:bg-blue-900' : 'border-blue-200 dark:border-blue-700 bg-white dark:bg-blue-950'}`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="text-lg font-semibold text-blue-900 dark:text-white">{agent.name}</div>
            <span className={`text-xs px-2 py-1 rounded ${agent.active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>{agent.active ? 'Active' : 'Inactive'}</span>
          </div>
          <div className="text-sm text-blue-700 dark:text-blue-200 mb-4">{agent.description}</div>
          <Button
            variant={selected === agent.key ? 'default' : 'outline'}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-800 dark:hover:bg-blue-900"
            onClick={() => handleSelect(agent.key)}
          >
            Select
          </Button>
        </Card>
      ))}
    </div>
  );
} 