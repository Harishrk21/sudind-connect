import React, { useState } from 'react';
import { CreditCard, DollarSign, CheckCircle2, Clock, Download, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getCasesByClient, getInvoicesByCase, Invoice } from '@/lib/mockData';
import { cn } from '@/lib/utils';

const ClientPayments: React.FC = () => {
  const { user } = useAuth();
  const [payingInvoice, setPayingInvoice] = useState<string | null>(null);

  if (!user) return null;

  const myCases = getCasesByClient(user.id);
  const allInvoices = myCases.flatMap(c => getInvoicesByCase(c.caseId));
  
  const pendingInvoices = allInvoices.filter(i => i.status === 'pending');
  const paidInvoices = allInvoices.filter(i => i.status === 'paid');
  const totalPaid = paidInvoices.reduce((sum, i) => sum + i.amount, 0);
  const totalPending = pendingInvoices.reduce((sum, i) => sum + i.amount, 0);

  const handlePayNow = async (invoiceId: string) => {
    setPayingInvoice(invoiceId);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setPayingInvoice(null);
    // In real app, would process payment and update invoice status
    alert('Payment simulation complete! In production, this would process the actual payment.');
  };

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <Clock className="w-5 h-5 text-warning" />
            </div>
            <span className="text-sm text-muted-foreground">Pending</span>
          </div>
          <p className="text-2xl font-bold text-foreground">${totalPending.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground mt-1">{pendingInvoices.length} invoices</p>
        </div>
        
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-success/10">
              <CheckCircle2 className="w-5 h-5 text-success" />
            </div>
            <span className="text-sm text-muted-foreground">Paid</span>
          </div>
          <p className="text-2xl font-bold text-foreground">${totalPaid.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground mt-1">{paidInvoices.length} invoices</p>
        </div>
        
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Total</span>
          </div>
          <p className="text-2xl font-bold text-foreground">${(totalPaid + totalPending).toLocaleString()}</p>
          <p className="text-sm text-muted-foreground mt-1">{allInvoices.length} total invoices</p>
        </div>
      </div>

      {/* Pending payments */}
      {pendingInvoices.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Pending Payments</h3>
          <div className="space-y-3">
            {pendingInvoices.map((inv) => (
              <div
                key={inv.invoiceId}
                className="bg-card rounded-xl border border-border p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-warning/10">
                      <CreditCard className="w-6 h-6 text-warning" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-foreground">{inv.invoiceId}</p>
                        <span className="status-badge bg-warning/15 text-warning">Pending</span>
                      </div>
                      <p className="text-muted-foreground">{inv.description}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Case: {inv.caseId} • Due: {new Date(inv.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                    <p className="text-2xl font-bold text-foreground">
                      ${inv.amount.toLocaleString()}
                    </p>
                    <button
                      onClick={() => handlePayNow(inv.invoiceId)}
                      disabled={payingInvoice === inv.invoiceId}
                      className="btn-primary whitespace-nowrap"
                    >
                      {payingInvoice === inv.invoiceId ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        'Pay Now'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment history */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">Payment History</h3>
        {paidInvoices.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-8 text-center">
            <CheckCircle2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No payment history yet</p>
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="divide-y divide-border">
              {paidInvoices.map((inv) => (
                <div
                  key={inv.invoiceId}
                  className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-success/10">
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{inv.invoiceId}</p>
                      <p className="text-sm text-muted-foreground">{inv.description}</p>
                      <p className="text-xs text-muted-foreground">
                        Paid on {inv.paidAt ? new Date(inv.paidAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-semibold text-foreground">${inv.amount.toLocaleString()}</p>
                    <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                      <Download className="w-5 h-5 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Payment info */}
      <div className="flex items-start gap-3 p-4 bg-muted rounded-xl">
        <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
        <div className="text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-1">Payment Information</p>
          <p>All payments are processed securely. You will receive a confirmation email after each successful transaction. For any payment issues, please contact our support team.</p>
        </div>
      </div>
    </div>
  );
};

export default ClientPayments;
