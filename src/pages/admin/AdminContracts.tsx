import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, FileText, Archive, Download, ArrowRight, Stethoscope, GraduationCap } from 'lucide-react';
import DataTable from '@/components/ui/DataTable';
import { useDataStore } from '@/contexts/DataStore';
import { getUserById, getCaseById, Contract } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import AddContractForm from '@/components/forms/AddContractForm';

const AdminContracts: React.FC = () => {
  const navigate = useNavigate();
  const { contracts, users, cases } = useDataStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'active' | 'expired' | 'archived'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'medical' | 'academic'>('all');
  const [addContractOpen, setAddContractOpen] = useState(false);

  const filteredContracts = contracts.filter((c) => {
    const matchesSearch =
      c.contractId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getUserById(c.clientId)?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesType = typeFilter === 'all' || c.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const columns = [
    {
      key: 'contractId',
      header: 'Contract ID',
      render: (item: Contract) => (
        <span className="font-medium text-foreground">{item.contractId}</span>
      ),
    },
    {
      key: 'title',
      header: 'Title',
      render: (item: Contract) => (
        <div>
          <p className="font-medium text-foreground truncate max-w-[250px]">{item.title}</p>
          <p className="text-xs text-muted-foreground">{item.caseId}</p>
        </div>
      ),
    },
    {
      key: 'client',
      header: 'Client',
      render: (item: Contract) => {
        const client = getUserById(item.clientId);
        return <span>{client?.name || 'Unknown'}</span>;
      },
    },
    {
      key: 'type',
      header: 'Type',
      render: (item: Contract) => (
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
      render: (item: Contract) => (
        <span className={cn(
          'status-badge',
          item.status === 'active' && 'bg-success/15 text-success',
          item.status === 'draft' && 'bg-warning/15 text-warning',
          item.status === 'archived' && 'bg-muted text-muted-foreground',
          item.status === 'expired' && 'bg-destructive/15 text-destructive',
        )}>
          {item.status}
        </span>
      ),
    },
    {
      key: 'dates',
      header: 'Period',
      render: (item: Contract) => (
        <div className="text-sm">
          <p className="text-foreground">{new Date(item.startDate).toLocaleDateString()}</p>
          <p className="text-muted-foreground">to {new Date(item.endDate).toLocaleDateString()}</p>
        </div>
      ),
    },
    {
      key: 'action',
      header: '',
      render: () => <ArrowRight className="w-4 h-4 text-muted-foreground" />,
      className: 'w-10',
    },
  ];

  const { archiveContract, addNotification } = useDataStore();
  const activeContracts = contracts.filter(c => c.status === 'active').length;
  const archivedContracts = contracts.filter(c => c.status === 'archived').length;

  const handleArchive = (contractId: string) => {
    archiveContract(contractId);
    addNotification({
      userId: 1,
      title: 'Contract Archived',
      message: `Contract ${contractId} has been archived`,
      type: 'info',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Contract Management</h2>
          <p className="text-muted-foreground">
            {filteredContracts.length} {filteredContracts.length === 1 ? 'contract' : 'contracts'} found
          </p>
        </div>
        <button className="btn-primary" onClick={() => setAddContractOpen(true)}>
          <Plus className="w-4 h-4" />
          New Contract
        </button>
      </div>

      <AddContractForm open={addContractOpen} onOpenChange={setAddContractOpen} />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <FileText className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{activeContracts}</p>
              <p className="text-sm text-muted-foreground">Active Contracts</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">
              <Archive className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{archivedContracts}</p>
              <p className="text-sm text-muted-foreground">Archived Contracts</p>
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
            placeholder="Search by contract ID, title, or client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
          className="input-field w-auto min-w-[140px]"
        >
          <option value="all">All Types</option>
          <option value="medical">Medical</option>
          <option value="academic">Academic</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="input-field w-auto min-w-[150px]"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredContracts}
        keyExtractor={(item) => item.contractId}
        onRowClick={(item) => navigate(`/admin/contracts/${item.contractId}`)}
        emptyMessage="No contracts found matching your criteria"
      />
    </div>
  );
};

export default AdminContracts;

