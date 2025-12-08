import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, User, Stethoscope, GraduationCap, Globe, ArrowRight } from 'lucide-react';
import DataTable from '@/components/ui/DataTable';
import { useDataStore } from '@/contexts/DataStore';
import { User as UserType, ClientType } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import AddClientForm from '@/components/forms/AddClientForm';

const AdminClients: React.FC = () => {
  const navigate = useNavigate();
  const { users, cases } = useDataStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<ClientType | 'all'>('all');
  const [addClientOpen, setAddClientOpen] = useState(false);

  const clients = users.filter(u => u.role === 'client');

  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || c.clientType === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const getClientCasesCount = (clientId: number) => {
    return cases.filter(c => c.clientId === clientId).length;
  };

  const getActiveCasesCount = (clientId: number) => {
    return cases.filter(c => 
      c.clientId === clientId && 
      !['completed', 'closed'].includes(c.status)
    ).length;
  };

  const getClientTypeIcon = (type?: ClientType) => {
    switch (type) {
      case 'patient':
        return <Stethoscope className="w-4 h-4 text-info" />;
      case 'student':
        return <GraduationCap className="w-4 h-4 text-accent" />;
      case 'visitor':
        return <Globe className="w-4 h-4 text-muted-foreground" />;
      default:
        return <User className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Client',
      render: (item: UserType) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
            {item.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-foreground">{item.name}</p>
            <p className="text-sm text-muted-foreground">{item.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (item: UserType) => (
        <div className="flex items-center gap-2">
          {getClientTypeIcon(item.clientType)}
          <span className="capitalize">{item.clientType}</span>
        </div>
      ),
    },
    {
      key: 'country',
      header: 'Country',
      render: (item: UserType) => (
        <span>{item.country || 'N/A'}</span>
      ),
    },
    {
      key: 'cases',
      header: 'Total Cases',
      render: (item: UserType) => (
        <span className="font-medium">{getClientCasesCount(item.id)}</span>
      ),
    },
    {
      key: 'active',
      header: 'Active Cases',
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

  const typeStats = [
    { type: 'patient' as ClientType, label: 'Patients', icon: Stethoscope, color: 'text-info' },
    { type: 'student' as ClientType, label: 'Students', icon: GraduationCap, color: 'text-accent' },
    { type: 'visitor' as ClientType, label: 'Visitors', icon: Globe, color: 'text-muted-foreground' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-muted-foreground">
            {filteredClients.length} {filteredClients.length === 1 ? 'client' : 'clients'} registered
          </p>
        </div>
        <button className="btn-primary" onClick={() => setAddClientOpen(true)}>
          <Plus className="w-4 h-4" />
          Add Client
        </button>
      </div>

      <AddClientForm open={addClientOpen} onOpenChange={setAddClientOpen} />

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {typeStats.map((stat) => {
          const count = clients.filter(c => c.clientType === stat.type).length;
          return (
            <div
              key={stat.type}
              className={cn(
                'bg-card rounded-xl border p-4 cursor-pointer transition-all hover:shadow-md',
                typeFilter === stat.type ? 'border-primary shadow-md' : 'border-border'
              )}
              onClick={() => setTypeFilter(typeFilter === stat.type ? 'all' : stat.type)}
            >
              <div className="flex items-center gap-3">
                <div className={cn('p-2 rounded-lg bg-muted', stat.color)}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{count}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
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
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as ClientType | 'all')}
          className="input-field w-auto min-w-[150px]"
        >
          <option value="all">All Types</option>
          <option value="patient">Patients</option>
          <option value="student">Students</option>
          <option value="visitor">Visitors</option>
        </select>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredClients}
        keyExtractor={(item) => item.id}
        onRowClick={(item) => navigate(`/admin/clients/${item.id}`)}
        emptyMessage="No clients found matching your criteria"
      />
    </div>
  );
};

export default AdminClients;
