
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { User, Mail, CreditCard } from 'lucide-react';

const AccountCard: React.FC = () => {
  // Mock data - in real implementation, this would come from props or context
  const userData = {
    username: 'john_doe',
    email: 'john.doe@example.com',
    packageType: 'Premium',
    tokensUsed: 8500,
    tokensLimit: 10000,
    subscriptionStatus: 'active'
  };

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg border-blue-100 dark:border-gray-700 transition-colors duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-blue-900 dark:text-blue-100 flex items-center">
          <User className="h-6 w-6 mr-2" />
          Informasi Akun
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Username</p>
                <p className="font-semibold text-gray-900 dark:text-white">{userData.username}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="font-semibold text-gray-900 dark:text-white">{userData.email}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Paket</p>
                <div className="flex items-center space-x-2">
                  <Badge variant={userData.packageType === 'Premium' ? 'default' : 'secondary'} 
                         className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {userData.packageType}
                  </Badge>
                  <Badge variant={userData.subscriptionStatus === 'active' ? 'default' : 'destructive'}
                         className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    {userData.subscriptionStatus === 'active' ? 'Aktif' : 'Tidak Aktif'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountCard;
