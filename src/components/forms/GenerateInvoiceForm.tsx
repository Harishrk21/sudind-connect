import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDataStore } from '@/contexts/DataStore';
import { AlertCircle } from 'lucide-react';

interface GenerateInvoiceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caseId?: string;
  clientId?: number;
}

const GenerateInvoiceForm: React.FC<GenerateInvoiceFormProps> = ({ open, onOpenChange, caseId, clientId }) => {
  const { addInvoice, cases, users, addNotification } = useDataStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    caseId: caseId || '',
    clientId: clientId?.toString() || '',
    amount: '',
    currency: 'USD',
    description: '',
    dueDate: '',
  });

  const availableCases = cases.filter(c => !['completed', 'closed'].includes(c.status));
  const clients = users.filter(u => u.role === 'client');

  const handleCaseChange = (selectedCaseId: string) => {
    const selectedCase = cases.find(c => c.caseId === selectedCaseId);
    if (selectedCase) {
      setFormData({
        ...formData,
        caseId: selectedCaseId,
        clientId: selectedCase.clientId.toString(),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      if (!formData.caseId || !formData.clientId || !formData.amount || !formData.description || !formData.dueDate) {
        setError('Please fill in all required fields marked with *');
        setLoading(false);
        return;
      }

      const newInvoice = addInvoice({
        caseId: formData.caseId,
        clientId: parseInt(formData.clientId),
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        status: 'pending',
        description: formData.description,
        dueDate: formData.dueDate,
      });

      addNotification({
        userId: parseInt(formData.clientId),
        title: 'New Invoice Generated',
        message: `Invoice ${newInvoice.invoiceId} for ${formData.amount} ${formData.currency}`,
        type: 'info',
      });

      setSuccess(true);
      
      setFormData({
        caseId: caseId || '',
        clientId: clientId?.toString() || '',
        amount: '',
        currency: 'USD',
        description: '',
        dueDate: '',
      });

      setTimeout(() => {
        onOpenChange(false);
        setSuccess(false);
      }, 1500);
    } catch (error) {
      setError('Failed to generate invoice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Generate Invoice</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="caseId">Case *</Label>
            <Select
              value={formData.caseId}
              onValueChange={handleCaseChange}
              required
              disabled={!!caseId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select case" />
              </SelectTrigger>
              <SelectContent>
                {availableCases.map((c) => (
                  <SelectItem key={c.caseId} value={c.caseId}>
                    {c.caseId} - {c.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Amount (USD) *</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
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
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="INR">INR</SelectItem>
                  <SelectItem value="SDG">SDG</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={3}
              placeholder="e.g., Initial consultation and diagnostic fees"
            />
          </div>

          <div>
            <Label htmlFor="dueDate">Due Date *</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || success}>
              {loading ? 'Generating...' : success ? 'Generated!' : 'Generate Invoice'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateInvoiceForm;

