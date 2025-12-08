import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDataStore } from '@/contexts/DataStore';
import { useAuth } from '@/contexts/AuthContext';
import { CaseType } from '@/lib/mockData';
import { Stethoscope, GraduationCap, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ClientCreateCaseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ClientCreateCaseForm: React.FC<ClientCreateCaseFormProps> = ({ open, onOpenChange }) => {
  const { addCase, users, addNotification } = useDataStore();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    type: '' as CaseType | '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    title: '',
    description: '',
    agentId: '',
    adminNotes: '',
  });

  const agents = users.filter(u => u.role === 'agent' && u.status === 'active');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      if (!formData.type || !formData.title) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      // Auto-assign first available agent if none selected
      const selectedAgentId = formData.agentId || (agents.length > 0 ? agents[0].id.toString() : '2');

      const newCase = addCase({
        clientId: user?.id || 0,
        agentId: parseInt(selectedAgentId),
        type: formData.type as CaseType,
        status: 'new',
        title: formData.title,
        description: formData.description,
      });

      addNotification({
        userId: user?.id || 0,
        title: 'Case Created Successfully',
        message: `Your case ${newCase.caseId} has been submitted and is under review`,
        type: 'success',
      });

      addNotification({
        userId: 1, // Admin
        title: 'New Case Created',
        message: `${user?.name} created a new ${formData.type} case: ${newCase.caseId}`,
        type: 'info',
      });

      setSuccess(true);
      setFormData({
        type: '' as CaseType | '',
        priority: 'medium',
        title: '',
        description: '',
        agentId: '',
        adminNotes: '',
      });

      setTimeout(() => {
        onOpenChange(false);
        setSuccess(false);
      }, 1500);
    } catch (error) {
      setError('Failed to create case. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Case</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-success/10 border border-success/20 rounded-lg p-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-success" />
              <p className="text-sm text-success">Case created successfully!</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type" className="flex items-center gap-2">
                Case Type *
                {formData.type === 'medical' && <Stethoscope className="w-4 h-4 text-info" />}
                {formData.type === 'academic' && <GraduationCap className="w-4 h-4 text-accent" />}
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value as CaseType })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select case type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="medical">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-info" />
                      Medical
                    </div>
                  </SelectItem>
                  <SelectItem value="academic">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-accent" />
                      Academic
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priority">Priority *</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value as 'low' | 'medium' | 'high' })}
                required
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="Enter case title"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              placeholder="Enter case description"
            />
          </div>

          <div>
            <Label htmlFor="agentId">Assign Agent (Optional)</Label>
            <Select
              value={formData.agentId}
              onValueChange={(value) => setFormData({ ...formData, agentId: value })}
            >
              <SelectTrigger className={cn(formData.agentId === '' && 'border-primary')}>
                <SelectValue placeholder="Unassigned" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Unassigned</SelectItem>
                {agents.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id.toString()}>
                    {agent.name} - {agent.country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.agentId === '' && (
              <p className="text-xs text-muted-foreground mt-1">
                If unassigned, an agent will be automatically assigned by the admin
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="adminNotes">Admin Notes</Label>
            <Textarea
              id="adminNotes"
              value={formData.adminNotes}
              onChange={(e) => setFormData({ ...formData, adminNotes: e.target.value })}
              rows={3}
              placeholder="Add internal notes (visible only to admin)"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || success}>
              {loading ? 'Creating...' : success ? 'Created!' : 'Create Case'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ClientCreateCaseForm;

