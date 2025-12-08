import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, GraduationCap, ArrowRight, FolderKanban, Plus, TrendingUp } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import { useAuth } from '@/contexts/AuthContext';
import { useDataStore } from '@/contexts/DataStore';
import { getCasesByClient, CaseStatus } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import ClientCreateCaseForm from '@/components/forms/ClientCreateCaseForm';

const ClientCases: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cases } = useDataStore();
  const [createCaseOpen, setCreateCaseOpen] = useState(false);

  if (!user) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Please log in to view your cases.</p>
      </div>
    );
  }

  const myCases = getCasesByClient(user.id, cases);

  const getCaseProgress = (caseStatus: CaseStatus) => {
    const statusOrder: CaseStatus[] = ['new', 'review', 'pending', 'approved', 'under_treatment', 'under_admission', 'completed', 'closed'];
    const currentIndex = statusOrder.indexOf(caseStatus);
    const totalSteps = statusOrder.length;
    return Math.round(((currentIndex + 1) / totalSteps) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">My Cases</h2>
          <p className="text-muted-foreground">
            {myCases.length} {myCases.length === 1 ? 'case' : 'cases'} in your account
          </p>
        </div>
        <button 
          type="button"
          className="btn-primary" 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setCreateCaseOpen(true);
          }}
        >
          <Plus className="w-4 h-4" />
          Create New Case
        </button>
      </div>

      <ClientCreateCaseForm open={createCaseOpen} onOpenChange={setCreateCaseOpen} />

      {myCases.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-card rounded-xl border border-border">
          <FolderKanban className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">No Cases Yet</h2>
          <p className="text-muted-foreground text-center max-w-md mb-4">
            You don't have any active cases. Create a new case to start your medical treatment or academic admission journey.
          </p>
          <button 
            type="button"
            className="btn-primary" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setCreateCaseOpen(true);
            }}
          >
            <Plus className="w-4 h-4" />
            Create Your First Case
          </button>
        </div>
      ) : (

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {myCases.map((c) => (
          <div
            key={c.caseId}
            onClick={() => navigate(`/client/cases/${c.caseId}`)}
            className="bg-card rounded-xl border border-border p-6 cursor-pointer hover:shadow-lg transition-all hover:border-primary/30"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  'p-2.5 rounded-xl',
                  c.type === 'medical' ? 'bg-info/10' : 'bg-accent/10'
                )}>
                  {c.type === 'medical' ? (
                    <Stethoscope className="w-5 h-5 text-info" />
                  ) : (
                    <GraduationCap className="w-5 h-5 text-accent" />
                  )}
                </div>
                <div>
                  <span className="font-medium text-foreground">{c.caseId}</span>
                  <p className="text-xs text-muted-foreground capitalize">{c.type} case</p>
                </div>
              </div>
              <StatusBadge status={c.status} />
            </div>

            {/* Title */}
            <h3 className="font-semibold text-foreground text-lg mb-2">{c.title}</h3>
            
            {/* Location */}
            <p className="text-muted-foreground mb-4">
              {c.hospital || c.university}
            </p>

            {/* Progress Bar */}
            <div className="py-3 border-t border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">Progress</span>
                <span className="text-xs font-medium text-primary">{getCaseProgress(c.status)}%</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500"
                  style={{ width: `${getCaseProgress(c.status)}%` }}
                />
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-4 py-4 border-t border-border">
              <div>
                <p className="text-xs text-muted-foreground">Estimated Cost</p>
                <p className="font-semibold text-foreground">
                  ${c.estimatedCost?.toLocaleString() || 'TBD'}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Last Updated</p>
                <p className="font-medium text-foreground">
                  {new Date(c.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <span className="text-sm text-muted-foreground">
                Created {new Date(c.createdAt).toLocaleDateString()}
              </span>
              <div className="flex items-center gap-2 text-primary">
                <span className="text-sm font-medium">View Details</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
};

export default ClientCases;
