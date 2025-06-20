
import React from 'react';
import AccountCard from './AccountCard';
import AIAgentSelector from './AIAgentSelector';
import TokenUsage from './TokenUsage';
import ActivityHistory from './ActivityHistory';

const DashboardHome: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AccountCard />
        </div>
        <div className="lg:col-span-1">
          <TokenUsage />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AIAgentSelector />
        <ActivityHistory />
      </div>
    </div>
  );
};

export default DashboardHome;
