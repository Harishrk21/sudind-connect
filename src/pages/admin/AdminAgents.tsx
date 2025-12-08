import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, UserCheck, Phone, Mail, ArrowRight, MapPin } from 'lucide-react';
import DataTable from '@/components/ui/DataTable';
import { useDataStore } from '@/contexts/DataStore';
import { User as UserType } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import AddAgentForm from '@/components/forms/AddAgentForm';

const AdminAgents: React.FC = () => {
  const navigate = useNavigate();
  const { users, cases } = useDataStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [addAgentOpen, setAddAgentOpen] = useState(false);

  const agents = users.filter(u => u.role === 'agent');

  const filteredAgents = agents.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getAgentCasesCount = (agentId: number) => {
    return cases.filter(c => c.agentId === agentId).length;
  };

  const getActiveCasesCount = (agentId: number) => {
    return cases.filter(c => 
      c.agentId === agentId && 
      !['completed', 'closed'].includes(c.status)
    ).length;
  };

  const getCompletedCasesCount = (agentId: number) => {
    return cases.filter(c => 
      c.agentId === agentId && 
      ['completed', 'closed'].includes(c.status)
    ).length;
  };

  const columns = [
    {
      key: 'name',
      header: 'Agent',
      render: (item: UserType) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-medium">
            {item.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-foreground">{item.name}</p>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span>{item.country}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'contact',
      header: 'Contact',
      render: (item: UserType) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-3 h-3 text-muted-foreground" />
            <span>{item.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="w-3 h-3" />
            <span>{item.phone}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'totalCases',
      header: 'Total Cases',
      render: (item: UserType) => (
        <span className="font-medium">{getAgentCasesCount(item.id)}</span>
      ),
    },
    {
      key: 'activeCases',
      header: 'Active',
      render: (item: UserType) => {
        const count = getActiveCasesCount(item.id);
        return (
          <span className={cn(
            'font-medium',
            count > 0 ? 'text-warning' : 'text-muted-foreground'
          )}>
            {count}
          </span>
        );
      },
    },
    {
      key: 'completedCases',
      header: 'Completed',
      render: (item: UserType) => (
        <span className="text-success font-medium">{getCompletedCasesCount(item.id)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: UserType) => (
        <span className={cn(
          'status-badge',
          item.status === 'active' ? 'bg-success/15 text-success' : 'bg-muted text-muted-foreground'
        )}>
          {item.status}
        </span>
      ),
    },
    {
      key: 'joined',
      header: 'Joined',
      render: (item: UserType) => (
        <span className="text-sm text-muted-foreground">
          {new Date(item.createdAt).toLocaleDateString()}
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

  const activeAgents = agents.filter(a => a.status === 'active').length;
  const inactiveAgents = agents.filter(a => a.status === 'inactive').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-muted-foreground">
            {filteredAgents.length} India {filteredAgents.length === 1 ? 'agent' : 'agents'}
          </p>
        </div>
        <button className="btn-primary" onClick={() => setAddAgentOpen(true)}>
          <Plus className="w-4 h-4" />
          Add Agent
        </button>
      </div>

      <AddAgentForm open={addAgentOpen} onOpenChange={setAddAgentOpen} />

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          className={cn(
            'bg-card rounded-xl border p-4 cursor-pointer transition-all hover:shadow-md',
            statusFilter === 'active' ? 'border-success shadow-md' : 'border-border'
          )}
          onClick={() => setStatusFilter(statusFilter === 'active' ? 'all' : 'active')}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <UserCheck className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{activeAgents}</p>
              <p className="text-sm text-muted-foreground">Active Agents</p>
            </div>
          </div>
        </div>
        <div
          className={cn(
            'bg-card rounded-xl border p-4 cursor-pointer transition-all hover:shadow-md',
            statusFilter === 'inactive' ? 'border-muted-foreground shadow-md' : 'border-border'
          )}
          onClick={() => setStatusFilter(statusFilter === 'inactive' ? 'all' : 'inactive')}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">
              <UserCheck className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{inactiveAgents}</p>
              <p className="text-sm text-muted-foreground">Inactive Agents</p>
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
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
          className="input-field w-auto min-w-[150px]"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredAgents}
        keyExtractor={(item) => item.id}
        onRowClick={(item) => navigate(`/admin/agents/${item.id}`)}
        emptyMessage="No agents found matching your criteria"
      />
    </div>
  );
};

export default AdminAgents;
