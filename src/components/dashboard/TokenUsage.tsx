
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Zap } from 'lucide-react';

const TokenUsage: React.FC = () => {
  const usedTokens = 7500;
  const totalTokens = 10000;
  const usagePercentage = (usedTokens / totalTokens) * 100;

  return (
    <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
            <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-slate-600 dark:text-slate-300" />
          </div>
          <span className="truncate">Token Usage</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 sm:space-y-8">
        <div className="text-center py-4 sm:py-6">
          <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-3">
            {usedTokens.toLocaleString()}
          </div>
          <div className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium">
            of {totalTokens.toLocaleString()} tokens used
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm sm:text-base">
            <span className="text-slate-600 dark:text-slate-400 font-medium">Progress</span>
            <span className="font-bold text-slate-900 dark:text-white">{usagePercentage.toFixed(1)}%</span>
          </div>
          <Progress value={usagePercentage} className="h-3 sm:h-4" />
        </div>

        <div className="bg-slate-50/80 dark:bg-slate-700/50 rounded-xl p-4 sm:p-6">
          <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Remaining</div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {(totalTokens - usedTokens).toLocaleString()} tokens
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenUsage;
