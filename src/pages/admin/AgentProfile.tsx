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
  FolderKanban,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { useDataStore } from '@/contexts/DataStore';
import { getUserById, getCasesByAgent } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import StatusBadge from '@/components/ui/StatusBadge';
import DataTable from '@/components/ui/DataTable';

const AgentProfile: React.FC = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();
  const { users, cases } = useDataStore();

  const agent = agentId ? getUserById(parseInt(agentId)) : undefined;
  const agentCases = agent ? getCasesByAgent(agent.id, cases) : [];
  
  const activeCases = agentCases.filter(c => !['completed', 'closed'].includes(c.status));
  const completedCases = agentCases.filter(c => ['completed', 'closed'].includes(c.status));
  const pendingCases = agentCases.filter(c => ['new', 'review', 'pending'].includes(c.status));
  const completionRate = agentCases.length > 0 
    ? Math.round((completedCases.length / agentCases.length) * 100) 
    : 0;

  if (!agent) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <XCircle className="w-12 h-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Agent Not Found</h2>
        <p className="text-muted-foreground mb-4">The agent you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/admin/agents')} className="btn-primary">
          Back to Agents
        </button>
      </div>
    );
  }

  const caseColumns = [
    {
      key: 'caseId',
      header: 'Case ID',
      render: (item: typeof agentCases[0]) => (
        <span className="font-medium text-foreground">{item.caseId}</span>
      ),
    },
    {
      key: 'title',
      header: 'Title',
      render: (item: typeof agentCases[0]) => (
        <span className="truncate max-w-[200px] block">{item.title}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: typeof agentCases[0]) => <StatusBadge status={item.status} />,
    },
    {
      key: 'created',
      header: 'Created',
      render: (item: typeof agentCases[0]) => (
        <span className="text-sm text-muted-foreground">
          {new Date(item.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'action',
      header: '',
      render: (item: typeof agentCases[0]) => (
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
          onClick={() => navigate('/admin/agents')}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-foreground">{agent.name}</h1>
            <span className={cn(
              'flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium',
              agent.status === 'active' ? 'bg-success/15 text-success' : 'bg-destructive/15 text-destructive'
            )}>
              {agent.status === 'active' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              {agent.status}
            </span>
            {agent.country && (
              <span className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-muted">
                <Globe className="w-4 h-4" />
                {agent.country}
              </span>
            )}
          </div>
          <p className="text-muted-foreground">{agent.email}</p>
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
              <p className="text-2xl font-bold text-foreground">{agentCases.length}</p>
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
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{completionRate}%</p>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4">Agent Information</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Full Name</p>
                <p className="font-medium text-foreground">{agent.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <Mail className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-medium text-foreground">{agent.email}</p>
              </div>
            </div>
            {agent.phone && (
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-medium text-foreground">{agent.phone}</p>
                </div>
              </div>
            )}
            {agent.country && (
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Country</p>
                  <p className="font-medium text-foreground">{agent.country}</p>
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
                  {new Date(agent.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Cases Assigned</span>
              <span className="font-semibold text-foreground">{agentCases.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Active Cases</span>
              <span className="font-semibold text-warning">{activeCases.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Pending Review</span>
              <span className="font-semibold text-info">{pendingCases.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Completed Cases</span>
              <span className="font-semibold text-success">{completedCases.length}</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-border">
              <span className="font-medium text-foreground">Completion Rate</span>
              <span className="font-bold text-foreground">{completionRate}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cases Table */}
      <div>
        <h3 className="font-semibold text-foreground mb-4">Assigned Cases</h3>
        <DataTable
          columns={caseColumns}
          data={agentCases}
          keyExtractor={(item) => item.caseId}
          emptyMessage="No cases assigned to this agent"
        />
      </div>
    </div>
  );
};

export default AgentProfile;

