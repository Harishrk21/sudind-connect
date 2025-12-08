import React from 'react';
import { CaseStatus, getStatusLabel, getStatusClass } from '@/lib/mockData';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: CaseStatus;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  return (
    <span className={cn('status-badge', getStatusClass(status), className)}>
      {getStatusLabel(status)}
    </span>
  );
};

export default StatusBadge;
