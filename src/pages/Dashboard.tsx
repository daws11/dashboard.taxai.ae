
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardHome from '../components/dashboard/DashboardHome';
import AccountManagement from '../components/dashboard/AccountManagement';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';

const Dashboard: React.FC = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900 transition-colors duration-300">
        <DashboardSidebar />
        <SidebarInset>
          <DashboardHeader />
          <main className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<DashboardHome />} />
              <Route path="/account" element={<AccountManagement />} />
            </Routes>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
