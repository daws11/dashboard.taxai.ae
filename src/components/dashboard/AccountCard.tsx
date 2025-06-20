
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';

const AccountCard: React.FC = () => {
  return (
    <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
            <User className="h-5 w-5 sm:h-6 sm:w-6 text-slate-600 dark:text-slate-300" />
          </div>
          <span className="truncate">Account Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 sm:space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-slate-50/80 dark:bg-slate-700/50 rounded-xl p-4 sm:p-5">
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Username</span>
              <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-2 break-all">john_doe</div>
            </div>
            <div className="bg-slate-50/80 dark:bg-slate-700/50 rounded-xl p-4 sm:p-5">
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Email</span>
              <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-2 break-all">john@example.com</div>
            </div>
          </div>
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-slate-50/80 dark:bg-slate-700/50 rounded-xl p-4 sm:p-5">
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3 block">Package</span>
              <Badge className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-0 px-4 py-2 text-sm font-semibold">
                Premium
              </Badge>
            </div>
            <div className="bg-slate-50/80 dark:bg-slate-700/50 rounded-xl p-4 sm:p-5">
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3 block">Status</span>
              <Badge className="bg-slate-700 dark:bg-slate-300 text-white dark:text-slate-900 border-0 px-4 py-2 text-sm font-semibold">
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
