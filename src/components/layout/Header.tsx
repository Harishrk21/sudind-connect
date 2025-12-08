import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, Menu, Search } from 'lucide-react';
import { getNotificationsByUser } from '@/lib/mockData';

interface HeaderProps {
  onMenuClick: () => void;
  title: string;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, title }) => {
  const { user } = useAuth();
  const notifications = user ? getNotificationsByUser(user.id).filter(n => !n.read) : [];

  return (
    <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <Menu className="w-5 h-5 text-muted-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Search (desktop) */}
          <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-sm w-40 placeholder:text-muted-foreground"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
            <Bell className="w-5 h-5 text-muted-foreground" />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>

          {/* User avatar */}
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
            {user?.name.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
