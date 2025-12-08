import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  FileText, 
  Calendar, 
  User, 
  CheckCircle2, 
  XCircle,
  Clock,
  Archive,
  Stethoscope,
  GraduationCap,
  Download,
} from 'lucide-react';
import { useDataStore } from '@/contexts/DataStore';
import { getUserById, getCaseById } from '@/lib/mockData';
import { cn, downloadDemoFile, DocumentData } from '@/lib/utils';
import StatusBadge from '@/components/ui/StatusBadge';

const ContractDetails: React.FC = () => {
  const { contractId } = useParams<{ contractId: string }>();
  const navigate = useNavigate();
  const { contracts, users, cases } = useDataStore();

  const contract = contractId ? contracts.find(c => c.contractId === contractId) : undefined;
  const client = contract ? getUserById(contract.clientId) : undefined;
  const agent = contract ? getUserById(contract.agentId) : undefined;
  const caseData = contract ? getCaseById(contract.caseId, cases) : undefined;

  if (!contract) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <XCircle className="w-12 h-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Contract Not Found</h2>
        <p className="text-muted-foreground mb-4">The contract you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/admin/contracts')} className="btn-primary">
          Back to Contracts
        </button>
      </div>
    );
  }

  const getStatusIcon = () => {
    switch (contract.status) {
      case 'active':
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      case 'draft':
        return <Clock className="w-5 h-5 text-warning" />;
      case 'expired':
        return <XCircle className="w-5 h-5 text-destructive" />;
      case 'archived':
        return <Archive className="w-5 h-5 text-muted-foreground" />;
      default:
        return <FileText className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <button
          onClick={() => navigate('/admin/contracts')}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-foreground">{contract.contractId}</h1>
            <span className={cn(
              'flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium',
              contract.status === 'active' && 'bg-success/15 text-success',
              contract.status === 'draft' && 'bg-warning/15 text-warning',
              contract.status === 'expired' && 'bg-destructive/15 text-destructive',
              contract.status === 'archived' && 'bg-muted text-muted-foreground',
            )}>
              {getStatusIcon()}
              {contract.status}
            </span>
            <span className={cn(
              'flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium',
              contract.type === 'medical' ? 'bg-info/10 text-info' : 'bg-accent/10 text-accent'
            )}>
              {contract.type === 'medical' ? <Stethoscope className="w-4 h-4" /> : <GraduationCap className="w-4 h-4" />}
              {contract.type}
            </span>
          </div>
          <p className="text-foreground font-medium">{contract.title}</p>
        </div>
        <button
          onClick={() => {
            const docData: DocumentData = {
              filename: `contract-${contract.contractId}.pdf`,
              type: 'contract',
              caseId: contract.caseId,
            };
            downloadDemoFile(`contract-${contract.contractId}.pdf`, 'document', docData);
          }}
          className="btn-secondary"
        >
          <Download className="w-4 h-4" />
          Download Contract
        </button>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Client</p>
              <p className="font-medium text-foreground">{client?.name || 'Unknown'}</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <User className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Agent</p>
              <p className="font-medium text-foreground">{agent?.name || 'Unknown'}</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-info/10">
              <FileText className="w-5 h-5 text-info" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Case</p>
              <p className="font-medium text-foreground">{contract.caseId}</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <Calendar className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Period</p>
              <p className="font-medium text-foreground text-sm">
                {new Date(contract.startDate).toLocaleDateString()} - {new Date(contract.endDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contract Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4">Contract Information</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Contract ID</span>
              <span className="font-medium text-foreground">{contract.contractId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Title</span>
              <span className="font-medium text-foreground">{contract.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type</span>
              <span className="font-medium text-foreground capitalize">{contract.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <StatusBadge status={contract.status as any} />
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Start Date</span>
              <span className="font-medium text-foreground">
                {new Date(contract.startDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">End Date</span>
              <span className="font-medium text-foreground">
                {new Date(contract.endDate).toLocaleDateString()}
              </span>
            </div>
            {contract.createdAt && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span className="font-medium text-foreground">
                  {new Date(contract.createdAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4">Parties Involved</h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Client</p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                  {client?.name.charAt(0) || 'C'}
                </div>
                <div>
                  <p className="font-medium text-foreground">{client?.name || 'Unknown'}</p>
                  <p className="text-sm text-muted-foreground">{client?.email}</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Agent</p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-medium">
                  {agent?.name.charAt(0) || 'A'}
                </div>
                <div>
                  <p className="font-medium text-foreground">{agent?.name || 'Unknown'}</p>
                  <p className="text-sm text-muted-foreground">{agent?.email}</p>
                </div>
              </div>
            </div>
            {caseData && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Related Case</p>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">{caseData.caseId}</p>
                    <p className="text-sm text-muted-foreground">{caseData.title}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contract Terms */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="font-semibold text-foreground mb-4">Contract Terms & Conditions</h3>
        <div className="prose prose-sm max-w-none">
          <div className="text-muted-foreground whitespace-pre-wrap">
            {contract.terms || 'No terms specified for this contract.'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractDetails;

