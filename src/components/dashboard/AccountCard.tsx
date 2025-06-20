
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const AccountCard: React.FC = () => {
  return (
    <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 shadow-xl">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-semibold text-sm sm:text-base">A</span>
          </div>
          <span className="truncate">Account Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Username</span>
              <span className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white break-all">john_doe</span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Email</span>
              <span className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white break-all">john@example.com</span>
            </div>
          </div>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col space-y-2">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Package</span>
              <Badge className="w-fit bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 px-3 py-1">
                Premium
              </Badge>
            </div>
            <div className="flex flex-col space-y-2">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Status</span>
              <Badge className="w-fit bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0 px-3 py-1">
                Active
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountCard;
