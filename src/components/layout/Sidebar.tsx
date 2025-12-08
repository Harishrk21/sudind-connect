import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  FolderKanban,
  Upload,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  Building2,
  Bell,
  CreditCard,
  X,
  Brain,
  Building,
  GraduationCap,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Logo from '@/components/ui/Logo';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const adminLinks = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/clients', icon: Users, label: 'Clients' },
    { to: '/admin/agents', icon: UserCheck, label: 'Agents' },
    { to: '/admin/cases', icon: FolderKanban, label: 'Cases' },
    { to: '/admin/contracts', icon: FileText, label: 'Contracts' },
    { to: '/admin/financials', icon: CreditCard, label: 'Financials' },
    { to: '/admin/ai-processing', icon: Brain, label: 'AI Processing' },
    { to: '/admin/integrations', icon: Building, label: 'Integrations' },
    { to: '/admin/reports', icon: FileText, label: 'Reports' },
    { to: '/admin/audit-log', icon: Shield, label: 'Audit Log' },
    { to: '/admin/messages', icon: MessageSquare, label: 'Messages' },
  ];

  const agentLinks = [
    { to: '/agent', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/agent/cases', icon: FolderKanban, label: 'My Cases' },
    { to: '/agent/upload', icon: Upload, label: 'Upload Documents' },
    { to: '/agent/cost-estimate', icon: CreditCard, label: 'Cost Estimates' },
    { to: '/agent/messages', icon: MessageSquare, label: 'Messages' },
  ];

  const clientLinks = [
    { to: '/client', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/client/cases', icon: FolderKanban, label: 'My Cases' },
    { to: '/client/upload', icon: Upload, label: 'Upload Documents' },
    { to: '/client/payments', icon: CreditCard, label: 'Payments' },
    { to: '/client/messages', icon: MessageSquare, label: 'Messages' },
    { to: '/client/chat', icon: MessageSquare, label: 'Live Support' },
  ];

  const getLinks = () => {
    switch (user?.role) {
      case 'admin':
        return adminLinks;
      case 'agent':
        return agentLinks;
      case 'client':
        return clientLinks;
      default:
        return [];
    }
  };

  const links = getLinks();

  const getRoleLabel = () => {
    switch (user?.role) {
      case 'admin':
        return 'Sudan Head Office';
      case 'agent':
        return 'India Agent';
      case 'client':
        return user.clientType === 'patient' ? 'Patient' : user.clientType === 'student' ? 'Student' : 'Visitor';
      default:
        return '';
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-foreground/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-screen w-64 bg-sidebar transform transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border flex-shrink-0">
          <Logo size="sm" showText={true} className="text-sidebar-foreground" />
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded text-sidebar-foreground/60 hover:text-sidebar-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User info */}
        <div className="p-4 border-b border-sidebar-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-accent-foreground font-medium">
              {user?.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.name}</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto overflow-x-hidden min-h-0">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/admin' || link.to === '/agent' || link.to === '/client'}
              className={({ isActive }) =>
                cn('nav-link', isActive && 'active')
              }
              onClick={onClose}
            >
              <link.icon className="w-5 h-5" />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-sidebar-border space-y-1 flex-shrink-0">
          <NavLink
            to={`/${user?.role}/settings`}
            className={({ isActive }) => cn('nav-link', isActive && 'active')}
            onClick={onClose}
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </NavLink>
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="nav-link w-full text-left text-destructive hover:bg-destructive/10"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
