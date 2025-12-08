import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '@/contexts/AuthContext';

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path.includes('/cases/')) return 'Case Details';
    if (path.includes('/clients/')) return 'Client Profile';
    if (path.includes('/agents/')) return 'Agent Profile';
    
    if (path.endsWith('/cases')) return 'Cases';
    if (path.endsWith('/clients')) return 'Clients';
    if (path.endsWith('/agents')) return 'Agents';
    if (path.endsWith('/financials')) return 'Financials';
    if (path.endsWith('/reports')) return 'Reports';
    if (path.endsWith('/messages')) return 'Messages';
    if (path.endsWith('/upload')) return 'Upload Documents';
    if (path.endsWith('/payments')) return 'Payments';
    if (path.endsWith('/settings')) return 'Settings';
    
    // Dashboard titles by role
    if (path === '/admin') return 'Admin Dashboard';
    if (path === '/agent') return 'Agent Dashboard';
    if (path === '/client') return 'My Dashboard';
    
    return 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:pl-64">
        <Header 
          onMenuClick={() => setSidebarOpen(true)} 
          title={getPageTitle()} 
        />
        
        <main className="p-4 lg:p-6 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
