import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useDataStore } from '@/contexts/DataStore';
import { CaseStatus, getUserById } from '@/lib/mockData';
import { AlertCircle } from 'lucide-react';
import { EmailWorkflowService } from '@/lib/notificationService';

interface UpdateCaseStatusFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caseId: string;
  currentStatus: CaseStatus;
}

const UpdateCaseStatusForm: React.FC<UpdateCaseStatusFormProps> = ({ open, onOpenChange, caseId, currentStatus }) => {
  const { updateCase, addNotification, cases, users } = useDataStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [status, setStatus] = useState<CaseStatus>(currentStatus);
  const [notes, setNotes] = useState('');

  const statusOptions: { value: CaseStatus; label: string }[] = [
    { value: 'new', label: 'New' },
    { value: 'review', label: 'Under Review' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'under_treatment', label: 'Under Treatment' },
    { value: 'under_admission', label: 'Under Admission' },
    { value: 'completed', label: 'Completed' },
    { value: 'closed', label: 'Closed' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      updateCase(caseId, { status });

      const caseData = cases.find(c => c.caseId === caseId);
      const client = caseData ? getUserById(caseData.clientId) : undefined;

      addNotification({
        userId: 1,
        title: 'Case Status Updated',
        message: `Case ${caseId} status changed to ${statusOptions.find(s => s.value === status)?.label}`,
        type: 'info',
      });

      // Send email notification to client
      if (client?.email) {
        try {
          await EmailWorkflowService.sendCaseStatusUpdate(
            client.email,
            caseId,
            statusOptions.find(s => s.value === status)?.label || status
          );
        } catch (error) {
          console.error('Failed to send email notification:', error);
        }
      }

      setSuccess(true);
      setNotes('');
      
      setTimeout(() => {
        onOpenChange(false);
        setSuccess(false);
      }, 1500);
    } catch (error) {
      setError('Failed to update case status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Case Status</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
          {success && (
            <div className="bg-success/10 border border-success/20 rounded-lg p-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-success" />
              <p className="text-sm text-success">Status updated successfully!</p>
            </div>
          )}
          <div>
            <Label htmlFor="status">New Status *</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as CaseStatus)} required>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Add any notes about this status change..."
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || success}>
              {loading ? 'Updating...' : success ? 'Updated!' : 'Update Status'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateCaseStatusForm;

