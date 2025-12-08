import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  UserCheck, 
  FolderKanban, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle2,
  FileText,
  ArrowRight,
  Stethoscope,
  GraduationCap,
} from 'lucide-react';
import KPICard from '@/components/ui/KPICard';
import StatusBadge from '@/components/ui/StatusBadge';
import DataTable from '@/components/ui/DataTable';
import { useDataStore } from '@/contexts/DataStore';
import { getUserById, Case, CaseStatus } from '@/lib/mockData';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { users, cases, invoices } = useDataStore();

  // Calculate KPIs
  const totalClients = users.filter(u => u.role === 'client').length;
  const activeAgents = users.filter(u => u.role === 'agent' && u.status === 'active').length;
  const totalCases = cases.length;
  const pendingCases = cases.filter(c => ['new', 'review', 'pending'].includes(c.status)).length;
  const activeCases = cases.filter(c => ['approved', 'under_treatment', 'under_admission'].includes(c.status)).length;
  const completedCases = cases.filter(c => ['completed', 'closed'].includes(c.status)).length;
  
  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);
  const pendingRevenue = invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0);
  
  const medicalCases = cases.filter(c => c.type === 'medical').length;
  const academicCases = cases.filter(c => c.type === 'academic').length;

  // Recent cases for table
  const recentCases = [...cases]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const caseColumns = [
    {
      key: 'caseId',
      header: 'Case ID',
      render: (item: Case) => (
        <span className="font-medium text-foreground">{item.caseId}</span>
      ),
    },
    {
      key: 'client',
      header: 'Client',
      render: (item: Case) => {
        const client = getUserById(item.clientId);
        return <span>{client?.name || 'Unknown'}</span>;
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
      key: 'updatedAt',
      header: 'Last Updated',
      render: (item: Case) => (
        <span className="text-muted-foreground text-sm">
          {new Date(item.updatedAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'action',
      header: '',
      render: () => (
        <ArrowRight className="w-4 h-4 text-muted-foreground" />
      ),
      className: 'w-10',
    },
  ];

  // Quick stats for case status distribution
  const statusCounts: { status: CaseStatus; count: number; label: string }[] = [
    { status: 'new', count: cases.filter(c => c.status === 'new').length, label: 'New' },
    { status: 'review', count: cases.filter(c => c.status === 'review').length, label: 'Review' },
    { status: 'pending', count: cases.filter(c => c.status === 'pending').length, label: 'Pending' },
    { status: 'approved', count: cases.filter(c => c.status === 'approved').length, label: 'Approved' },
    { status: 'under_treatment', count: cases.filter(c => c.status === 'under_treatment').length, label: 'Treatment' },
    { status: 'completed', count: cases.filter(c => c.status === 'completed').length, label: 'Completed' },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Clients"
          value={totalClients}
          subtitle="Registered users"
          icon={Users}
          variant="primary"
          trend={{ value: 12, positive: true }}
        />
        <KPICard
          title="Active Agents"
          value={activeAgents}
          subtitle="India partners"
          icon={UserCheck}
          variant="accent"
        />
        <KPICard
          title="Active Cases"
          value={activeCases}
          subtitle={`${pendingCases} pending`}
          icon={FolderKanban}
          variant="warning"
        />
        <KPICard
          title="Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          subtitle={`$${pendingRevenue.toLocaleString()} pending`}
          icon={DollarSign}
          variant="success"
          trend={{ value: 8, positive: true }}
        />
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="kpi-card flex items-center gap-4">
          <div className="p-3 rounded-xl bg-info/10">
            <Stethoscope className="w-6 h-6 text-info" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{medicalCases}</p>
            <p className="text-sm text-muted-foreground">Medical Cases</p>
          </div>
        </div>
        <div className="kpi-card flex items-center gap-4">
          <div className="p-3 rounded-xl bg-accent/10">
            <GraduationCap className="w-6 h-6 text-accent" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{academicCases}</p>
            <p className="text-sm text-muted-foreground">Academic Cases</p>
          </div>
        </div>
        <div className="kpi-card flex items-center gap-4">
          <div className="p-3 rounded-xl bg-success/10">
            <CheckCircle2 className="w-6 h-6 text-success" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{completedCases}</p>
            <p className="text-sm text-muted-foreground">Completed This Month</p>
          </div>
        </div>
      </div>

      {/* Status distribution */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="font-semibold text-foreground mb-4">Case Status Distribution</h3>
        <div className="flex flex-wrap gap-3">
          {statusCounts.map((s) => (
            <div
              key={s.status}
              className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg"
            >
              <StatusBadge status={s.status} />
              <span className="font-semibold text-foreground">{s.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Cases */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Recent Cases</h3>
          <button
            onClick={() => navigate('/admin/cases')}
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            View all <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <DataTable
          columns={caseColumns}
          data={recentCases}
          keyExtractor={(item) => item.caseId}
          onRowClick={(item) => navigate(`/admin/cases/${item.caseId}`)}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => navigate('/admin/clients')}
          className="bg-card rounded-xl border border-border p-4 flex items-center gap-4 hover:shadow-md transition-all hover:border-primary/30"
        >
          <div className="p-3 rounded-lg bg-primary/10">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div className="text-left">
            <p className="font-medium text-foreground">Manage Clients</p>
            <p className="text-sm text-muted-foreground">View all registered clients</p>
          </div>
          <ArrowRight className="w-5 h-5 text-muted-foreground ml-auto" />
        </button>
        <button
          onClick={() => navigate('/admin/agents')}
          className="bg-card rounded-xl border border-border p-4 flex items-center gap-4 hover:shadow-md transition-all hover:border-primary/30"
        >
          <div className="p-3 rounded-lg bg-accent/10">
            <UserCheck className="w-5 h-5 text-accent" />
          </div>
          <div className="text-left">
            <p className="font-medium text-foreground">Manage Agents</p>
            <p className="text-sm text-muted-foreground">View India partners</p>
          </div>
          <ArrowRight className="w-5 h-5 text-muted-foreground ml-auto" />
        </button>
        <button
          onClick={() => navigate('/admin/reports')}
          className="bg-card rounded-xl border border-border p-4 flex items-center gap-4 hover:shadow-md transition-all hover:border-primary/30"
        >
          <div className="p-3 rounded-lg bg-success/10">
            <FileText className="w-5 h-5 text-success" />
          </div>
          <div className="text-left">
            <p className="font-medium text-foreground">View Reports</p>
            <p className="text-sm text-muted-foreground">Analytics & summaries</p>
          </div>
          <ArrowRight className="w-5 h-5 text-muted-foreground ml-auto" />
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
