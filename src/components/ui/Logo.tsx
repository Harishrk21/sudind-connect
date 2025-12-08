import React from 'react';
import { Building2, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  textClassName?: string;
  iconClassName?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  className, 
  textClassName, 
  iconClassName, 
  size = 'md',
  showText = true 
}) => {
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

  return (
    <div className={cn("flex items-center gap-3", className)}>
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
          <span className={cn("font-bold text-foreground leading-tight", textSizes[size], textClassName)}>
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
