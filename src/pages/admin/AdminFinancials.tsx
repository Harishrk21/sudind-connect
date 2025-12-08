import React, { useState } from 'react';
import { DollarSign, TrendingUp, Clock, CheckCircle2, Download, Search, ArrowRight, Plus } from 'lucide-react';
import KPICard from '@/components/ui/KPICard';
import DataTable from '@/components/ui/DataTable';
import { useDataStore } from '@/contexts/DataStore';
import { getUserById, Invoice } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import GenerateInvoiceForm from '@/components/forms/GenerateInvoiceForm';

const AdminFinancials: React.FC = () => {
  const { invoices, users } = useDataStore();
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'paid' | 'overdue'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [generateInvoiceOpen, setGenerateInvoiceOpen] = useState(false);

  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);
  const pendingAmount = invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0);
  const overdueAmount = invoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.amount, 0);

  const filteredInvoices = invoices.filter((inv) => {
    const client = users.find(u => u.id === inv.clientId);
    const matchesSearch =
      inv.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      key: 'invoiceId',
      header: 'Invoice',
      render: (item: Invoice) => (
        <span className="font-medium text-foreground">{item.invoiceId}</span>
      ),
    },
    {
      key: 'client',
      header: 'Client',
      render: (item: Invoice) => {
        const client = users.find(u => u.id === item.clientId);
        return <span>{client?.name || 'Unknown'}</span>;
      },
    },
    {
      key: 'case',
      header: 'Case',
      render: (item: Invoice) => (
        <span className="text-muted-foreground">{item.caseId}</span>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (item: Invoice) => (
        <span className="truncate max-w-[200px] block">{item.description}</span>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (item: Invoice) => (
        <span className="font-semibold text-foreground">
          ${item.amount.toLocaleString()} {item.currency}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: Invoice) => (
        <span className={cn(
          'status-badge',
          item.status === 'paid' && 'bg-success/15 text-success',
          item.status === 'pending' && 'bg-warning/15 text-warning',
          item.status === 'overdue' && 'bg-destructive/15 text-destructive',
        )}>
          {item.status}
        </span>
      ),
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      render: (item: Invoice) => (
        <span className="text-sm text-muted-foreground">
          {new Date(item.dueDate).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'action',
      header: '',
      render: () => <Download className="w-4 h-4 text-muted-foreground" />,
      className: 'w-10',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Financial Management</h2>
          <p className="text-muted-foreground">Manage invoices and payments</p>
        </div>
        <button className="btn-primary" onClick={() => setGenerateInvoiceOpen(true)}>
          <Plus className="w-4 h-4" />
          Generate Invoice
        </button>
      </div>

      <GenerateInvoiceForm open={generateInvoiceOpen} onOpenChange={setGenerateInvoiceOpen} />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPICard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          subtitle="Collected payments"
          icon={DollarSign}
          variant="success"
          trend={{ value: 15, positive: true }}
        />
        <KPICard
          title="Pending"
          value={`$${pendingAmount.toLocaleString()}`}
          subtitle={`${invoices.filter(i => i.status === 'pending').length} invoices`}
          icon={Clock}
          variant="warning"
        />
        <KPICard
          title="Overdue"
          value={`$${overdueAmount.toLocaleString()}`}
          subtitle={`${invoices.filter(i => i.status === 'overdue').length} invoices`}
          icon={TrendingUp}
          variant="default"
        />
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { value: 'all', label: 'All', count: invoices.length },
          { value: 'paid', label: 'Paid', count: invoices.filter(i => i.status === 'paid').length, color: 'text-success' },
          { value: 'pending', label: 'Pending', count: invoices.filter(i => i.status === 'pending').length, color: 'text-warning' },
          { value: 'overdue', label: 'Overdue', count: invoices.filter(i => i.status === 'overdue').length, color: 'text-destructive' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value as typeof statusFilter)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg border transition-all',
              statusFilter === tab.value
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-border hover:border-primary/30'
            )}
          >
            <span className={cn('font-medium', tab.color)}>{tab.label}</span>
            <span className="text-sm text-muted-foreground">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search invoices..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredInvoices}
        keyExtractor={(item) => item.invoiceId}
        emptyMessage="No invoices found"
      />
    </div>
  );
};

export default AdminFinancials;
