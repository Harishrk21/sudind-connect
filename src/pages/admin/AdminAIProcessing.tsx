import React, { useState } from 'react';
import { Brain, FileText, CheckCircle2, Clock, AlertCircle, Search, Filter } from 'lucide-react';
import DataTable from '@/components/ui/DataTable';
import { useDataStore } from '@/contexts/DataStore';
import { aiProcessings, AIProcessing } from '@/lib/mockData';
import { cn } from '@/lib/utils';

const AdminAIProcessing: React.FC = () => {
  const { cases } = useDataStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'ocr' | 'medical_extraction' | 'certificate_verification' | 'radiology_analysis'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'processing' | 'completed' | 'failed'>('all');

  const filteredProcessings = aiProcessings.filter((p) => {
    const matchesSearch = p.caseId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || p.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      ocr: 'OCR Extraction',
      medical_extraction: 'Medical Data Extraction',
      certificate_verification: 'Certificate Verification',
      radiology_analysis: 'Radiology Analysis',
    };
    return labels[type] || type;
  };

  const columns = [
    {
      key: 'caseId',
      header: 'Case ID',
      render: (item: AIProcessing) => (
        <span className="font-medium text-foreground">{item.caseId}</span>
      ),
    },
    {
      key: 'type',
      header: 'Processing Type',
      render: (item: AIProcessing) => (
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-primary" />
          <span>{getTypeLabel(item.type)}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: AIProcessing) => (
        <div className="flex items-center gap-2">
          {item.status === 'completed' ? (
            <CheckCircle2 className="w-4 h-4 text-success" />
          ) : item.status === 'processing' ? (
            <Clock className="w-4 h-4 text-warning" />
          ) : (
            <AlertCircle className="w-4 h-4 text-destructive" />
          )}
          <span className={cn(
            'status-badge capitalize',
            item.status === 'completed' && 'bg-success/15 text-success',
            item.status === 'processing' && 'bg-warning/15 text-warning',
            item.status === 'failed' && 'bg-destructive/15 text-destructive',
          )}>
            {item.status}
          </span>
        </div>
      ),
    },
    {
      key: 'confidence',
      header: 'Confidence',
      render: (item: AIProcessing) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden max-w-[100px]">
            <div
              className={cn(
                'h-full rounded-full',
                item.confidence >= 0.9 ? 'bg-success' : item.confidence >= 0.7 ? 'bg-warning' : 'bg-destructive'
              )}
              style={{ width: `${item.confidence * 100}%` }}
            />
          </div>
          <span className="text-sm font-medium">{(item.confidence * 100).toFixed(0)}%</span>
        </div>
      ),
    },
    {
      key: 'processedAt',
      header: 'Processed',
      render: (item: AIProcessing) => (
        <span className="text-sm text-muted-foreground">
          {new Date(item.processedAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'data',
      header: 'Extracted Data',
      render: (item: AIProcessing) => (
        <button className="text-sm text-primary hover:underline">
          View Details
        </button>
      ),
    },
  ];

  const completedCount = aiProcessings.filter(p => p.status === 'completed').length;
  const processingCount = aiProcessings.filter(p => p.status === 'processing').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">AI Processing & Analysis</h2>
        <p className="text-muted-foreground">
          Automated document processing, medical data extraction, and certificate verification
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{aiProcessings.length}</p>
              <p className="text-sm text-muted-foreground">Total Processings</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <CheckCircle2 className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{completedCount}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <Clock className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{processingCount}</p>
              <p className="text-sm text-muted-foreground">Processing</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Features Info */}
      <div className="bg-gradient-primary rounded-xl p-6 text-primary-foreground">
        <h3 className="font-semibold mb-2">AI-Powered Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <p className="font-medium mb-1">• Automated OCR & Text Extraction</p>
            <p className="text-sm text-primary-foreground/80">Extract text from scanned documents and images</p>
          </div>
          <div>
            <p className="font-medium mb-1">• Medical Report Analysis</p>
            <p className="text-sm text-primary-foreground/80">Automatically extract diagnosis, medications, and recommendations</p>
          </div>
          <div>
            <p className="font-medium mb-1">• Certificate Verification</p>
            <p className="text-sm text-primary-foreground/80">Verify academic certificates and credentials</p>
          </div>
          <div>
            <p className="font-medium mb-1">• Radiology Image Analysis</p>
            <p className="text-sm text-primary-foreground/80">AI-based analysis of medical imaging</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by case ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
          className="input-field w-auto min-w-[200px]"
        >
          <option value="all">All Types</option>
          <option value="ocr">OCR Extraction</option>
          <option value="medical_extraction">Medical Data Extraction</option>
          <option value="certificate_verification">Certificate Verification</option>
          <option value="radiology_analysis">Radiology Analysis</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="input-field w-auto min-w-[150px]"
        >
          <option value="all">All Status</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredProcessings}
        keyExtractor={(item) => item.id.toString()}
        emptyMessage="No AI processing records found"
      />
    </div>
  );
};

export default AdminAIProcessing;

