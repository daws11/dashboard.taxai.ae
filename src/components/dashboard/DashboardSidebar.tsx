import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Home, LogOut } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';

const DashboardSidebar: React.FC = () => {
  const location = useLocation();
  
  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: User, label: 'Account', path: '/dashboard/account' },
  ];

  const handleLogout = () => {
    // Add logout logic here
    console.log('Logout clicked');
    // You can add your logout implementation here
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-6">
        <div className="flex items-center space-x-3">
          <img src="/logo.png" alt="Logo" className="w-auto h-12" />
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item, index) => {
                const isActive = location.pathname === item.path;
                return (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link to={item.path}>
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
