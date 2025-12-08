import React from 'react';
import { Brain, Bell, Heart, TrendingUp, AlertCircle, CheckCircle2, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getCasesByClient, getInvoicesByCase } from '@/lib/mockData';
import { cn } from '@/lib/utils';

const CustomerAI: React.FC = () => {
  const { user } = useAuth();

  if (!user || user.role !== 'client') return null;

  const myCases = getCasesByClient(user.id);
  const allInvoices = myCases.flatMap(c => getInvoicesByCase(c.caseId));
  const pendingInvoices = allInvoices.filter(i => i.status === 'pending');

  // Mock AI recommendations
  const aiRecommendations = [
    {
      type: 'reminder',
      icon: Calendar,
      title: 'Appointment Reminder',
      message: 'Your next appointment at Apollo Hospitals is scheduled for Dec 15, 2024',
      action: 'View Details',
      color: 'text-info',
      bg: 'bg-info/10',
    },
    {
      type: 'recommendation',
      icon: Heart,
      title: 'Best Hospital Recommendation',
      message: 'Based on your case, we recommend Fortis Hospital for orthopedic procedures',
      action: 'Learn More',
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      type: 'alert',
      icon: AlertCircle,
      title: 'Missing Documents',
      message: 'Your case MED-001 requires updated lab results. Please upload them soon.',
      action: 'Upload Now',
      color: 'text-warning',
      bg: 'bg-warning/10',
    },
    {
      type: 'offer',
      icon: TrendingUp,
      title: 'Special Offer',
      message: 'Get 10% off on your next medical consultation. Valid until Dec 31, 2024',
      action: 'Claim Offer',
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <Brain className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">AI Assistant</h3>
          <p className="text-xs text-muted-foreground">Smart recommendations for you</p>
        </div>
      </div>

      <div className="space-y-3">
        {aiRecommendations.map((rec, idx) => (
          <div
            key={idx}
            className={cn(
              'bg-card rounded-xl border border-border p-4 hover:shadow-md transition-all',
              rec.bg
            )}
          >
            <div className="flex items-start gap-3">
              <div className={cn('p-2 rounded-lg', rec.bg)}>
                <rec.icon className={cn('w-4 h-4', rec.color)} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground text-sm mb-1">{rec.title}</p>
                <p className="text-xs text-muted-foreground mb-2">{rec.message}</p>
                <button className="text-xs text-primary hover:underline font-medium">
                  {rec.action} →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {pendingInvoices.length > 0 && (
        <div className="bg-warning/10 border border-warning/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="w-4 h-4 text-warning" />
            <p className="font-medium text-foreground text-sm">Payment Alert</p>
          </div>
          <p className="text-xs text-muted-foreground">
            You have {pendingInvoices.length} pending {pendingInvoices.length === 1 ? 'payment' : 'payments'}. 
            Complete them to avoid delays in your case processing.
          </p>
        </div>
      )}
    </div>
  );
};

export default CustomerAI;

