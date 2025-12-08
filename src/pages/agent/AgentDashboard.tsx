import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderKanban, Clock, CheckCircle2, Upload, ArrowRight, Stethoscope, GraduationCap, MessageSquare } from 'lucide-react';
import KPICard from '@/components/ui/KPICard';
import StatusBadge from '@/components/ui/StatusBadge';
import DataTable from '@/components/ui/DataTable';
import { useAuth } from '@/contexts/AuthContext';
import { getCasesByAgent, getUserById, getMessagesByUser, Case } from '@/lib/mockData';

const AgentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) return null;

  const myCases = getCasesByAgent(user.id);
  const activeCases = myCases.filter(c => !['completed', 'closed'].includes(c.status));
  const completedCases = myCases.filter(c => ['completed', 'closed'].includes(c.status));
  const pendingCases = myCases.filter(c => ['new', 'review', 'pending'].includes(c.status));
  const unreadMessages = getMessagesByUser(user.id).filter(m => !m.read && m.receiverId === user.id);

  const recentCases = [...myCases]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const columns = [
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

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-xl font-semibold text-foreground">Welcome back, {user.name.split(' ')[0]}!</h2>
        <p className="text-muted-foreground mt-1">Here's an overview of your assigned cases.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="My Cases"
          value={myCases.length}
          subtitle="Total assigned"
          icon={FolderKanban}
          variant="primary"
        />
        <KPICard
          title="Active Cases"
          value={activeCases.length}
          subtitle="In progress"
          icon={Clock}
          variant="warning"
        />
        <KPICard
          title="Completed"
          value={completedCases.length}
          subtitle="This month"
          icon={CheckCircle2}
          variant="success"
        />
        <KPICard
          title="Unread Messages"
          value={unreadMessages.length}
          subtitle="New messages"
          icon={MessageSquare}
          variant="accent"
        />
      </div>

      {/* Pending actions */}
      {pendingCases.length > 0 && (
        <div className="bg-warning/10 border border-warning/20 rounded-xl p-4 flex items-center gap-4">
          <div className="p-2 rounded-lg bg-warning/20">
            <Clock className="w-5 h-5 text-warning" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">
              You have {pendingCases.length} {pendingCases.length === 1 ? 'case' : 'cases'} requiring attention
            </p>
            <p className="text-sm text-muted-foreground">Review and upload necessary documents</p>
          </div>
          <button
            onClick={() => navigate('/agent/cases')}
            className="btn-secondary"
          >
            View Cases
          </button>
        </div>
      )}

      {/* Recent Cases */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Recent Cases</h3>
          <button
            onClick={() => navigate('/agent/cases')}
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            View all <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <DataTable
          columns={columns}
          data={recentCases}
          keyExtractor={(item) => item.caseId}
          onRowClick={(item) => navigate(`/agent/cases/${item.caseId}`)}
          emptyMessage="No cases assigned yet"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => navigate('/agent/upload')}
          className="bg-card rounded-xl border border-border p-4 flex items-center gap-4 hover:shadow-md transition-all hover:border-primary/30"
        >
          <div className="p-3 rounded-lg bg-primary/10">
            <Upload className="w-5 h-5 text-primary" />
          </div>
          <div className="text-left">
            <p className="font-medium text-foreground">Upload Documents</p>
            <p className="text-sm text-muted-foreground">Add files to cases</p>
          </div>
          <ArrowRight className="w-5 h-5 text-muted-foreground ml-auto" />
        </button>
        <button
          onClick={() => navigate('/agent/messages')}
          className="bg-card rounded-xl border border-border p-4 flex items-center gap-4 hover:shadow-md transition-all hover:border-primary/30"
        >
          <div className="p-3 rounded-lg bg-accent/10">
            <MessageSquare className="w-5 h-5 text-accent" />
          </div>
          <div className="text-left">
            <p className="font-medium text-foreground">Messages</p>
            <p className="text-sm text-muted-foreground">
              {unreadMessages.length > 0 ? `${unreadMessages.length} unread` : 'View conversations'}
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-muted-foreground ml-auto" />
        </button>
      </div>
    </div>
  );
};

export default AgentDashboard;
