
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Zap, TrendingUp } from 'lucide-react';

const TokenUsage: React.FC = () => {
  const tokenData = {
    used: 8500,
    limit: 10000,
    dailyUsage: [150, 200, 175, 300, 250, 180, 320],
    monthlyTrend: 12 // percentage increase
  };

  const usagePercentage = (tokenData.used / tokenData.limit) * 100;
  const remainingTokens = tokenData.limit - tokenData.used;

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg border-blue-100 dark:border-gray-700 transition-colors duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-blue-900 dark:text-blue-100 flex items-center">
          <Zap className="h-6 w-6 mr-2" />
          Penggunaan Token
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="mb-4">
            <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {tokenData.used.toLocaleString()}
            </span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">
              / {tokenData.limit.toLocaleString()}
            </span>
          </div>
          
          <Progress 
            value={usagePercentage} 
            className="h-3 mb-2"
          />
          
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>{usagePercentage.toFixed(1)}% digunakan</span>
            <span>{remainingTokens.toLocaleString()} tersisa</span>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Tren Bulanan
            </span>
            <div className="flex items-center text-green-600 dark:text-green-400">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="text-sm font-semibold">+{tokenData.monthlyTrend}%</span>
            </div>
          </div>
          
          <div className="flex items-end space-x-1 h-16">
            {tokenData.dailyUsage.map((usage, index) => (
              <div 
                key={index}
                className="bg-blue-200 dark:bg-blue-700 rounded-t flex-1 transition-all duration-300 hover:bg-blue-300 dark:hover:bg-blue-600"
                style={{ height: `${(usage / Math.max(...tokenData.dailyUsage)) * 100}%` }}
                title={`Day ${index + 1}: ${usage} tokens`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenUsage;
