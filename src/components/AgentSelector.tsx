"use client";

import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslation } from "@/lib/hooks/useTranslation";

interface AgentOption {
  key: 'voice' | 'chat';
  name: string;
  description: string;
  active: boolean;
}

export function AgentSelector({ disabled = false, planName = 'Unknown Plan' }: { disabled?: boolean; planName?: string } = {}) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<'voice' | 'chat'>('chat');
  const { data: session } = useSession();

  const AGENTS: AgentOption[] = [
    {
      key: 'voice',
      name: t('agents.yosrVoiceAgent'),
      description: t('agents.voiceAgentDescription'),
      active: false,
    },
    {
      key: 'chat',
      name: t('agents.attoChatAgent'),
      description: t('agents.chatAgentDescription'),
      active: true,
    },
  ];

  const handleSelect = (agentKey: 'voice' | 'chat') => {
    if (disabled) return;
    setSelected(agentKey);
    let token: string | undefined = undefined;
    if (session && typeof session === 'object' && 'ssoJwt' in session && typeof (session as Record<string, unknown>).ssoJwt === 'string') {
      token = (session as Record<string, unknown>).ssoJwt as string;
    }
    if (agentKey === 'chat') {
      window.location.href = `https://ask.taxai.ae/${token ? `?token=${encodeURIComponent(token)}` : ''}`;
    } else if (agentKey === 'voice') {
      window.location.href = `https://talk.taxai.ae/${token ? `?token=${encodeURIComponent(token)}` : ''}`;
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 layout-preserve">
      {AGENTS.map(agent => (
        <Card
          key={agent.key}
          className={`flex-1 p-6 border-2 transition-all ${selected === agent.key ? 'border-blue-600 bg-blue-50 dark:bg-blue-900' : 'border-blue-200 dark:border-blue-700 bg-white dark:bg-blue-950'} ${disabled ? 'opacity-60 pointer-events-none' : ''} layout-preserve`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="text-lg font-semibold text-blue-900 dark:text-white">{agent.name}</div>
            {/* Custom label logic */}
            {agent.key === 'chat' ? (
              <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">{planName}</span>
            ) : agent.key === 'voice' ? (
              <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-700">{t('dashboard.free3MinutesCall')}</span>
            ) : null}
          </div>
          <div className="text-sm text-blue-700 dark:text-blue-200 mb-4">{agent.description}</div>
          <Button
            variant={selected === agent.key ? 'default' : 'outline'}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-800 dark:hover:bg-blue-900"
            onClick={() => handleSelect(agent.key)}
            disabled={disabled}
          >
            {t('common.select')}
          </Button>
        </Card>
      ))}
    </div>
  );
} 