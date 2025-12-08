import React from 'react';
import { 
  Clock, 
  CheckCircle2, 
  FileCheck, 
  Shield, 
  Stethoscope, 
  GraduationCap, 
  Sparkles,
  Calendar,
  TrendingUp,
  LucideIcon,
} from 'lucide-react';
import { CaseStatus, getStatusLabel } from '@/lib/mockData';
import { cn } from '@/lib/utils';

interface CaseTimelineProps {
  caseStatus: CaseStatus;
  caseType: 'medical' | 'academic';
  createdAt: string;
  updatedAt?: string;
  showProgress?: boolean;
  compact?: boolean;
}

const CaseTimeline: React.FC<CaseTimelineProps> = ({
  caseStatus,
  caseType,
  createdAt,
  updatedAt,
  showProgress = true,
  compact = false,
}) => {
  const getStepInfo = (status: CaseStatus): { icon: LucideIcon; description: string; estimatedDays: number; color: string } => {
    const stepInfo: Record<CaseStatus, { icon: LucideIcon; description: string; estimatedDays: number; color: string }> = {
      new: { 
        icon: Sparkles, 
        description: 'Case has been created and submitted. Initial review will begin shortly.', 
        estimatedDays: 0,
        color: 'bg-info/10 text-info border-info/20'
      },
      review: { 
        icon: FileCheck, 
        description: 'Documents are being reviewed by our team. Verification of all submitted materials is in progress.', 
        estimatedDays: 2,
        color: 'bg-warning/10 text-warning border-warning/20'
      },
      pending: { 
        icon: Clock, 
        description: 'Awaiting additional information or approval from relevant parties. Your case is in queue.', 
        estimatedDays: 3,
        color: 'bg-warning/10 text-warning border-warning/20'
      },
      approved: { 
        icon: Shield, 
        description: 'Case has been approved! Documents are being forwarded to the institution in India.', 
        estimatedDays: 1,
        color: 'bg-success/10 text-success border-success/20'
      },
      under_treatment: { 
        icon: Stethoscope, 
        description: 'Medical treatment is in progress at the assigned hospital. Regular updates will be provided.', 
        estimatedDays: 30,
        color: 'bg-info/10 text-info border-info/20'
      },
      under_admission: { 
        icon: GraduationCap, 
        description: 'Academic admission process is ongoing. University is processing your application.', 
        estimatedDays: 15,
        color: 'bg-accent/10 text-accent border-accent/20'
      },
      completed: { 
        icon: CheckCircle2, 
        description: 'Case has been successfully completed! All processes have been finalized.', 
        estimatedDays: 0,
        color: 'bg-success/10 text-success border-success/20'
      },
      closed: { 
        icon: CheckCircle2, 
        description: 'Case has been closed. All documentation and processes are complete.', 
        estimatedDays: 0,
        color: 'bg-muted text-muted-foreground border-border'
      },
    };
    return stepInfo[status];
  };

  const statusTimeline: { status: CaseStatus; date?: string; completed: boolean; isCurrent?: boolean }[] = [
    { status: 'new', date: createdAt, completed: true, isCurrent: caseStatus === 'new' },
    { status: 'review', completed: ['review', 'pending', 'approved', 'under_treatment', 'under_admission', 'completed', 'closed'].includes(caseStatus), isCurrent: caseStatus === 'review' },
    { status: 'pending', completed: ['pending', 'approved', 'under_treatment', 'under_admission', 'completed', 'closed'].includes(caseStatus), isCurrent: caseStatus === 'pending' },
    { status: 'approved', completed: ['approved', 'under_treatment', 'under_admission', 'completed', 'closed'].includes(caseStatus), isCurrent: caseStatus === 'approved' },
    { status: caseType === 'medical' ? 'under_treatment' : 'under_admission', completed: ['under_treatment', 'under_admission', 'completed', 'closed'].includes(caseStatus), isCurrent: ['under_treatment', 'under_admission'].includes(caseStatus) },
    { status: 'completed', date: caseStatus === 'completed' ? updatedAt : undefined, completed: ['completed', 'closed'].includes(caseStatus), isCurrent: caseStatus === 'completed' },
  ];

  const completedSteps = statusTimeline.filter(s => s.completed).length;
  const totalSteps = statusTimeline.length;
  const progressPercentage = Math.round((completedSteps / totalSteps) * 100);

  if (compact) {
    return (
      <div className="space-y-2">
        {showProgress && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium text-primary">{progressPercentage}%</span>
          </div>
        )}
        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      {showProgress && (
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-foreground mb-1">Case Progress</h3>
              <p className="text-sm text-muted-foreground">
                {completedSteps} of {totalSteps} steps completed
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">{progressPercentage}%</p>
              <p className="text-xs text-muted-foreground">Complete</p>
            </div>
          </div>
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Enhanced Timeline */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="font-semibold text-foreground mb-6">Case Timeline</h3>
        <div className="relative">
          {statusTimeline.map((step, index) => {
            const stepInfo = getStepInfo(step.status);
            const StepIcon = stepInfo.icon;
            const isLast = index === statusTimeline.length - 1;
            
            return (
              <div key={step.status} className="relative">
                <div className="flex gap-4 pb-8 last:pb-0">
                  {/* Timeline Line & Icon */}
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      'relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300',
                      step.completed 
                        ? 'bg-success text-success-foreground border-success shadow-lg shadow-success/20' 
                        : step.isCurrent
                        ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 animate-pulse'
                        : 'bg-muted text-muted-foreground border-border'
                    )}>
                      <StepIcon className={cn(
                        step.completed || step.isCurrent ? 'w-6 h-6' : 'w-5 h-5'
                      )} />
                      {step.completed && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full flex items-center justify-center border-2 border-card">
                          <CheckCircle2 className="w-2.5 h-2.5 text-success-foreground" />
                        </div>
                      )}
                    </div>
                    {!isLast && (
                      <div className={cn(
                        'w-0.5 flex-1 mt-2 transition-all duration-300',
                        step.completed ? 'bg-success' : 'bg-muted'
                      )} />
                    )}
                  </div>

                  {/* Step Content Card */}
                  <div className={cn(
                    'flex-1 pb-6 rounded-xl border-2 p-4 transition-all duration-300',
                    step.isCurrent 
                      ? 'bg-primary/5 border-primary shadow-md' 
                      : step.completed
                      ? 'bg-success/5 border-success/20'
                      : 'bg-muted/30 border-border',
                    step.isCurrent && 'ring-2 ring-primary/20'
                  )}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'p-2 rounded-lg',
                          stepInfo.color
                        )}>
                          <StepIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className={cn(
                            'font-semibold text-base',
                            step.completed ? 'text-foreground' : step.isCurrent ? 'text-primary' : 'text-muted-foreground'
                          )}>
                            {getStatusLabel(step.status)}
                          </h4>
                          {step.date && (
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                              <Calendar className="w-3 h-3" />
                              {new Date(step.date).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </p>
                          )}
                        </div>
                      </div>
                      {step.isCurrent && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/15 text-primary border border-primary/20">
                          Current Step
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                      {stepInfo.description}
                    </p>

                    <div className="flex items-center gap-4 pt-3 border-t border-border/50">
                      {stepInfo.estimatedDays > 0 && !step.completed && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Estimated: {stepInfo.estimatedDays} {stepInfo.estimatedDays === 1 ? 'day' : 'days'}</span>
                        </div>
                      )}
                      {step.completed && step.date && (
                        <div className="flex items-center gap-2 text-xs text-success">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Completed on {new Date(step.date).toLocaleDateString()}</span>
                        </div>
                      )}
                      {!step.completed && !step.isCurrent && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Pending</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Next Steps Info */}
      {caseStatus !== 'completed' && caseStatus !== 'closed' && (
        <div className="bg-accent/10 border border-accent/20 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground mb-1">What's Next?</p>
              <p className="text-sm text-muted-foreground">
                {caseStatus === 'new' && 'Your case is being reviewed by our team. You will receive updates as it progresses.'}
                {caseStatus === 'review' && 'Documents are being verified. Please ensure all required documents are uploaded.'}
                {caseStatus === 'pending' && 'We are awaiting additional information. Please check your messages for any requests.'}
                {caseStatus === 'approved' && 'Your case has been approved! Documents are being forwarded to the institution.'}
                {['under_treatment', 'under_admission'].includes(caseStatus) && 'Your case is actively being processed. Regular updates will be provided.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseTimeline;

