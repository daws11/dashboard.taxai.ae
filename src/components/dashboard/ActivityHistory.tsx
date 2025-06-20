
import React from 'react';

const ActivityHistory: React.FC = () => {
  const activities = [
    { id: 1, action: 'Voice Agent Session', time: '2 hours ago', tokens: 150 },
    { id: 2, action: 'Chat Agent Conversation', time: '5 hours ago', tokens: 75 },
    { id: 3, action: 'Profile Update', time: '1 day ago', tokens: 0 },
    { id: 4, action: 'Voice Agent Session', time: '2 days ago', tokens: 200 },
    { id: 5, action: 'Package Upgrade', time: '1 week ago', tokens: 0 },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-blue-100 dark:border-gray-700 transition-colors duration-300">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Activity History</h2>
      <div className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{activity.action}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</p>
            </div>
            {activity.tokens > 0 && (
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-sm font-medium">
                {activity.tokens} tokens
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityHistory;
