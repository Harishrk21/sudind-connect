import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderKanban, Clock, CheckCircle2, CreditCard, ArrowRight, Stethoscope, GraduationCap, MessageSquare, Upload, Bell } from 'lucide-react';
import KPICard from '@/components/ui/KPICard';
import StatusBadge from '@/components/ui/StatusBadge';
import { useAuth } from '@/contexts/AuthContext';
import { getCasesByClient, getInvoicesByCase, getNotificationsByUser, Case } from '@/lib/mockData';
import { cn } from '@/lib/utils';

const ClientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) return null;

  const myCases = getCasesByClient(user.id);
  const activeCases = myCases.filter(c => !['completed', 'closed'].includes(c.status));
  const completedCases = myCases.filter(c => ['completed', 'closed'].includes(c.status));
  
  const allInvoices = myCases.flatMap(c => getInvoicesByCase(c.caseId));
  const pendingPayments = allInvoices.filter(i => i.status === 'pending');
  const totalPending = pendingPayments.reduce((sum, i) => sum + i.amount, 0);
  
  const notifications = getNotificationsByUser(user.id).filter(n => !n.read);

  const getClientTypeLabel = () => {
    switch (user.clientType) {
      case 'patient':
        return 'Patient';
      case 'student':
        return 'Student';
      default:
        return 'Visitor';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-primary rounded-xl p-6 text-primary-foreground">
        <h2 className="text-2xl font-bold">Welcome back, {user.name.split(' ')[0]}!</h2>
        <p className="text-primary-foreground/80 mt-1">
          {getClientTypeLabel()} Portal • Your gateway to healthcare & education in India
        </p>
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 flex items-center gap-4">
          <div className="p-2 rounded-lg bg-accent/20">
            <Bell className="w-5 h-5 text-accent" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">
              You have {notifications.length} new {notifications.length === 1 ? 'notification' : 'notifications'}
            </p>
            <p className="text-sm text-muted-foreground">{notifications[0]?.message}</p>
          </div>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Active Cases"
          value={activeCases.length}
          subtitle="In progress"
          icon={FolderKanban}
          variant="primary"
        />
        <KPICard
          title="Completed"
          value={completedCases.length}
          subtitle="Successfully closed"
          icon={CheckCircle2}
          variant="success"
        />
        <KPICard
          title="Pending Payments"
          value={`$${totalPending.toLocaleString()}`}
          subtitle={`${pendingPayments.length} invoices`}
          icon={CreditCard}
          variant="warning"
        />
        <KPICard
          title="Notifications"
          value={notifications.length}
          subtitle="Unread"
          icon={Bell}
          variant="accent"
        />
      </div>

      {/* Active cases */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">My Cases</h3>
          <button
            onClick={() => navigate('/client/cases')}
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            View all <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        
        {myCases.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-8 text-center">
            <FolderKanban className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No cases yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Contact our team to start your medical or academic journey
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myCases.slice(0, 4).map((c) => (
              <div
                key={c.caseId}
                onClick={() => navigate(`/client/cases/${c.caseId}`)}
                className="bg-card rounded-xl border border-border p-5 cursor-pointer hover:shadow-md transition-all hover:border-primary/30"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {c.type === 'medical' ? (
                      <Stethoscope className="w-5 h-5 text-info" />
                    ) : (
                      <GraduationCap className="w-5 h-5 text-accent" />
                    )}
                    <span className="font-medium text-foreground">{c.caseId}</span>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
                <h4 className="font-medium text-foreground mb-1">{c.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {c.hospital || c.university}
                </p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <span className="text-sm text-muted-foreground">
                    Updated {new Date(c.updatedAt).toLocaleDateString()}
                  </span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pending payments */}
      {pendingPayments.length > 0 && (
        <div className="bg-warning/10 border border-warning/20 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <CreditCard className="w-5 h-5 text-warning" />
            <h3 className="font-semibold text-foreground">Pending Payments</h3>
          </div>
          <div className="space-y-2">
            {pendingPayments.slice(0, 2).map((inv) => (
              <div
                key={inv.invoiceId}
                className="flex items-center justify-between p-3 bg-card rounded-lg"
              >
                <div>
                  <p className="font-medium text-foreground">{inv.invoiceId}</p>
                  <p className="text-sm text-muted-foreground">{inv.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">${inv.amount.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Due {new Date(inv.dueDate).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate('/client/payments')}
            className="btn-primary w-full mt-3"
          >
            Make Payment
          </button>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => navigate('/client/upload')}
          className="bg-card rounded-xl border border-border p-4 flex items-center gap-4 hover:shadow-md transition-all hover:border-primary/30"
        >
          <div className="p-3 rounded-lg bg-primary/10">
            <Upload className="w-5 h-5 text-primary" />
          </div>
          <div className="text-left">
            <p className="font-medium text-foreground">Upload Documents</p>
            <p className="text-sm text-muted-foreground">Add files</p>
          </div>
        </button>
        <button
          onClick={() => navigate('/client/payments')}
          className="bg-card rounded-xl border border-border p-4 flex items-center gap-4 hover:shadow-md transition-all hover:border-primary/30"
        >
          <div className="p-3 rounded-lg bg-success/10">
            <CreditCard className="w-5 h-5 text-success" />
          </div>
          <div className="text-left">
            <p className="font-medium text-foreground">Payments</p>
            <p className="text-sm text-muted-foreground">View invoices</p>
          </div>
        </button>
        <button
          onClick={() => navigate('/client/messages')}
          className="bg-card rounded-xl border border-border p-4 flex items-center gap-4 hover:shadow-md transition-all hover:border-primary/30"
        >
          <div className="p-3 rounded-lg bg-accent/10">
            <MessageSquare className="w-5 h-5 text-accent" />
          </div>
          <div className="text-left">
            <p className="font-medium text-foreground">Messages</p>
            <p className="text-sm text-muted-foreground">Contact support</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ClientDashboard;
