import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDataStore } from '@/contexts/DataStore';
import { CaseType, CaseStatus } from '@/lib/mockData';
import { AlertCircle, Stethoscope, GraduationCap, User, UserCheck, Calendar, DollarSign, Building2, FileText, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddCaseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddCaseForm: React.FC<AddCaseFormProps> = ({ open, onOpenChange }) => {
  const { addCase, users, addNotification } = useDataStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    clientId: '',
    agentId: '',
    type: '' as CaseType | '',
    status: 'new' as CaseStatus,
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    title: '',
    description: '',
    estimatedCost: '',
    currency: 'USD',
    
    // Medical Specific
    hospital: '',
    department: '',
    doctorName: '',
    treatmentType: '',
    urgency: '',
    medicalCondition: '',
    
    // Academic Specific
    university: '',
    program: '',
    degreeLevel: '' as 'bachelor' | 'master' | 'phd' | 'diploma' | '',
    intake: '',
    academicYear: '',
    
    // Timeline
    expectedStartDate: '',
    expectedCompletionDate: '',
    
    // Additional Information
    specialRequirements: '',
    adminNotes: '',
    internalNotes: '',
  });

  const clients = users.filter(u => u.role === 'client');
  const agents = users.filter(u => u.role === 'agent' && u.status === 'active');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      if (!formData.clientId || !formData.agentId || !formData.type || !formData.title) {
        setError('Please fill in all required fields marked with *');
        setLoading(false);
        return;
      }

      const newCase = addCase({
        clientId: parseInt(formData.clientId),
        agentId: parseInt(formData.agentId),
        type: formData.type as CaseType,
        status: formData.status,
        title: formData.title,
        description: formData.description,
        estimatedCost: formData.estimatedCost ? parseFloat(formData.estimatedCost) : undefined,
        hospital: formData.type === 'medical' ? formData.hospital : undefined,
        university: formData.type === 'academic' ? formData.university : undefined,
      });

      const selectedClient = clients.find(c => c.id === parseInt(formData.clientId));
      const selectedAgent = agents.find(a => a.id === parseInt(formData.agentId));

      addNotification({
        userId: 1,
        title: 'New Case Created',
        message: `Case ${newCase.caseId} has been created for ${selectedClient?.name}`,
        type: 'info',
      });

      addNotification({
        userId: parseInt(formData.clientId),
        title: 'New Case Assigned',
        message: `A new ${formData.type} case has been assigned to you: ${newCase.caseId}`,
        type: 'info',
      });

      addNotification({
        userId: parseInt(formData.agentId),
        title: 'New Case Assignment',
        message: `You have been assigned case ${newCase.caseId} for ${selectedClient?.name}`,
        type: 'info',
      });

      setSuccess(true);
      
      // Reset form
      setFormData({
        clientId: '',
        agentId: '',
        type: '' as CaseType | '',
        status: 'new',
        priority: 'medium',
        title: '',
        description: '',
        estimatedCost: '',
        currency: 'USD',
        hospital: '',
        department: '',
        doctorName: '',
        treatmentType: '',
        urgency: '',
        medicalCondition: '',
        university: '',
        program: '',
        degreeLevel: '' as 'bachelor' | 'master' | 'phd' | 'diploma' | '',
        intake: '',
        academicYear: '',
        expectedStartDate: '',
        expectedCompletionDate: '',
        specialRequirements: '',
        adminNotes: '',
        internalNotes: '',
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
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create New Case</DialogTitle>
          <p className="text-sm text-muted-foreground">Complete all required fields to create a new case</p>
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

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Basic Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clientId" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Client *
                </Label>
                <Select
                  value={formData.clientId}
                  onValueChange={(value) => setFormData({ ...formData, clientId: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id.toString()}>
                        {client.name} ({client.clientType})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="agentId" className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  Assign Agent *
                </Label>
                <Select
                  value={formData.agentId}
                  onValueChange={(value) => setFormData({ ...formData, agentId: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select agent" />
                  </SelectTrigger>
                  <SelectContent>
                    {agents.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id.toString()}>
                        {agent.name} - {agent.country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="type" className="flex items-center gap-2">
                  {formData.type === 'medical' && <Stethoscope className="w-4 h-4 text-info" />}
                  {formData.type === 'academic' && <GraduationCap className="w-4 h-4 text-accent" />}
                  Case Type *
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
                        <span>Medical</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="academic">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-accent" />
                        <span>Academic</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priority" className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Priority *
                </Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value as 'low' | 'medium' | 'high' | 'urgent' })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Initial Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as CaseStatus })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="review">Under Review</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Case Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Case Details</h3>
            <div>
              <Label htmlFor="title">Case Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="e.g., Cardiac Evaluation & Treatment, MBBS Admission Application"
              />
            </div>
            <div>
              <Label htmlFor="description">Detailed Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={5}
                placeholder="Provide a detailed description of the case, including background, requirements, and any specific needs..."
              />
            </div>
          </div>

          {/* Medical Specific Fields */}
          {formData.type === 'medical' && (
            <div className="space-y-4 bg-info/5 border border-info/20 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-info" />
                Medical Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hospital">Hospital Name</Label>
                  <Input
                    id="hospital"
                    value={formData.hospital}
                    onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                    placeholder="e.g., Apollo Hospitals, Chennai"
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department / Specialty</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="e.g., Cardiology, Orthopedics"
                  />
                </div>
                <div>
                  <Label htmlFor="doctorName">Doctor Name</Label>
                  <Input
                    id="doctorName"
                    value={formData.doctorName}
                    onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                    placeholder="Primary doctor name"
                  />
                </div>
                <div>
                  <Label htmlFor="treatmentType">Treatment Type</Label>
                  <Select
                    value={formData.treatmentType}
                    onValueChange={(value) => setFormData({ ...formData, treatmentType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select treatment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consultation">Consultation</SelectItem>
                      <SelectItem value="surgery">Surgery</SelectItem>
                      <SelectItem value="treatment">Treatment</SelectItem>
                      <SelectItem value="diagnostic">Diagnostic</SelectItem>
                      <SelectItem value="rehabilitation">Rehabilitation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="medicalCondition">Medical Condition</Label>
                  <Input
                    id="medicalCondition"
                    value={formData.medicalCondition}
                    onChange={(e) => setFormData({ ...formData, medicalCondition: e.target.value })}
                    placeholder="Primary medical condition"
                  />
                </div>
                <div>
                  <Label htmlFor="urgency">Urgency Level</Label>
                  <Select
                    value={formData.urgency}
                    onValueChange={(value) => setFormData({ ...formData, urgency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select urgency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="routine">Routine</SelectItem>
                      <SelectItem value="semi_urgent">Semi-Urgent</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Academic Specific Fields */}
          {formData.type === 'academic' && (
            <div className="space-y-4 bg-accent/5 border border-accent/20 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-accent" />
                Academic Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="university">University Name</Label>
                  <Input
                    id="university"
                    value={formData.university}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                    placeholder="e.g., Manipal University, VIT University"
                  />
                </div>
                <div>
                  <Label htmlFor="program">Program / Course</Label>
                  <Input
                    id="program"
                    value={formData.program}
                    onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                    placeholder="e.g., MBBS, Engineering, MBA"
                  />
                </div>
                <div>
                  <Label htmlFor="degreeLevel">Degree Level</Label>
                  <Select
                    value={formData.degreeLevel}
                    onValueChange={(value) => setFormData({ ...formData, degreeLevel: value as 'bachelor' | 'master' | 'phd' | 'diploma' })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select degree level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="diploma">Diploma</SelectItem>
                      <SelectItem value="bachelor">Bachelor's</SelectItem>
                      <SelectItem value="master">Master's</SelectItem>
                      <SelectItem value="phd">PhD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="intake">Intake Period</Label>
                  <Select
                    value={formData.intake}
                    onValueChange={(value) => setFormData({ ...formData, intake: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select intake" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fall">Fall (September)</SelectItem>
                      <SelectItem value="spring">Spring (January)</SelectItem>
                      <SelectItem value="summer">Summer (May)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="academicYear">Academic Year</Label>
                  <Input
                    id="academicYear"
                    type="number"
                    value={formData.academicYear}
                    onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                    placeholder="e.g., 2025"
                    min={new Date().getFullYear()}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Financial Information */}
          <div className="space-y-4 bg-warning/5 border border-warning/20 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-warning" />
              Financial Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="estimatedCost">Estimated Cost</Label>
                <Input
                  id="estimatedCost"
                  type="number"
                  value={formData.estimatedCost}
                  onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => setFormData({ ...formData, currency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="INR">INR (₹)</SelectItem>
                    <SelectItem value="SDG">SDG (SDG)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Timeline
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expectedStartDate">Expected Start Date</Label>
                <Input
                  id="expectedStartDate"
                  type="date"
                  value={formData.expectedStartDate}
                  onChange={(e) => setFormData({ ...formData, expectedStartDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <Label htmlFor="expectedCompletionDate">Expected Completion Date</Label>
                <Input
                  id="expectedCompletionDate"
                  type="date"
                  value={formData.expectedCompletionDate}
                  onChange={(e) => setFormData({ ...formData, expectedCompletionDate: e.target.value })}
                  min={formData.expectedStartDate || new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Additional Information</h3>
            <div>
              <Label htmlFor="specialRequirements">Special Requirements</Label>
              <Textarea
                id="specialRequirements"
                value={formData.specialRequirements}
                onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                rows={3}
                placeholder="Any special requirements, accommodations, or preferences..."
              />
            </div>
            <div>
              <Label htmlFor="adminNotes">Admin Notes (Internal)</Label>
              <Textarea
                id="adminNotes"
                value={formData.adminNotes}
                onChange={(e) => setFormData({ ...formData, adminNotes: e.target.value })}
                rows={3}
                placeholder="Internal notes visible only to admin team..."
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || success} className="min-w-[120px]">
              {loading ? 'Creating...' : success ? 'Created!' : 'Create Case'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCaseForm;
