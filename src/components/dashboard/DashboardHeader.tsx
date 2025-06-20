
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import ThemeToggle from '../utils/ThemeToggle';

const DashboardHeader: React.FC = () => {
  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-700/50 p-4 sm:p-6 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 sm:space-x-6">
          <SidebarTrigger className="h-8 w-8 sm:h-9 sm:w-9" />
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent truncate">
              AI Agent Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 hidden sm:block">
              Manage your AI agents and monitor usage
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <ThemeToggle />
          <div className="flex items-center space-x-2 sm:space-x-3 bg-white/60 dark:bg-slate-800/60 rounded-full pl-2 sm:pl-3 pr-3 sm:pr-4 py-2 border border-slate-200/50 dark:border-slate-700/50">
            <div className="w-7 h-7 sm:w-9 sm:h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-xs sm:text-sm font-semibold">U</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">User</span>
              <p className="text-xs text-slate-500 dark:text-slate-400">Premium</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
