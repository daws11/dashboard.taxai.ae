
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ActivityHistory: React.FC = () => {
  const activities = [
    { id: 1, action: 'Voice Agent Session', time: '2 hours ago', tokens: 150, icon: '🎤', color: 'bg-rose-100 text-rose-600 dark:bg-rose-900 dark:text-rose-400' },
    { id: 2, action: 'Chat Agent Conversation', time: '5 hours ago', tokens: 75, icon: '💬', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' },
    { id: 3, action: 'Profile Update', time: '1 day ago', tokens: 0, icon: '👤', color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400' },
    { id: 4, action: 'Voice Agent Session', time: '2 days ago', tokens: 200, icon: '🎤', color: 'bg-rose-100 text-rose-600 dark:bg-rose-900 dark:text-rose-400' },
    { id: 5, action: 'Package Upgrade', time: '1 week ago', tokens: 0, icon: '⬆️', color: 'bg-violet-100 text-violet-600 dark:bg-violet-900 dark:text-violet-400' },
  ];

  return (
    <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-lg">📊</span>
          </div>
          Activity History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity) => (
            <div key={activity.id} className="group flex items-center gap-4 p-4 bg-white/60 dark:bg-slate-700/30 rounded-xl border border-slate-200/50 dark:border-slate-600/50 hover:shadow-md transition-all duration-200">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activity.color}`}>
                <span className="text-lg">{activity.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 dark:text-white text-sm">{activity.action}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{activity.time}</p>
              </div>
              {activity.tokens > 0 && (
                <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 text-xs px-2 py-1">
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
