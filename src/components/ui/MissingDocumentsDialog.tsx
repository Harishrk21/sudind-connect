import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle, Upload, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import { Case } from '@/lib/mockData';
import { cn } from '@/lib/utils';

interface MissingDocumentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caseData: Case | null;
}

const MissingDocumentsDialog: React.FC<MissingDocumentsDialogProps> = ({ 
  open, 
  onOpenChange, 
  caseData 
}) => {
  const navigate = useNavigate();

  // Mock missing documents based on case type
  const getMissingDocuments = () => {
    if (!caseData) {
      return [
        { id: 1, name: 'Passport Copy', required: true, description: 'Valid passport with at least 6 months validity' },
        { id: 2, name: 'Medical Reports', required: true, description: 'Recent medical reports and test results' },
        { id: 3, name: 'Lab Results', required: false, description: 'Latest laboratory test results' }
      ];
    }

    if (caseData.type === 'medical') {
      return [
        { id: 1, name: 'Updated Lab Results', required: true, description: 'Recent blood tests and lab reports (within 30 days)' },
        { id: 2, name: 'Radiology Images', required: false, description: 'X-rays, CT scans, or MRI reports if applicable' },
        { id: 3, name: 'Doctor Prescription', required: true, description: 'Current prescription from your doctor' },
        { id: 4, name: 'Medical History', required: false, description: 'Complete medical history document' }
      ];
    } else {
      return [
        { id: 1, name: 'Academic Transcripts', required: true, description: 'Official transcripts from previous institutions' },
        { id: 2, name: 'Degree Certificates', required: true, description: 'Copies of all degree certificates' },
        { id: 3, name: 'English Proficiency Test', required: true, description: 'IELTS, TOEFL, or equivalent test results' },
        { id: 4, name: 'Statement of Purpose', required: false, description: 'Personal statement or SOP' }
      ];
    }
  };

  const missingDocs = getMissingDocuments();
  const requiredDocs = missingDocs.filter(doc => doc.required);
  const optionalDocs = missingDocs.filter(doc => !doc.required);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-warning" />
            Missing Documents
          </DialogTitle>
          <DialogDescription>
            {caseData 
              ? `Your case ${caseData.caseId} requires the following documents to proceed`
              : 'Please upload the following documents to complete your case'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Required Documents */}
          {requiredDocs.length > 0 && (
            <div>
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-destructive" />
                Required Documents ({requiredDocs.length})
              </h3>
              <div className="space-y-3">
                {requiredDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-destructive/5 border border-destructive/20 rounded-lg p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-destructive/10">
                        <FileText className="w-4 h-4 text-destructive" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-foreground">{doc.name}</p>
                          <span className="px-2 py-0.5 bg-destructive/20 text-destructive text-xs rounded-full">
                            Required
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{doc.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Optional Documents */}
          {optionalDocs.length > 0 && (
            <div>
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-info" />
                Optional Documents ({optionalDocs.length})
              </h3>
              <div className="space-y-3">
                {optionalDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-card border border-border rounded-lg p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-info/10">
                        <FileText className="w-4 h-4 text-info" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-foreground">{doc.name}</p>
                          <span className="px-2 py-0.5 bg-info/20 text-info text-xs rounded-full">
                            Optional
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{doc.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Important Notice */}
          <div className="bg-warning/10 border border-warning/20 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground text-sm mb-1">Important Notice</p>
                <p className="text-xs text-muted-foreground">
                  Uploading all required documents will help us process your case faster. 
                  Missing documents may cause delays in approval and processing.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="secondary"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            View Later
          </Button>
          <Button
            onClick={() => {
              onOpenChange(false);
              navigate('/client/upload');
            }}
            className="w-full sm:w-auto"
          >
            <Upload className="w-4 h-4" />
            Upload Documents Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MissingDocumentsDialog;

