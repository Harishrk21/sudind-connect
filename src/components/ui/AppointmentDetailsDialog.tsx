import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, User, FileText, ArrowRight } from 'lucide-react';
import { Case } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import StatusBadge from '@/components/ui/StatusBadge';

interface AppointmentDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caseData: Case | null;
}

const AppointmentDetailsDialog: React.FC<AppointmentDetailsDialogProps> = ({ 
  open, 
  onOpenChange, 
  caseData 
}) => {
  const navigate = useNavigate();

  if (!caseData) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Appointment Information</DialogTitle>
            <DialogDescription>
              You don't have any active appointments at the moment.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  const getNextStep = () => {
    switch (caseData.status) {
      case 'new':
        return 'Your case is being reviewed by our team. Initial assessment will be completed soon.';
      case 'review':
        return 'Documents are being verified. You will receive updates once the review is complete.';
      case 'pending':
        return 'Your case is pending approval. We are coordinating with the institution.';
      case 'approved':
        return 'Your case has been approved! Next steps will be communicated shortly.';
      case 'under_treatment':
        return 'Treatment is in progress. Regular updates will be provided.';
      case 'under_admission':
        return 'Admission process is ongoing. You will be notified of any requirements.';
      default:
        return 'Your case is being processed.';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="w-6 h-6 text-primary" />
            Appointment & Case Details
          </DialogTitle>
          <DialogDescription>
            Detailed information about your case and upcoming appointments
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Case Overview */}
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-foreground text-lg mb-1">{caseData.title}</h3>
                <p className="text-sm text-muted-foreground">Case ID: {caseData.caseId}</p>
              </div>
              <StatusBadge status={caseData.status} />
            </div>
            <p className="text-sm text-foreground mb-4">{caseData.description}</p>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Type</p>
                  <p className="text-sm font-medium text-foreground capitalize">{caseData.type}</p>
                </div>
              </div>
              {caseData.hospital && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Hospital</p>
                    <p className="text-sm font-medium text-foreground">{caseData.hospital}</p>
                  </div>
                </div>
              )}
              {caseData.university && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">University</p>
                    <p className="text-sm font-medium text-foreground">{caseData.university}</p>
                  </div>
                </div>
              )}
              {caseData.estimatedCost && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Estimated Cost</p>
                    <p className="text-sm font-medium text-foreground">
                      {caseData.estimatedCost.toLocaleString()} USD
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-info/10 border border-info/20 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-info/20">
                <ArrowRight className="w-5 h-5 text-info" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground mb-2">What's Next?</h4>
                <p className="text-sm text-muted-foreground">{getNextStep()}</p>
              </div>
            </div>
          </div>

          {/* Timeline Info */}
          <div className="bg-card rounded-xl border border-border p-4">
            <h4 className="font-semibold text-foreground mb-3">Case Timeline</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-success" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Case Created</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(caseData.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Last Updated</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(caseData.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={() => {
                onOpenChange(false);
                navigate(`/client/cases/${caseData.caseId}`);
              }}
              className="flex-1"
            >
              View Full Case Details
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                onOpenChange(false);
                navigate('/client/chat');
              }}
              className="flex-1"
            >
              Contact Support
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDetailsDialog;

