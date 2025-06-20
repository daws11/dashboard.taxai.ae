
import React from 'react';
import AccountCard from './AccountCard';
import AIAgentSelector from './AIAgentSelector';
import TokenUsage from './TokenUsage';
import ActivityHistory from './ActivityHistory';

const DashboardHome: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center py-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
          Welcome back! 👋
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Monitor your AI agents, track token usage, and manage your account from this central dashboard.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <AccountCard />
          <AIAgentSelector />
        </div>
        <div className="space-y-8">
          <TokenUsage />
          <ActivityHistory />
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
