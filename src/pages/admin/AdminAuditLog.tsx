import React, { useState } from 'react';
import { Search, Filter, FileText, User, Calendar, Shield, Download } from 'lucide-react';
import DataTable from '@/components/ui/DataTable';
import { cn } from '@/lib/utils';
import { downloadDemoFile, ReportData } from '@/lib/utils';

export interface AuditLogEntry {
  id: number;
  timestamp: string;
  userId: number;
  userName: string;
  userRole: string;
  action: string;
  resourceType: 'case' | 'document' | 'invoice' | 'contract' | 'user' | 'system';
  resourceId: string;
  details: string;
  ipAddress?: string;
  userAgent?: string;
}

// Mock audit log data
const mockAuditLogs: AuditLogEntry[] = [
  {
    id: 1,
    timestamp: '2024-12-10T10:30:00Z',
    userId: 1,
    userName: 'Admin User',
    userRole: 'admin',
    action: 'created',
    resourceType: 'case',
    resourceId: 'MED-001',
    details: 'Created new medical case for client Ali Hassan',
    ipAddress: '192.168.1.100',
  },
  {
    id: 2,
    timestamp: '2024-12-10T11:15:00Z',
    userId: 2,
    userName: 'Agent 1',
    userRole: 'agent',
    action: 'uploaded',
    resourceType: 'document',
    resourceId: 'DOC-101',
    details: 'Uploaded medical report: ali_cardiac_report.pdf',
    ipAddress: '192.168.1.101',
  },
  {
    id: 3,
    timestamp: '2024-12-10T12:00:00Z',
    userId: 1,
    userName: 'Admin User',
    userRole: 'admin',
    action: 'forwarded',
    resourceType: 'document',
    resourceId: 'DOC-101',
    details: 'Forwarded document to Apollo Hospitals, Hyderabad',
    ipAddress: '192.168.1.100',
  },
  {
    id: 4,
    timestamp: '2024-12-10T13:20:00Z',
    userId: 1,
    userName: 'Admin User',
    userRole: 'admin',
    action: 'updated',
    resourceType: 'case',
    resourceId: 'MED-001',
    details: 'Updated case status from "review" to "approved"',
    ipAddress: '192.168.1.100',
  },
  {
    id: 5,
    timestamp: '2024-12-10T14:45:00Z',
    userId: 5,
    userName: 'Ali Hassan',
    userRole: 'client',
    action: 'viewed',
    resourceType: 'case',
    resourceId: 'MED-001',
    details: 'Viewed case details',
    ipAddress: '192.168.1.105',
  },
  {
    id: 6,
    timestamp: '2024-12-10T15:30:00Z',
    userId: 1,
    userName: 'Admin User',
    userRole: 'admin',
    action: 'generated',
    resourceType: 'invoice',
    resourceId: 'INV-1001',
    details: 'Generated invoice for case MED-001',
    ipAddress: '192.168.1.100',
  },
  {
    id: 7,
    timestamp: '2024-12-10T16:00:00Z',
    userId: 5,
    userName: 'Ali Hassan',
    userRole: 'client',
    action: 'paid',
    resourceType: 'invoice',
    resourceId: 'INV-1001',
    details: 'Payment of $5,000 processed successfully',
    ipAddress: '192.168.1.105',
  },
  {
    id: 8,
    timestamp: '2024-12-10T16:30:00Z',
    userId: 1,
    userName: 'Admin User',
    userRole: 'admin',
    action: 'created',
    resourceType: 'contract',
    resourceId: 'CNT-001',
    details: 'Created contract for case MED-001',
    ipAddress: '192.168.1.100',
  },
];

const AdminAuditLog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [resourceFilter, setResourceFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const filteredLogs = mockAuditLogs.filter((log) => {
    const matchesSearch =
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resourceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    const matchesResource = resourceFilter === 'all' || log.resourceType === resourceFilter;
    const matchesRole = roleFilter === 'all' || log.userRole === roleFilter;
    
    return matchesSearch && matchesAction && matchesResource && matchesRole;
  });

  const getActionColor = (action: string) => {
    switch (action) {
      case 'created':
        return 'bg-success/15 text-success';
      case 'updated':
        return 'bg-info/15 text-info';
      case 'deleted':
        return 'bg-destructive/15 text-destructive';
      case 'uploaded':
        return 'bg-accent/15 text-accent';
      case 'forwarded':
        return 'bg-primary/15 text-primary';
      case 'paid':
        return 'bg-success/15 text-success';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'case':
        return <FileText className="w-4 h-4" />;
      case 'document':
        return <FileText className="w-4 h-4" />;
      case 'invoice':
        return <FileText className="w-4 h-4" />;
      case 'contract':
        return <FileText className="w-4 h-4" />;
      case 'user':
        return <User className="w-4 h-4" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  const columns = [
    {
      key: 'timestamp',
      header: 'Timestamp',
      render: (item: AuditLogEntry) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-foreground">
            {new Date(item.timestamp).toLocaleString()}
          </span>
        </div>
      ),
    },
    {
      key: 'user',
      header: 'User',
      render: (item: AuditLogEntry) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-xs">
            {item.userName.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-foreground text-sm">{item.userName}</p>
            <p className="text-xs text-muted-foreground capitalize">{item.userRole}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      render: (item: AuditLogEntry) => (
        <span className={cn('status-badge capitalize', getActionColor(item.action))}>
          {item.action}
        </span>
      ),
    },
    {
      key: 'resource',
      header: 'Resource',
      render: (item: AuditLogEntry) => (
        <div className="flex items-center gap-2">
          {getResourceIcon(item.resourceType)}
          <div>
            <p className="text-sm font-medium text-foreground capitalize">{item.resourceType}</p>
            <p className="text-xs text-muted-foreground">{item.resourceId}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'details',
      header: 'Details',
      render: (item: AuditLogEntry) => (
        <span className="text-sm text-muted-foreground truncate max-w-[300px] block">
          {item.details}
        </span>
      ),
    },
    {
      key: 'ip',
      header: 'IP Address',
      render: (item: AuditLogEntry) => (
        <span className="text-xs text-muted-foreground font-mono">
          {item.ipAddress || 'N/A'}
        </span>
      ),
    },
  ];

  const uniqueActions = Array.from(new Set(mockAuditLogs.map(log => log.action)));
  const uniqueResources = Array.from(new Set(mockAuditLogs.map(log => log.resourceType)));
  const uniqueRoles = Array.from(new Set(mockAuditLogs.map(log => log.userRole)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Audit Log</h2>
          <p className="text-muted-foreground">
            Complete activity log for all system actions and user activities
          </p>
        </div>
        <button
          onClick={() => {
            const reportData: ReportData = {
              title: 'Audit Log Report',
              type: 'PDF',
              period: 'all',
              data: {
                'Total Entries': filteredLogs.length,
                'Date Range': `${new Date(filteredLogs[filteredLogs.length - 1]?.timestamp || Date.now()).toLocaleDateString()} - ${new Date(filteredLogs[0]?.timestamp || Date.now()).toLocaleDateString()}`,
                'Actions Tracked': uniqueActions.length,
                'Resource Types': uniqueResources.length,
              }
            };
            downloadDemoFile('audit-log-report.pdf', 'report', reportData);
          }}
          className="btn-secondary"
        >
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{mockAuditLogs.length}</p>
              <p className="text-sm text-muted-foreground">Total Entries</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <User className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{uniqueRoles.length}</p>
              <p className="text-sm text-muted-foreground">User Roles</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-info/10">
              <FileText className="w-5 h-5 text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{uniqueResources.length}</p>
              <p className="text-sm text-muted-foreground">Resource Types</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <Filter className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{uniqueActions.length}</p>
              <p className="text-sm text-muted-foreground">Action Types</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by user, resource, or details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="input-field w-auto min-w-[150px]"
        >
          <option value="all">All Actions</option>
          {uniqueActions.map(action => (
            <option key={action} value={action}>{action}</option>
          ))}
        </select>
        <select
          value={resourceFilter}
          onChange={(e) => setResourceFilter(e.target.value)}
          className="input-field w-auto min-w-[150px]"
        >
          <option value="all">All Resources</option>
          {uniqueResources.map(resource => (
            <option key={resource} value={resource}>{resource}</option>
          ))}
        </select>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="input-field w-auto min-w-[150px]"
        >
          <option value="all">All Roles</option>
          {uniqueRoles.map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredLogs}
        keyExtractor={(item) => item.id.toString()}
        emptyMessage="No audit log entries found"
      />

      {/* Security Notice */}
      <div className="bg-accent/10 border border-accent/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-foreground mb-1">Audit Log Security</p>
            <p className="text-sm text-muted-foreground">
              All system actions are logged with timestamps, user information, IP addresses, and detailed activity descriptions. 
              This log provides a complete audit trail for compliance and security purposes. Logs are encrypted and stored securely.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAuditLog;

