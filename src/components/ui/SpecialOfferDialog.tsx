import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TrendingUp, CheckCircle2, Gift, Calendar, Percent } from 'lucide-react';
import { Invoice } from '@/lib/mockData';
import { cn } from '@/lib/utils';

interface SpecialOfferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pendingInvoices: Invoice[];
}

const SpecialOfferDialog: React.FC<SpecialOfferDialogProps> = ({ 
  open, 
  onOpenChange, 
  pendingInvoices 
}) => {
  const navigate = useNavigate();
  const [claimed, setClaimed] = useState(false);

  const offer = {
    title: 'Special Discount Offer',
    discount: 10,
    code: 'SUDIND10',
    validUntil: 'December 31, 2024',
    description: 'Get 10% off on your next payment or consultation',
    terms: [
      'Valid for all payments made before December 31, 2024',
      'Applicable on invoices above $500',
      'Cannot be combined with other offers',
      'One-time use per customer'
    ]
  };

  const handleClaimOffer = () => {
    setClaimed(true);
    // In production, this would apply the discount code
    setTimeout(() => {
      onOpenChange(false);
      if (pendingInvoices.length > 0) {
        navigate('/client/payment-gateway');
      } else {
        navigate('/client/cases');
      }
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Gift className="w-6 h-6 text-primary" />
            Special Offer
          </DialogTitle>
          <DialogDescription>
            Exclusive discount available for you
          </DialogDescription>
        </DialogHeader>

        {!claimed ? (
          <div className="space-y-6 mt-4">
            {/* Offer Banner */}
            <div className="bg-gradient-to-r from-primary/20 to-success/20 rounded-xl p-6 text-center border border-primary/30">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Percent className="w-8 h-8 text-primary" />
                <span className="text-4xl font-bold text-foreground">{offer.discount}%</span>
              </div>
              <p className="text-lg font-semibold text-foreground mb-1">OFF</p>
              <p className="text-sm text-muted-foreground">{offer.description}</p>
            </div>

            {/* Offer Code */}
            <div className="bg-card rounded-xl border border-border p-4">
              <p className="text-sm text-muted-foreground mb-2">Your Discount Code</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-primary/10 border border-primary/30 rounded-lg px-4 py-3">
                  <code className="text-lg font-mono font-bold text-primary">{offer.code}</code>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => navigator.clipboard.writeText(offer.code)}
                >
                  Copy
                </Button>
              </div>
            </div>

            {/* Offer Details */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-info" />
                <div>
                  <p className="text-sm font-medium text-foreground">Valid Until</p>
                  <p className="text-xs text-muted-foreground">{offer.validUntil}</p>
                </div>
              </div>

              {pendingInvoices.length > 0 && (
                <div className="bg-info/10 border border-info/20 rounded-lg p-4">
                  <p className="text-sm font-medium text-foreground mb-1">
                    Apply to Your Pending Payments
                  </p>
                  <p className="text-xs text-muted-foreground">
                    You have {pendingInvoices.length} pending {pendingInvoices.length === 1 ? 'invoice' : 'invoices'} 
                    totaling ${pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}. 
                    This discount will be applied automatically when you proceed to payment.
                  </p>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-foreground mb-2">Terms & Conditions</p>
                <ul className="space-y-2">
                  {offer.terms.map((term, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                      <span>{term}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Offer Claimed!</h3>
            <p className="text-sm text-muted-foreground">
              Your discount code has been applied. Redirecting you to payment...
            </p>
          </div>
        )}

        <DialogFooter>
          {!claimed && (
            <>
              <Button
                variant="secondary"
                onClick={() => onOpenChange(false)}
              >
                Maybe Later
              </Button>
              <Button
                onClick={handleClaimOffer}
              >
                <TrendingUp className="w-4 h-4" />
                Claim Offer
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SpecialOfferDialog;

