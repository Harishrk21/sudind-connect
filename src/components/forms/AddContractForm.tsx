import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDataStore } from '@/contexts/DataStore';
import { AlertCircle, FileText, Calendar, DollarSign, User, UserCheck, Building2, Stethoscope, GraduationCap, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddContractFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddContractForm: React.FC<AddContractFormProps> = ({ open, onOpenChange }) => {
  const { addContract, cases, users, addNotification } = useDataStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    caseId: '',
    clientId: '',
    agentId: '',
    type: '' as 'medical' | 'academic' | '',
    status: 'draft' as 'draft' | 'active',
    title: '',
    terms: '',
    startDate: '',
    endDate: '',
    
    // Contract Details
    contractValue: '',
    currency: 'USD',
    paymentTerms: '',
    paymentSchedule: '',
    renewalTerms: '',
    
    // Services & Scope
    servicesIncluded: '',
    deliverables: '',
    exclusions: '',
    
    // Legal & Compliance
    jurisdiction: '',
    governingLaw: '',
    disputeResolution: '',
    terminationClause: '',
    
    // Additional Terms
    confidentiality: '',
    liability: '',
    insurance: '',
    forceMajeure: '',
    
    // Signatures & Dates
    signedByClient: false,
    signedByAgent: false,
    signedByAdmin: false,
    signatureDate: '',
    
    // Notes
    internalNotes: '',
    specialConditions: '',
  });

  const activeCases = cases.filter(c => !['completed', 'closed'].includes(c.status));
  const clients = users.filter(u => u.role === 'client');
  const agents = users.filter(u => u.role === 'agent');

  const handleCaseChange = (caseId: string) => {
    const selectedCase = cases.find(c => c.caseId === caseId);
    if (selectedCase) {
      setFormData({
        ...formData,
        caseId,
        clientId: selectedCase.clientId.toString(),
        agentId: selectedCase.agentId.toString(),
        type: selectedCase.type,
        title: `${selectedCase.type === 'medical' ? 'Medical' : 'Academic'} Service Agreement - ${selectedCase.title}`,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      if (!formData.caseId || !formData.title || !formData.startDate || !formData.endDate) {
        setError('Please fill in all required fields marked with *');
        setLoading(false);
        return;
      }

      if (new Date(formData.endDate) <= new Date(formData.startDate)) {
        setError('End date must be after start date');
        setLoading(false);
        return;
      }

      const newContract = addContract({
        caseId: formData.caseId,
        clientId: parseInt(formData.clientId),
        agentId: parseInt(formData.agentId),
        type: formData.type as 'medical' | 'academic',
        status: formData.status,
        title: formData.title,
        terms: formData.terms || `Contract for case ${formData.caseId}. ${formData.servicesIncluded ? `Services: ${formData.servicesIncluded}.` : ''} ${formData.specialConditions ? `Special conditions: ${formData.specialConditions}` : ''}`,
        startDate: formData.startDate,
        endDate: formData.endDate,
      });

      const selectedClient = clients.find(c => c.id === parseInt(formData.clientId));
      const selectedAgent = agents.find(a => a.id === parseInt(formData.agentId));

      addNotification({
        userId: 1,
        title: 'New Contract Created',
        message: `Contract ${newContract.contractId} has been created for case ${formData.caseId}`,
        type: 'success',
      });

      addNotification({
        userId: parseInt(formData.clientId),
        title: 'New Contract',
        message: `A new contract has been created for your case: ${formData.caseId}`,
        type: 'info',
      });

      addNotification({
        userId: parseInt(formData.agentId),
        title: 'New Contract Assignment',
        message: `You have been assigned contract ${newContract.contractId} for case ${formData.caseId}`,
        type: 'info',
      });

      setSuccess(true);
      
      // Reset form
      setFormData({
        caseId: '',
        clientId: '',
        agentId: '',
        type: '' as 'medical' | 'academic' | '',
        status: 'draft',
        title: '',
        terms: '',
        startDate: '',
        endDate: '',
        contractValue: '',
        currency: 'USD',
        paymentTerms: '',
        paymentSchedule: '',
        renewalTerms: '',
        servicesIncluded: '',
        deliverables: '',
        exclusions: '',
        jurisdiction: '',
        governingLaw: '',
        disputeResolution: '',
        terminationClause: '',
        confidentiality: '',
        liability: '',
        insurance: '',
        forceMajeure: '',
        signedByClient: false,
        signedByAgent: false,
        signedByAdmin: false,
        signatureDate: '',
        internalNotes: '',
        specialConditions: '',
      });

      setTimeout(() => {
        onOpenChange(false);
        setSuccess(false);
      }, 1500);
    } catch (error) {
      setError('Failed to create contract. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedCase = cases.find(c => c.caseId === formData.caseId);
  const selectedClient = clients.find(c => c.id === parseInt(formData.clientId));
  const selectedAgent = agents.find(a => a.id === parseInt(formData.agentId));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create New Contract</DialogTitle>
          <p className="text-sm text-muted-foreground">Complete all required fields to create a new contract</p>
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
              <p className="text-sm text-success">Contract created successfully!</p>
            </div>
          )}

          {/* Case Selection */}
          <div className="space-y-4 bg-primary/5 border border-primary/20 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Case Information
            </h3>
            <div>
              <Label htmlFor="caseId">Select Case *</Label>
              <Select
                value={formData.caseId}
                onValueChange={handleCaseChange}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select case" />
                </SelectTrigger>
                <SelectContent>
                  {activeCases.map((c) => (
                    <SelectItem key={c.caseId} value={c.caseId}>
                      {c.caseId} - {c.title} ({c.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedCase && (
              <div className="grid grid-cols-2 gap-4 mt-4 p-4 bg-card rounded-lg border border-border">
                <div>
                  <p className="text-xs text-muted-foreground">Client</p>
                  <p className="font-medium text-foreground">{selectedClient?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Agent</p>
                  <p className="font-medium text-foreground">{selectedAgent?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Case Type</p>
                  <div className="flex items-center gap-2">
                    {formData.type === 'medical' && <Stethoscope className="w-4 h-4 text-info" />}
                    {formData.type === 'academic' && <GraduationCap className="w-4 h-4 text-accent" />}
                    <span className="font-medium text-foreground capitalize">{formData.type}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Estimated Cost</p>
                  <p className="font-medium text-foreground">
                    ${selectedCase.estimatedCost?.toLocaleString() || 'TBD'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Contract Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Contract Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="title">Contract Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="e.g., Medical Treatment Agreement - Cardiac Care"
                />
              </div>
              <div>
                <Label htmlFor="status">Contract Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as 'draft' | 'active' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="contractValue">Contract Value</Label>
                <Input
                  id="contractValue"
                  type="number"
                  value={formData.contractValue}
                  onChange={(e) => setFormData({ ...formData, contractValue: e.target.value })}
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

          {/* Contract Period */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Contract Period
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Terms & Conditions</h3>
            <div>
              <Label htmlFor="terms">Contract Terms & Conditions *</Label>
              <Textarea
                id="terms"
                value={formData.terms}
                onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                rows={6}
                placeholder="Enter detailed terms and conditions of the contract..."
                required
              />
            </div>
          </div>

          {/* Services & Scope */}
          <div className="space-y-4 bg-accent/5 border border-accent/20 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-foreground">Services & Scope</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="servicesIncluded">Services Included</Label>
                <Textarea
                  id="servicesIncluded"
                  value={formData.servicesIncluded}
                  onChange={(e) => setFormData({ ...formData, servicesIncluded: e.target.value })}
                  rows={4}
                  placeholder="List all services included in this contract..."
                />
              </div>
              <div>
                <Label htmlFor="deliverables">Deliverables</Label>
                <Textarea
                  id="deliverables"
                  value={formData.deliverables}
                  onChange={(e) => setFormData({ ...formData, deliverables: e.target.value })}
                  rows={3}
                  placeholder="Expected deliverables and outcomes..."
                />
              </div>
              <div>
                <Label htmlFor="exclusions">Exclusions</Label>
                <Textarea
                  id="exclusions"
                  value={formData.exclusions}
                  onChange={(e) => setFormData({ ...formData, exclusions: e.target.value })}
                  rows={2}
                  placeholder="Services or items not included in this contract..."
                />
              </div>
            </div>
          </div>

          {/* Payment Terms */}
          <div className="space-y-4 bg-warning/5 border border-warning/20 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-warning" />
              Payment Terms
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="paymentTerms">Payment Terms</Label>
                <Select
                  value={formData.paymentTerms}
                  onValueChange={(value) => setFormData({ ...formData, paymentTerms: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment terms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full_upfront">Full Payment Upfront</SelectItem>
                    <SelectItem value="installments">Installments</SelectItem>
                    <SelectItem value="milestone">Milestone Based</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="paymentSchedule">Payment Schedule</Label>
                <Textarea
                  id="paymentSchedule"
                  value={formData.paymentSchedule}
                  onChange={(e) => setFormData({ ...formData, paymentSchedule: e.target.value })}
                  rows={2}
                  placeholder="Payment schedule details..."
                />
              </div>
            </div>
          </div>

          {/* Legal & Compliance */}
          <div className="space-y-4 bg-info/5 border border-info/20 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Shield className="w-5 h-5 text-info" />
              Legal & Compliance
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="jurisdiction">Jurisdiction</Label>
                <Input
                  id="jurisdiction"
                  value={formData.jurisdiction}
                  onChange={(e) => setFormData({ ...formData, jurisdiction: e.target.value })}
                  placeholder="e.g., India, Sudan"
                />
              </div>
              <div>
                <Label htmlFor="governingLaw">Governing Law</Label>
                <Input
                  id="governingLaw"
                  value={formData.governingLaw}
                  onChange={(e) => setFormData({ ...formData, governingLaw: e.target.value })}
                  placeholder="Applicable law"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="disputeResolution">Dispute Resolution</Label>
                <Textarea
                  id="disputeResolution"
                  value={formData.disputeResolution}
                  onChange={(e) => setFormData({ ...formData, disputeResolution: e.target.value })}
                  rows={2}
                  placeholder="Dispute resolution mechanism..."
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="terminationClause">Termination Clause</Label>
                <Textarea
                  id="terminationClause"
                  value={formData.terminationClause}
                  onChange={(e) => setFormData({ ...formData, terminationClause: e.target.value })}
                  rows={2}
                  placeholder="Terms and conditions for contract termination..."
                />
              </div>
            </div>
          </div>

          {/* Additional Terms */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Additional Terms</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="confidentiality">Confidentiality Clause</Label>
                <Textarea
                  id="confidentiality"
                  value={formData.confidentiality}
                  onChange={(e) => setFormData({ ...formData, confidentiality: e.target.value })}
                  rows={2}
                  placeholder="Confidentiality and non-disclosure terms..."
                />
              </div>
              <div>
                <Label htmlFor="liability">Liability & Indemnification</Label>
                <Textarea
                  id="liability"
                  value={formData.liability}
                  onChange={(e) => setFormData({ ...formData, liability: e.target.value })}
                  rows={2}
                  placeholder="Liability limitations and indemnification clauses..."
                />
              </div>
              <div>
                <Label htmlFor="specialConditions">Special Conditions</Label>
                <Textarea
                  id="specialConditions"
                  value={formData.specialConditions}
                  onChange={(e) => setFormData({ ...formData, specialConditions: e.target.value })}
                  rows={3}
                  placeholder="Any special conditions or requirements..."
                />
              </div>
            </div>
          </div>

          {/* Internal Notes */}
          <div>
            <Label htmlFor="internalNotes">Internal Notes (Admin Only)</Label>
            <Textarea
              id="internalNotes"
              value={formData.internalNotes}
              onChange={(e) => setFormData({ ...formData, internalNotes: e.target.value })}
              rows={3}
              placeholder="Internal notes visible only to admin team..."
            />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || success} className="min-w-[120px]">
              {loading ? 'Creating...' : success ? 'Created!' : 'Create Contract'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddContractForm;
