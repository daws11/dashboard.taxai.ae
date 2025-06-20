
import React from 'react';
import { Moon, Sun, User, Bell } from 'lucide-react';
import { Button } from '../ui/button';
import ThemeToggle from '../utils/ThemeToggle';

const DashboardHeader: React.FC = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-blue-100 dark:border-gray-700 transition-colors duration-300">
      <div className="px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            AI Agent Dashboard
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Kelola layanan AI Agent Anda
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300">
            <Bell className="h-5 w-5" />
          </Button>
          
          <ThemeToggle />
          
          <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
