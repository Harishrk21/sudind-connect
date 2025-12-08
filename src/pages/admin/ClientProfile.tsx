import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Globe, 
  Calendar, 
  CheckCircle2, 
  XCircle,
  Stethoscope,
  GraduationCap,
  FolderKanban,
  DollarSign,
  FileText,
  Clock,
} from 'lucide-react';
import { useDataStore } from '@/contexts/DataStore';
import { getUserById, getCasesByClient, getInvoicesByCase } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import StatusBadge from '@/components/ui/StatusBadge';
import DataTable from '@/components/ui/DataTable';

const ClientProfile: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const { users, cases, invoices } = useDataStore();

  const client = clientId ? getUserById(parseInt(clientId)) : undefined;
  const clientCases = client ? getCasesByClient(client.id, cases) : [];
  const allInvoices = clientCases.flatMap(c => getInvoicesByCase(c.caseId, invoices));
  
  const activeCases = clientCases.filter(c => !['completed', 'closed'].includes(c.status));
  const completedCases = clientCases.filter(c => ['completed', 'closed'].includes(c.status));
  const totalPaid = allInvoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);
  const pendingAmount = allInvoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0);

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <XCircle className="w-12 h-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Client Not Found</h2>
        <p className="text-muted-foreground mb-4">The client you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/admin/clients')} className="btn-primary">
          Back to Clients
        </button>
      </div>
    );
  }

  const getClientTypeIcon = () => {
    switch (client.clientType) {
      case 'patient':
        return <Stethoscope className="w-5 h-5 text-info" />;
      case 'student':
        return <GraduationCap className="w-5 h-5 text-accent" />;
      default:
        return <User className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getClientTypeLabel = () => {
    switch (client.clientType) {
      case 'patient':
        return 'Patient';
      case 'student':
        return 'Student';
      case 'visitor':
        return 'Visitor';
      default:
        return 'Client';
    }
  };

  const caseColumns = [
    {
      key: 'caseId',
      header: 'Case ID',
      render: (item: typeof clientCases[0]) => (
        <span className="font-medium text-foreground">{item.caseId}</span>
      ),
    },
    {
      key: 'title',
      header: 'Title',
      render: (item: typeof clientCases[0]) => (
        <span className="truncate max-w-[200px] block">{item.title}</span>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (item: typeof clientCases[0]) => (
        <span className={cn(
          'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
          item.type === 'medical' ? 'bg-info/10 text-info' : 'bg-accent/10 text-accent'
        )}>
          {item.type === 'medical' ? <Stethoscope className="w-3 h-3" /> : <GraduationCap className="w-3 h-3" />}
          {item.type}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: typeof clientCases[0]) => <StatusBadge status={item.status} />,
    },
    {
      key: 'created',
      header: 'Created',
      render: (item: typeof clientCases[0]) => (
        <span className="text-sm text-muted-foreground">
          {new Date(item.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'action',
      header: '',
      render: (item: typeof clientCases[0]) => (
        <button
          onClick={() => navigate(`/admin/cases/${item.caseId}`)}
          className="text-primary hover:underline text-sm"
        >
          View
        </button>
      ),
      className: 'w-20',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <button
          onClick={() => navigate('/admin/clients')}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-foreground">{client.name}</h1>
            <span className={cn(
              'flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium',
              client.status === 'active' ? 'bg-success/15 text-success' : 'bg-destructive/15 text-destructive'
            )}>
              {client.status === 'active' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              {client.status}
            </span>
            {client.clientType && (
              <span className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-muted">
                {getClientTypeIcon()}
                {getClientTypeLabel()}
              </span>
            )}
          </div>
          <p className="text-muted-foreground">{client.email}</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <FolderKanban className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{clientCases.length}</p>
              <p className="text-sm text-muted-foreground">Total Cases</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <Clock className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{activeCases.length}</p>
              <p className="text-sm text-muted-foreground">Active Cases</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <CheckCircle2 className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{completedCases.length}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <DollarSign className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">${totalPaid.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Paid</p>
            </div>
          </div>
        </div>
      </div>

      {/* Client Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4">Client Information</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Full Name</p>
                <p className="font-medium text-foreground">{client.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <Mail className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-medium text-foreground">{client.email}</p>
              </div>
            </div>
            {client.phone && (
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-medium text-foreground">{client.phone}</p>
                </div>
              </div>
            )}
            {client.country && (
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Country</p>
                  <p className="font-medium text-foreground">{client.country}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Member Since</p>
                <p className="font-medium text-foreground">
                  {new Date(client.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4">Financial Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Invoices</span>
              <span className="font-semibold text-foreground">{allInvoices.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Paid Amount</span>
              <span className="font-semibold text-success">${totalPaid.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Pending Amount</span>
              <span className="font-semibold text-warning">${pendingAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-border">
              <span className="font-medium text-foreground">Total Amount</span>
              <span className="font-bold text-foreground">
                ${(totalPaid + pendingAmount).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cases Table */}
      <div>
        <h3 className="font-semibold text-foreground mb-4">Cases History</h3>
        <DataTable
          columns={caseColumns}
          data={clientCases}
          keyExtractor={(item) => item.caseId}
          emptyMessage="No cases found for this client"
        />
      </div>
    </div>
  );
};

export default ClientProfile;

