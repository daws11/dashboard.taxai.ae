
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import ThemeToggle from '../utils/ThemeToggle';

const DashboardHeader: React.FC = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-blue-100 dark:border-gray-700 p-4 transition-colors duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            AI Agent Dashboard
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">U</span>
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300">User</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
