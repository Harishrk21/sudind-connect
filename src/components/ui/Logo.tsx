import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Building2, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  textClassName?: string;
  iconClassName?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  clickable?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  className, 
  textClassName, 
  iconClassName, 
  size = 'md',
  showText = true,
  clickable = true
}) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleClick = () => {
    if (!clickable) return;
    
    if (!isAuthenticated) {
      navigate('/');
    } else if (user) {
      navigate(`/${user.role}`);
    }
  };
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  // Determine text color based on context
  // If textClassName is provided, use it; otherwise use default cream color for dark backgrounds
  // For light backgrounds (like landing/login headers), don't set cream color
  const shouldUseCreamColor = textClassName?.includes('text-primary-foreground') || 
                              textClassName?.includes('text-white') || 
                              (!textClassName && className?.includes('dark'));
  const logoTextColor = shouldUseCreamColor ? '#FDF6E3' : undefined;

  return (
    <div 
      className={cn("flex items-center gap-3", className, clickable && "cursor-pointer hover:opacity-80 transition-opacity")}
      onClick={handleClick}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={clickable ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      } : undefined}
    >
      <div className={cn(
        "relative rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg",
        sizeClasses[size],
        iconClassName
      )}>
        <Building2 className={cn("text-primary-foreground", size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6')} />
        <div className="absolute -bottom-0.5 -right-0.5 bg-accent rounded-full p-0.5">
          <Globe className={cn("text-accent-foreground", size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-2.5 h-2.5' : 'w-3 h-3')} />
        </div>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span 
            className={cn("font-bold leading-tight", textSizes[size], textClassName)} 
            style={logoTextColor ? { color: logoTextColor } : undefined}
          >
            SudInd
          </span>
          <span className={cn("text-xs text-muted-foreground leading-tight -mt-0.5", textSizes[size])}>
            Smart Portal
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
