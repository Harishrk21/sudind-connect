import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Stethoscope, 
  GraduationCap, 
  User, 
  UserCheck,
  Building,
  Calendar,
  DollarSign,
  FileText,
  Download,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import { 
  getCaseById, 
  getUserById, 
  getDocumentsByCase, 
  getInvoicesByCase,
  CaseStatus,
  getStatusLabel,
} from '@/lib/mockData';
import { cn } from '@/lib/utils';

const AdminCaseDetail: React.FC = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'invoices' | 'timeline'>('overview');

  const caseData = caseId ? getCaseById(caseId) : undefined;
  const client = caseData ? getUserById(caseData.clientId) : undefined;
  const agent = caseData ? getUserById(caseData.agentId) : undefined;
  const documents = caseId ? getDocumentsByCase(caseId) : [];
  const invoices = caseId ? getInvoicesByCase(caseId) : [];

  if (!caseData) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Case Not Found</h2>
        <p className="text-muted-foreground mb-4">The case you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/admin/cases')} className="btn-primary">
          Back to Cases
        </button>
      </div>
    );
  }

  const statusTimeline: { status: CaseStatus; date?: string; completed: boolean }[] = [
    { status: 'new', date: caseData.createdAt, completed: true },
    { status: 'review', completed: ['review', 'pending', 'approved', 'under_treatment', 'under_admission', 'completed', 'closed'].includes(caseData.status) },
    { status: 'pending', completed: ['pending', 'approved', 'under_treatment', 'under_admission', 'completed', 'closed'].includes(caseData.status) },
    { status: 'approved', completed: ['approved', 'under_treatment', 'under_admission', 'completed', 'closed'].includes(caseData.status) },
    { status: caseData.type === 'medical' ? 'under_treatment' : 'under_admission', completed: ['under_treatment', 'under_admission', 'completed', 'closed'].includes(caseData.status) },
    { status: 'completed', date: caseData.status === 'completed' ? caseData.updatedAt : undefined, completed: ['completed', 'closed'].includes(caseData.status) },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'documents', label: `Documents (${documents.length})` },
    { id: 'invoices', label: `Invoices (${invoices.length})` },
    { id: 'timeline', label: 'Timeline' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <button
          onClick={() => navigate('/admin/cases')}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-foreground">{caseData.caseId}</h1>
            <StatusBadge status={caseData.status} />
            <span className={cn(
              'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
              caseData.type === 'medical' ? 'bg-info/10 text-info' : 'bg-accent/10 text-accent'
            )}>
              {caseData.type === 'medical' ? <Stethoscope className="w-3 h-3" /> : <GraduationCap className="w-3 h-3" />}
              {caseData.type}
            </span>
          </div>
          <p className="text-foreground font-medium">{caseData.title}</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary">
            <Send className="w-4 h-4" />
            Message
          </button>
          <button className="btn-primary">Update Status</button>
        </div>
      </div>

      {/* Quick info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Client</p>
              <p className="font-medium text-foreground">{client?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{client?.clientType}</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <UserCheck className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Agent</p>
              <p className="font-medium text-foreground">{agent?.name}</p>
              <p className="text-xs text-muted-foreground">{agent?.country}</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <Building className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{caseData.type === 'medical' ? 'Hospital' : 'University'}</p>
              <p className="font-medium text-foreground text-sm">{caseData.hospital || caseData.university}</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <DollarSign className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Estimated Cost</p>
              <p className="font-medium text-foreground">${caseData.estimatedCost?.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                'pb-3 text-sm font-medium transition-colors relative',
                activeTab === tab.id
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Case Description</h3>
            <p className="text-muted-foreground">{caseData.description}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Case Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span className="text-foreground">{new Date(caseData.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated</span>
                <span className="text-foreground">{new Date(caseData.updatedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Documents</span>
                <span className="text-foreground">{documents.length} files</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Invoices</span>
                <span className="text-foreground">{invoices.length} total</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {documents.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No documents uploaded yet</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {documents.map((doc) => (
                <div key={doc.docId} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{doc.filename}</p>
                      <p className="text-sm text-muted-foreground">
                        {doc.type.replace('_', ' ')} • {doc.size} • Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                    <Download className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'invoices' && (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {invoices.length === 0 ? (
            <div className="p-8 text-center">
              <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No invoices generated yet</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {invoices.map((inv) => (
                <div key={inv.invoiceId} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'p-2 rounded-lg',
                      inv.status === 'paid' ? 'bg-success/10' : 'bg-warning/10'
                    )}>
                      <DollarSign className={cn(
                        'w-5 h-5',
                        inv.status === 'paid' ? 'text-success' : 'text-warning'
                      )} />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{inv.invoiceId}</p>
                      <p className="text-sm text-muted-foreground">{inv.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">${inv.amount.toLocaleString()}</p>
                    <span className={cn(
                      'status-badge',
                      inv.status === 'paid' ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning'
                    )}>
                      {inv.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'timeline' && (
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="relative">
            {statusTimeline.map((step, index) => (
              <div key={step.status} className="flex gap-4 pb-6 last:pb-0">
                <div className="flex flex-col items-center">
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center',
                    step.completed ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
                  )}>
                    {step.completed ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Clock className="w-5 h-5" />
                    )}
                  </div>
                  {index < statusTimeline.length - 1 && (
                    <div className={cn(
                      'w-0.5 flex-1 mt-2',
                      step.completed ? 'bg-success' : 'bg-muted'
                    )} />
                  )}
                </div>
                <div className="flex-1 pt-1">
                  <p className={cn(
                    'font-medium',
                    step.completed ? 'text-foreground' : 'text-muted-foreground'
                  )}>
                    {getStatusLabel(step.status)}
                  </p>
                  {step.date && (
                    <p className="text-sm text-muted-foreground">
                      {new Date(step.date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCaseDetail;
