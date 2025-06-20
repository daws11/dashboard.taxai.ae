
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

const AccountManagement: React.FC = () => {
  const [formData, setFormData] = useState({
    username: 'john_doe',
    email: 'john@example.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const paymentHistory = [
    { id: 1, date: '2024-01-15', amount: '$29.99', package: 'Premium', status: 'Paid' },
    { id: 2, date: '2023-12-15', amount: '$29.99', package: 'Premium', status: 'Paid' },
    { id: 3, date: '2023-11-15', amount: '$29.99', package: 'Premium', status: 'Paid' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Account Management</h1>
      
      {/* Profile Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-blue-100 dark:border-gray-700 transition-colors duration-300">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Profile Information</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">
            Update Profile
          </Button>
        </form>
      </div>

      {/* Package Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-blue-100 dark:border-gray-700 transition-colors duration-300">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Package Management</h2>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-gray-600 dark:text-gray-400">Current Package:</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">Premium</p>
          </div>
          <div className="space-x-2">
            <Button variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900">
              Upgrade
            </Button>
            <Button variant="outline" className="border-gray-300 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
              Downgrade
            </Button>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-blue-100 dark:border-gray-700 transition-colors duration-300">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Payment History</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 text-gray-600 dark:text-gray-400">Date</th>
                <th className="text-left py-2 text-gray-600 dark:text-gray-400">Amount</th>
                <th className="text-left py-2 text-gray-600 dark:text-gray-400">Package</th>
                <th className="text-left py-2 text-gray-600 dark:text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory.map((payment) => (
                <tr key={payment.id} className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-2 text-gray-900 dark:text-white">{payment.date}</td>
                  <td className="py-2 text-gray-900 dark:text-white">{payment.amount}</td>
                  <td className="py-2 text-gray-900 dark:text-white">{payment.package}</td>
                  <td className="py-2">
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AccountManagement;
