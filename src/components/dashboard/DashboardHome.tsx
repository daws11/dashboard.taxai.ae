
import React from 'react';
import AccountCard from './AccountCard';
import AIAgentSelector from './AIAgentSelector';
import TokenUsage from './TokenUsage';
import ActivityHistory from './ActivityHistory';

const DashboardHome: React.FC = () => {
  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Welcome Section */}
      <div className="text-center py-4 sm:py-6 lg:py-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2 sm:mb-3">
          Welcome back! 👋
        </h2>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto px-4">
          Monitor your AI agents, track token usage, and manage your account from this central dashboard.
        </p>
      </div>

      {/* Main Grid - Responsive layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-8 space-y-6 lg:space-y-8">
          <AccountCard />
          <AIAgentSelector />
        </div>
        <div className="lg:col-span-4 space-y-6 lg:space-y-8">
          <TokenUsage />
          <ActivityHistory />
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
