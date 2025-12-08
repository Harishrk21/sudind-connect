import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Stethoscope, GraduationCap, ArrowRight } from 'lucide-react';
import DataTable from '@/components/ui/DataTable';
import StatusBadge from '@/components/ui/StatusBadge';
import { useAuth } from '@/contexts/AuthContext';
import { useDataStore } from '@/contexts/DataStore';
import { getCasesByAgent, Case, CaseStatus, CaseType } from '@/lib/mockData';
import { cn } from '@/lib/utils';

const AgentCases: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cases, users } = useDataStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<CaseType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<CaseStatus | 'all'>('all');

  if (!user) return null;

  const myCases = getCasesByAgent(user.id, cases);

  const filteredCases = myCases.filter((c) => {
    const matchesSearch =
      c.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      users.find(u => u.id === c.clientId)?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || c.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const columns = [
    {
      key: 'caseId',
      header: 'Case ID',
      render: (item: Case) => (
        <span className="font-medium text-foreground">{item.caseId}</span>
      ),
    },
    {
      key: 'title',
      header: 'Title',
      render: (item: Case) => (
        <div>
          <p className="font-medium text-foreground truncate max-w-[200px]">{item.title}</p>
          <p className="text-xs text-muted-foreground">{item.hospital || item.university}</p>
        </div>
      ),
    },
    {
      key: 'client',
      header: 'Client',
      render: (item: Case) => {
        const client = users.find(u => u.id === item.clientId);
        return (
          <div>
            <p className="text-foreground">{client?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{client?.clientType}</p>
          </div>
        );
      },
    },
    {
      key: 'type',
      header: 'Type',
      render: (item: Case) => (
        <div className="flex items-center gap-2">
          {item.type === 'medical' ? (
            <Stethoscope className="w-4 h-4 text-info" />
          ) : (
            <GraduationCap className="w-4 h-4 text-accent" />
          )}
          <span className="capitalize">{item.type}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: Case) => <StatusBadge status={item.status} />,
    },
    {
      key: 'cost',
      header: 'Est. Cost',
      render: (item: Case) => (
        <span className="font-medium">
          ${item.estimatedCost?.toLocaleString() || 'N/A'}
        </span>
      ),
    },
    {
      key: 'updatedAt',
      header: 'Updated',
      render: (item: Case) => (
        <span className="text-sm text-muted-foreground">
          {new Date(item.updatedAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'action',
      header: '',
      render: () => <ArrowRight className="w-4 h-4 text-muted-foreground" />,
      className: 'w-10',
    },
  ];

  const statusOptions: (CaseStatus | 'all')[] = ['all', 'new', 'review', 'pending', 'approved', 'under_treatment', 'under_admission', 'completed', 'closed'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-muted-foreground">
          {filteredCases.length} {filteredCases.length === 1 ? 'case' : 'cases'} assigned to you
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by case ID, title, or client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="flex gap-3">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as CaseType | 'all')}
            className="input-field w-auto min-w-[140px]"
          >
            <option value="all">All Types</option>
            <option value="medical">Medical</option>
            <option value="academic">Academic</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as CaseStatus | 'all')}
            className="input-field w-auto min-w-[160px]"
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s === 'all' ? 'All Statuses' : s.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Type quick filters */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: 'Medical', count: myCases.filter(c => c.type === 'medical').length, icon: Stethoscope, color: 'text-info' },
          { label: 'Academic', count: myCases.filter(c => c.type === 'academic').length, icon: GraduationCap, color: 'text-accent' },
        ].map((stat) => (
          <div
            key={stat.label}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer transition-all',
              typeFilter === stat.label.toLowerCase()
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/30'
            )}
            onClick={() => setTypeFilter(typeFilter === stat.label.toLowerCase() ? 'all' : stat.label.toLowerCase() as CaseType)}
          >
            <stat.icon className={cn('w-4 h-4', stat.color)} />
            <span className="text-sm font-medium">{stat.label}</span>
            <span className="text-sm text-muted-foreground">({stat.count})</span>
          </div>
        ))}
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredCases}
        keyExtractor={(item) => item.caseId}
        onRowClick={(item) => navigate(`/agent/cases/${item.caseId}`)}
        emptyMessage="No cases assigned to you yet"
      />
    </div>
  );
};

export default AgentCases;
