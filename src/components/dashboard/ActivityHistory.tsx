
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Mic, MessageCircle, User, ArrowUp } from 'lucide-react';

const ActivityHistory: React.FC = () => {
  const activities = [
    { id: 1, action: 'Voice Agent Session', time: '2 hours ago', tokens: 150, icon: Mic, color: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300' },
    { id: 2, action: 'Chat Agent Conversation', time: '5 hours ago', tokens: 75, icon: MessageCircle, color: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300' },
    { id: 3, action: 'Profile Update', time: '1 day ago', tokens: 0, icon: User, color: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300' },
    { id: 4, action: 'Voice Agent Session', time: '2 days ago', tokens: 200, icon: Mic, color: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300' },
    { id: 5, action: 'Package Upgrade', time: '1 week ago', tokens: 0, icon: ArrowUp, color: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300' },
  ];

  return (
    <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
            <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-slate-600 dark:text-slate-300" />
          </div>
          <span className="truncate">Activity History</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 sm:space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="group flex items-center gap-4 sm:gap-6 p-4 sm:p-5 bg-slate-50/80 dark:bg-slate-700/40 rounded-xl border border-slate-200/50 dark:border-slate-600/50 hover:shadow-md transition-all duration-200">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${activity.color} flex-shrink-0`}>
                <activity.icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base truncate">{activity.action}</p>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">{activity.time}</p>
              </div>
              {activity.tokens > 0 && (
                <Badge className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-0 text-xs px-3 py-1 flex-shrink-0 font-semibold">
                  {activity.tokens} tokens
                </Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityHistory;
