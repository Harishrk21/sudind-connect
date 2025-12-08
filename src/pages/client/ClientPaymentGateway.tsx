import React, { useState } from 'react';
import { CreditCard, Smartphone, Building2, Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useDataStore } from '@/contexts/DataStore';
import { EmailWorkflowService } from '@/lib/notificationService';
import { getCasesByClient, getInvoicesByCase, Invoice } from '@/lib/mockData';
import { cn } from '@/lib/utils';

const ClientPaymentGateway: React.FC = () => {
  const { user } = useAuth();
  const { cases, invoices, updateInvoice, addNotification } = useDataStore();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<'mobile_money' | 'bank_card' | 'bank_transfer' | null>(null);
  const [paymentStep, setPaymentStep] = useState<'select' | 'details' | 'confirm'>('select');

  if (!user) return null;

  const myCases = getCasesByClient(user.id, cases);
  const allInvoices = myCases.flatMap(c => getInvoicesByCase(c.caseId, invoices));
  const pendingInvoices = allInvoices.filter(i => i.status === 'pending');

  const paymentMethods = [
    {
      id: 'mobile_money',
      name: 'Mobile Money',
      icon: Smartphone,
      description: 'Pay using MTN Mobile Money or Zain Cash',
      enabled: true,
    },
    {
      id: 'bank_card',
      name: 'Bank Card',
      icon: CreditCard,
      description: 'Visa, Mastercard, or other debit/credit cards',
      enabled: true,
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      icon: Building2,
      description: 'Direct bank transfer to our account',
      enabled: true,
    },
  ];

  const handlePayment = async () => {
    if (!selectedInvoice) return;
    
    // Update invoice status
    updateInvoice(selectedInvoice.invoiceId, {
      status: 'paid',
      paidAt: new Date().toISOString().split('T')[0],
    });

    // Add notification
    addNotification({
      userId: user.id,
      title: 'Payment Successful',
      message: `Payment of $${selectedInvoice.amount} processed successfully`,
      type: 'success',
    });

    // Send payment confirmation email
    if (user.email) {
      try {
        await EmailWorkflowService.sendPaymentConfirmation(
          user.email,
          selectedInvoice.invoiceId,
          selectedInvoice.amount
        );
      } catch (error) {
        console.error('Failed to send payment confirmation email:', error);
      }
    }

    setPaymentStep('select');
    setSelectedInvoice(null);
    setSelectedMethod(null);
  };

  if (paymentStep === 'select' && !selectedInvoice) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Payment Gateway</h2>
          <p className="text-muted-foreground">Secure online payment system</p>
        </div>

        {pendingInvoices.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-8 text-center">
            <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-4" />
            <p className="text-muted-foreground">No pending payments</p>
          </div>
        ) : (
          <>
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4">Pending Invoices</h3>
              <div className="space-y-3">
                {pendingInvoices.map((inv) => (
                  <div
                    key={inv.invoiceId}
                    onClick={() => setSelectedInvoice(inv)}
                    className="flex items-center justify-between p-4 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-foreground">{inv.invoiceId}</p>
                      <p className="text-sm text-muted-foreground">{inv.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Due: {new Date(inv.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-foreground">${inv.amount.toLocaleString()}</p>
                      <ArrowRight className="w-5 h-5 text-muted-foreground mt-2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  if (paymentStep === 'select' && selectedInvoice) {
    return (
      <div className="space-y-6">
        <div>
          <button
            onClick={() => {
              setSelectedInvoice(null);
              setSelectedMethod(null);
            }}
            className="text-sm text-primary hover:underline mb-4"
          >
            ← Back to invoices
          </button>
          <h2 className="text-2xl font-bold text-foreground">Select Payment Method</h2>
          <p className="text-muted-foreground">Choose your preferred payment method</p>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">{selectedInvoice.invoiceId}</p>
              <p className="text-sm text-muted-foreground">{selectedInvoice.description}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">${selectedInvoice.amount.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">{selectedInvoice.currency}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => {
                setSelectedMethod(method.id as typeof selectedMethod);
                setPaymentStep('details');
              }}
              className={cn(
                'bg-card rounded-xl border p-6 text-left hover:shadow-md transition-all',
                'border-border hover:border-primary/30'
              )}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <method.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{method.name}</h3>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{method.description}</p>
              <div className="flex items-center gap-2 mt-4">
                <Lock className="w-4 h-4 text-success" />
                <span className="text-xs text-success">Secure Payment</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (paymentStep === 'details' && selectedMethod) {
    return (
      <div className="space-y-6 max-w-2xl">
        <div>
          <button
            onClick={() => setPaymentStep('select')}
            className="text-sm text-primary hover:underline mb-4"
          >
            ← Back to payment methods
          </button>
          <h2 className="text-2xl font-bold text-foreground">Payment Details</h2>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {selectedMethod === 'mobile_money' ? 'Mobile Number' : 
               selectedMethod === 'bank_card' ? 'Card Number' : 
               'Account Number'}
            </label>
            <input
              type="text"
              placeholder={selectedMethod === 'mobile_money' ? 'Enter mobile number' : 
                          selectedMethod === 'bank_card' ? '1234 5678 9012 3456' : 
                          'Enter account number'}
              className="input-field"
            />
          </div>

          {selectedMethod === 'bank_card' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Expiry Date</label>
                  <input type="text" placeholder="MM/YY" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">CVV</label>
                  <input type="text" placeholder="123" className="input-field" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Cardholder Name</label>
                <input type="text" placeholder="John Doe" className="input-field" />
              </div>
            </>
          )}

          {selectedMethod === 'bank_transfer' && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Bank Name</label>
              <input type="text" placeholder="Enter bank name" className="input-field" />
            </div>
          )}

          <div className="bg-muted rounded-lg p-4 mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-semibold text-foreground">${selectedInvoice?.amount.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Processing Fee</span>
              <span className="font-semibold text-foreground">$0.00</span>
            </div>
            <div className="border-t border-border mt-2 pt-2 flex items-center justify-between">
              <span className="font-semibold text-foreground">Total</span>
              <span className="text-xl font-bold text-primary">${selectedInvoice?.amount.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={() => setPaymentStep('confirm')}
            className="btn-primary w-full"
          >
            Continue to Confirmation
          </button>
        </div>
      </div>
    );
  }

  if (paymentStep === 'confirm') {
    return (
      <div className="space-y-6 max-w-2xl">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Confirm Payment</h2>
          <p className="text-muted-foreground">Review your payment details before confirming</p>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <span className="text-muted-foreground">Invoice</span>
            <span className="font-medium text-foreground">{selectedInvoice?.invoiceId}</span>
          </div>
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <span className="text-muted-foreground">Payment Method</span>
            <span className="font-medium text-foreground">
              {paymentMethods.find(m => m.id === selectedMethod)?.name}
            </span>
          </div>
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <span className="text-muted-foreground">Amount</span>
            <span className="text-xl font-bold text-primary">${selectedInvoice?.amount.toLocaleString()}</span>
          </div>

          <div className="bg-success/10 border border-success/20 rounded-lg p-4 flex items-center gap-3">
            <Lock className="w-5 h-5 text-success" />
            <div>
              <p className="font-medium text-foreground">Secure Payment</p>
              <p className="text-sm text-muted-foreground">
                Your payment is encrypted and secure. We never store your payment details.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setPaymentStep('details')}
              className="btn-secondary flex-1"
            >
              Back
            </button>
            <button
              onClick={handlePayment}
              className="btn-primary flex-1"
            >
              Confirm & Pay
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ClientPaymentGateway;

