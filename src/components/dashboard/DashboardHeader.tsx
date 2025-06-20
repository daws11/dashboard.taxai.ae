
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import ThemeToggle from '../utils/ThemeToggle';

const DashboardHeader: React.FC = () => {
  return (
    <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/60 p-4 sm:p-6 lg:p-8 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 sm:space-x-6">
          <SidebarTrigger className="h-8 w-8 sm:h-9 sm:w-9 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors" />
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 dark:from-white dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent truncate">
              AI Agent Dashboard
            </h1>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1 hidden sm:block font-medium">
              Manage your AI agents and monitor usage
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3 sm:space-x-4">
          <ThemeToggle />
          <div className="flex items-center space-x-3 bg-slate-100/80 dark:bg-slate-800/80 rounded-xl pl-3 pr-4 py-2.5 border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-sm">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
              <span className="text-slate-600 dark:text-slate-300 text-sm sm:text-base font-semibold">U</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">User</span>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Premium</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
