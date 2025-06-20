
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const TokenUsage: React.FC = () => {
  const usedTokens = 7500;
  const totalTokens = 10000;
  const usagePercentage = (usedTokens / totalTokens) * 100;

  return (
    <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-lg">⚡</span>
          </div>
          Token Usage
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center py-4">
          <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {usedTokens.toLocaleString()}
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            of {totalTokens.toLocaleString()} tokens used
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">Progress</span>
            <span className="font-semibold text-slate-900 dark:text-white">{usagePercentage.toFixed(1)}%</span>
          </div>
          <Progress value={usagePercentage} className="h-3" />
        </div>

        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
          <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Remaining</div>
          <div className="text-lg font-semibold text-slate-900 dark:text-white">
            {(totalTokens - usedTokens).toLocaleString()} tokens
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenUsage;
