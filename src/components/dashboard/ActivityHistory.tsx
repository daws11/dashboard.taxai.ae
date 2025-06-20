
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Clock, MessageCircle, Mic, CheckCircle } from 'lucide-react';

const ActivityHistory: React.FC = () => {
  const activities = [
    {
      id: 1,
      type: 'voice',
      action: 'Voice Agent Session',
      description: 'Sesi percakapan suara selama 15 menit',
      timestamp: '2 jam yang lalu',
      status: 'completed',
      tokensUsed: 450
    },
    {
      id: 2,
      type: 'chat',
      action: 'Chat Agent Query',
      description: 'Proses 23 pesan percakapan',
      timestamp: '5 jam yang lalu',
      status: 'completed',
      tokensUsed: 230
    },
    {
      id: 3,
      type: 'voice',
      action: 'Voice Agent Training',
      description: 'Pelatihan model dengan data baru',
      timestamp: '1 hari yang lalu',
      status: 'processing',
      tokensUsed: 1200
    },
    {
      id: 4,
      type: 'chat',
      action: 'Chat Agent Integration',
      description: 'Integrasi dengan platform eksternal',
      timestamp: '2 hari yang lalu',
      status: 'completed',
      tokensUsed: 180
    }
  ];

  const getIcon = (type: string) => {
    return type === 'voice' ? Mic : MessageCircle;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg border-blue-100 dark:border-gray-700 transition-colors duration-300">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-blue-900 dark:text-blue-100 flex items-center">
          <Clock className="h-6 w-6 mr-2" />
          Riwayat Aktivitas
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Aktivitas terbaru layanan AI Agent
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const IconComponent = getIcon(activity.type);
            return (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <IconComponent className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {activity.action}
                    </h4>
                    <Badge className={getStatusColor(activity.status)}>
                      {activity.status === 'completed' ? 'Selesai' : 'Proses'}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {activity.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{activity.timestamp}</span>
                    <span>{activity.tokensUsed} token</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityHistory;
