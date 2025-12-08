import React, { useState } from 'react';
import { DollarSign, Plus, FileText, Calculator, Stethoscope, GraduationCap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getCasesByAgent, getCaseById, Case } from '@/lib/mockData';
import { cn } from '@/lib/utils';

interface CostEstimate {
  id: number;
  caseId: string;
  serviceType: string;
  description: string;
  baseCost: number;
  additionalFees: number;
  total: number;
  status: 'draft' | 'sent' | 'approved' | 'rejected';
  createdAt: string;
}

const AgentCostEstimate: React.FC = () => {
  const { user } = useAuth();
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [estimates, setEstimates] = useState<CostEstimate[]>([
    {
      id: 1,
      caseId: 'MED-001',
      serviceType: 'Cardiac Surgery',
      description: 'Cardiac bypass surgery with hospital stay',
      baseCost: 20000,
      additionalFees: 5000,
      total: 25000,
      status: 'sent',
      createdAt: '2024-11-25',
    },
    {
      id: 2,
      caseId: 'MED-002',
      serviceType: 'Orthopedic Surgery',
      description: 'Total knee replacement surgery',
      baseCost: 12000,
      additionalFees: 3000,
      total: 15000,
      status: 'approved',
      createdAt: '2024-11-23',
    },
  ]);

  if (!user) return null;

  const myCases = getCasesByAgent(user.id);
  const activeCases = myCases.filter(c => !['completed', 'closed'].includes(c.status));

  const handleCreateEstimate = () => {
    if (!selectedCase) return;
    
    const newEstimate: CostEstimate = {
      id: estimates.length + 1,
      caseId: selectedCase.caseId,
      serviceType: selectedCase.type === 'medical' ? 'Medical Treatment' : 'Academic Program',
      description: selectedCase.title,
      baseCost: selectedCase.estimatedCost || 0,
      additionalFees: 0,
      total: selectedCase.estimatedCost || 0,
      status: 'draft',
      createdAt: new Date().toISOString().split('T')[0],
    };
    
    setEstimates([...estimates, newEstimate]);
    setSelectedCase(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Cost Estimates</h2>
        <p className="text-muted-foreground">Create and manage treatment cost estimates for clients</p>
      </div>

      {/* Create New Estimate */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="font-semibold text-foreground mb-4">Create New Estimate</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Select Case</label>
            <select
              value={selectedCase?.caseId || ''}
              onChange={(e) => {
                const case_ = myCases.find(c => c.caseId === e.target.value);
                setSelectedCase(case_ || null);
              }}
              className="input-field"
            >
              <option value="">Choose a case...</option>
              {activeCases.map((c) => (
                <option key={c.caseId} value={c.caseId}>
                  {c.caseId} - {c.title}
                </option>
              ))}
            </select>
          </div>

          {selectedCase && (
            <div className="bg-muted rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                {selectedCase.type === 'medical' ? (
                  <Stethoscope className="w-4 h-4 text-info" />
                ) : (
                  <GraduationCap className="w-4 h-4 text-accent" />
                )}
                <span className="font-medium text-foreground">{selectedCase.title}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Base Cost (USD)</label>
                  <input
                    type="number"
                    defaultValue={selectedCase.estimatedCost || 0}
                    className="input-field"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Additional Fees (USD)</label>
                  <input
                    type="number"
                    defaultValue={0}
                    className="input-field"
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Description</label>
                <textarea
                  className="input-field"
                  rows={3}
                  placeholder="Detailed description of services and costs..."
                />
              </div>
              <button onClick={handleCreateEstimate} className="btn-primary w-full">
                <Plus className="w-4 h-4" />
                Create Estimate
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Existing Estimates */}
      <div>
        <h3 className="font-semibold text-foreground mb-4">Existing Estimates</h3>
        <div className="space-y-4">
          {estimates.map((estimate) => {
            const case_ = getCaseById(estimate.caseId);
            return (
              <div
                key={estimate.id}
                className="bg-card rounded-xl border border-border p-5"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">{estimate.caseId}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{estimate.serviceType}</p>
                  </div>
                  <span className={cn(
                    'status-badge',
                    estimate.status === 'approved' && 'bg-success/15 text-success',
                    estimate.status === 'sent' && 'bg-warning/15 text-warning',
                    estimate.status === 'draft' && 'bg-muted text-muted-foreground',
                    estimate.status === 'rejected' && 'bg-destructive/15 text-destructive',
                  )}>
                    {estimate.status}
                  </span>
                </div>

                <p className="text-sm text-foreground mb-4">{estimate.description}</p>

                <div className="bg-muted rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Base Cost</span>
                    <span className="font-medium text-foreground">${estimate.baseCost.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Additional Fees</span>
                    <span className="font-medium text-foreground">${estimate.additionalFees.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-border pt-2 flex items-center justify-between">
                    <span className="font-semibold text-foreground">Total Estimate</span>
                    <span className="text-xl font-bold text-primary">${estimate.total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <button className="btn-secondary flex-1 text-sm">
                    Edit
                  </button>
                  <button className="btn-primary flex-1 text-sm">
                    Send to Client
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AgentCostEstimate;

