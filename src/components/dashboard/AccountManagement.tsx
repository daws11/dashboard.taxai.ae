
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { User, Mail, Lock, CreditCard, History } from 'lucide-react';

const AccountManagement: React.FC = () => {
  const [profileData, setProfileData] = useState({
    username: 'john_doe',
    email: 'john.doe@example.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const paymentHistory = [
    {
      id: '1',
      date: '2024-01-15',
      amount: 'Rp 299,000',
      package: 'Premium',
      status: 'Berhasil'
    },
    {
      id: '2',
      date: '2023-12-15',
      amount: 'Rp 299,000',
      package: 'Premium',
      status: 'Berhasil'
    },
    {
      id: '3',
      date: '2023-11-15',
      amount: 'Rp 99,000',
      package: 'Basic',
      status: 'Berhasil'
    }
  ];

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Profile update:', profileData);
    // Handle profile update logic here
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Password change requested');
    // Handle password change logic here
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Information Form */}
        <Card className="bg-white dark:bg-gray-800 shadow-lg border-blue-100 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-900 dark:text-blue-100">
              <User className="h-5 w-5 mr-2" />
              Informasi Profil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={profileData.username}
                  onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                  className="dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  className="dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Perbarui Profil
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Password Change Form */}
        <Card className="bg-white dark:bg-gray-800 shadow-lg border-blue-100 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-900 dark:text-blue-100">
              <Lock className="h-5 w-5 mr-2" />
              Ubah Password
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Password Saat Ini</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={profileData.currentPassword}
                  onChange={(e) => setProfileData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword">Password Baru</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={profileData.newPassword}
                  onChange={(e) => setProfileData(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={profileData.confirmPassword}
                  onChange={(e) => setProfileData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Ubah Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Management */}
      <Card className="bg-white dark:bg-gray-800 shadow-lg border-blue-100 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-900 dark:text-blue-100">
            <CreditCard className="h-5 w-5 mr-2" />
            Manajemen Langganan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Paket Premium</h3>
              <p className="text-gray-600 dark:text-gray-400">10,000 token per bulan</p>
            </div>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              Aktif
            </Badge>
          </div>
          
          <div className="flex space-x-3">
            <Button variant="outline" className="border-blue-200 dark:border-blue-700">
              Upgrade Paket
            </Button>
            <Button variant="outline" className="border-red-200 dark:border-red-700 text-red-600 dark:text-red-400">
              Batalkan Langganan
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card className="bg-white dark:bg-gray-800 shadow-lg border-blue-100 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-900 dark:text-blue-100">
            <History className="h-5 w-5 mr-2" />
            Riwayat Pembayaran
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paymentHistory.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{payment.package}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{payment.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">{payment.amount}</p>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    {payment.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountManagement;
