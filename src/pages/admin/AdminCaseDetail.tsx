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
  Forward,
  Upload,
} from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import { useDataStore } from '@/contexts/DataStore';
import { 
  getCaseById, 
  getUserById, 
  getDocumentsByCase, 
  getInvoicesByCase,
  CaseStatus,
  getStatusLabel,
} from '@/lib/mockData';
import { cn, downloadDemoFile, DocumentData } from '@/lib/utils';
import UpdateCaseStatusForm from '@/components/forms/UpdateCaseStatusForm';
import CaseTimeline from '@/components/ui/CaseTimeline';

const AdminCaseDetail: React.FC = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const { cases, users, documents, invoices, updateCase } = useDataStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'invoices' | 'timeline'>('overview');
  const [updateStatusOpen, setUpdateStatusOpen] = useState(false);

  const caseData = caseId ? cases.find(c => c.caseId === caseId) : undefined;
  const client = caseData ? users.find(u => u.id === caseData.clientId) : undefined;
  const agent = caseData ? users.find(u => u.id === caseData.agentId) : undefined;
  const caseDocuments = caseId ? documents.filter(d => d.caseId === caseId) : [];
  const caseInvoices = caseId ? invoices.filter(i => i.caseId === caseId) : [];

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
          <button className="btn-primary" onClick={() => setUpdateStatusOpen(true)}>Update Status</button>
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
                <span className="text-foreground">{caseDocuments.length} files</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Invoices</span>
                <span className="text-foreground">{caseInvoices.length} total</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="space-y-4">
          {/* Action buttons */}
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Documents</h3>
            <div className="flex gap-2">
              <button className="btn-secondary">
                <Upload className="w-4 h-4" />
                Upload Document
              </button>
              {caseDocuments.length > 0 && (
                <button className="btn-primary" onClick={() => {
                  // Forward all documents logic
                  if (caseData && (caseData.hospital || caseData.university)) {
                    const institution = caseData.hospital || caseData.university;
                    updateCase(caseData.caseId, { status: 'approved' });
                    // In a real app, this would trigger an API call to forward all documents
                    alert(`All ${caseDocuments.length} document(s) forwarded to ${institution}`);
                  } else {
                    alert('Please assign a hospital/university to this case first');
                  }
                }}>
                  <Forward className="w-4 h-4" />
                  Forward All to Institution
                </button>
              )}
            </div>
          </div>

          {/* Documents list */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            {caseDocuments.length === 0 ? (
              <div className="p-8 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No documents uploaded yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Upload documents to forward them to {caseData.type === 'medical' ? 'hospitals' : 'universities'} in India
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {caseDocuments.map((doc) => (
                  <div key={doc.docId} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-2 rounded-lg bg-muted">
                        <FileText className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground">{doc.filename}</p>
                          {doc.uploaderRole === 'client' && (
                            <span className="text-xs bg-info/15 text-info px-2 py-0.5 rounded">From Client</span>
                          )}
                          {doc.uploaderRole === 'agent' && (
                            <span className="text-xs bg-accent/15 text-accent px-2 py-0.5 rounded">From Agent</span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {doc.type.replace('_', ' ')} • {doc.size} • Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs bg-success/15 text-success px-2 py-0.5 rounded flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                            Encrypted
                          </span>
                          <span className="text-xs bg-info/15 text-info px-2 py-0.5 rounded">
                            Cloud Stored
                          </span>
                        </div>
                        {(caseData?.hospital || caseData?.university) ? (
                          <p className="text-xs text-muted-foreground mt-1">
                            Forwarded to: {caseData.hospital || caseData.university}
                          </p>
                        ) : (
                          <p className="text-xs text-warning mt-1">Not yet forwarded to institution</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                        title="Forward to Institution"
                        onClick={() => {
                          if (caseData && (caseData.hospital || caseData.university)) {
                            // Document forwarding logic
                            const institution = caseData.hospital || caseData.university;
                            updateCase(caseData.caseId, { 
                              status: caseData.status === 'approved' ? caseData.status : 'approved' 
                            });
                            // Add notification
                            // In a real app, this would trigger an API call to forward documents
                            alert(`Document "${doc.filename}" forwarded to ${institution}`);
                          } else {
                            alert('Please assign a hospital/university to this case first');
                          }
                        }}
                      >
                        <Forward className="w-4 h-4 text-primary" />
                      </button>
                      <button 
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                        onClick={() => {
                          const documentData: DocumentData = {
                            filename: doc.filename,
                            type: doc.type,
                            caseId: doc.caseId,
                            uploadedAt: doc.uploadedAt,
                            size: doc.size,
                            caseTitle: caseData?.title,
                          };
                          downloadDemoFile(doc.filename, 'document', documentData);
                        }}
                        title="Download Document"
                      >
                        <Download className="w-5 h-5 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Forwarding instructions */}
          {documents.length > 0 && (
            <div className="bg-accent/10 border border-accent/20 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Forward className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground mb-1">Document Forwarding</p>
                  <p className="text-sm text-muted-foreground">
                    Documents can be forwarded to {caseData?.type === 'medical' ? 'hospitals' : 'universities'} in India through our secure integration system. 
                    Select individual documents or use "Forward to Institution" to send all documents at once.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'invoices' && (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {caseInvoices.length === 0 ? (
            <div className="p-8 text-center">
              <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No invoices generated yet</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {caseInvoices.map((inv) => (
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

      {activeTab === 'timeline' && caseData && (
        <CaseTimeline
          caseStatus={caseData.status}
          caseType={caseData.type}
          createdAt={caseData.createdAt}
          updatedAt={caseData.updatedAt}
          showProgress={true}
        />
      )}

      {caseData && (
        <UpdateCaseStatusForm
          open={updateStatusOpen}
          onOpenChange={setUpdateStatusOpen}
          caseId={caseData.caseId}
          currentStatus={caseData.status}
        />
      )}
    </div>
  );
};

export default AdminCaseDetail;
