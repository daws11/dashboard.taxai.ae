
import React from 'react';

const TokenUsage: React.FC = () => {
  const usedTokens = 7500;
  const totalTokens = 10000;
  const usagePercentage = (usedTokens / totalTokens) * 100;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-blue-100 dark:border-gray-700 transition-colors duration-300">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Token Usage</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-600 dark:text-gray-400">Used Tokens:</span>
          <span className="font-medium text-gray-900 dark:text-white">{usedTokens.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600 dark:text-gray-400">Total Tokens:</span>
          <span className="font-medium text-gray-900 dark:text-white">{totalTokens.toLocaleString()}</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Usage Progress</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">{usagePercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${usagePercentage}%` }}
            ></div>
          </div>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Remaining: {(totalTokens - usedTokens).toLocaleString()} tokens
        </div>
      </div>
    </div>
  );
};

export default TokenUsage;
