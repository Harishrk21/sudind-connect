import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Bell, Heart, TrendingUp, AlertCircle, CheckCircle2, Calendar, Star, MessageSquare, ThumbsUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getCasesByClient, getInvoicesByCase } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import AppointmentDetailsDialog from './AppointmentDetailsDialog';
import RecommendationDialog from './RecommendationDialog';
import MissingDocumentsDialog from './MissingDocumentsDialog';
import SpecialOfferDialog from './SpecialOfferDialog';
import FeedbackDialog from './FeedbackDialog';

const CustomerAI: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Dialog states
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);
  const [recommendationDialogOpen, setRecommendationDialogOpen] = useState(false);
  const [missingDocsDialogOpen, setMissingDocsDialogOpen] = useState(false);
  const [offerDialogOpen, setOfferDialogOpen] = useState(false);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);

  if (!user || user.role !== 'client') return null;

  const myCases = getCasesByClient(user.id);
  const allInvoices = myCases.flatMap(c => getInvoicesByCase(c.caseId));
  const pendingInvoices = allInvoices.filter(i => i.status === 'pending');
  const completedCases = myCases.filter(c => ['completed', 'closed'].includes(c.status));
  const activeCases = myCases.filter(c => !['completed', 'closed'].includes(c.status));
  const firstActiveCase = activeCases.length > 0 ? activeCases[0] : null;

  // Calculate satisfaction metrics
  const satisfactionScore = 4.7; // Mock score - would be calculated from actual feedback
  const responseTime = '2.5 hours'; // Average response time
  const recommendationAccuracy = '92%'; // Based on user interactions

  // Handle action clicks
  const handleActionClick = (type: string) => {
    switch (type) {
      case 'reminder':
        setAppointmentDialogOpen(true);
        break;
      case 'recommendation':
        setRecommendationDialogOpen(true);
        break;
      case 'alert':
        setMissingDocsDialogOpen(true);
        break;
      case 'offer':
        setOfferDialogOpen(true);
        break;
      default:
        break;
    }
  };

  // Mock AI recommendations
  const aiRecommendations = [
    {
      type: 'reminder',
      icon: Calendar,
      title: 'Appointment Reminder',
      message: firstActiveCase 
        ? `Your case ${firstActiveCase.caseId} is ${firstActiveCase.status === 'approved' ? 'approved and ready for next steps' : 'in progress'}. Check your case details for updates.`
        : 'You have upcoming appointments. Check your cases for details.',
      action: 'View Details',
      color: 'text-info',
      bg: 'bg-info/10',
    },
    {
      type: 'recommendation',
      icon: Heart,
      title: 'Best Hospital Recommendation',
      message: firstActiveCase?.type === 'medical'
        ? 'Based on your case, we recommend top-rated hospitals for your treatment. View your cases to see recommendations.'
        : 'Based on your profile, we recommend top universities. View your cases to see recommendations.',
      action: 'Learn More',
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      type: 'alert',
      icon: AlertCircle,
      title: 'Missing Documents',
      message: firstActiveCase
        ? `Your case ${firstActiveCase.caseId} may require additional documents. Please upload them to avoid delays.`
        : 'Some of your cases may require additional documents. Please check and upload them soon.',
      action: 'Upload Now',
      color: 'text-warning',
      bg: 'bg-warning/10',
    },
    {
      type: 'offer',
      icon: TrendingUp,
      title: 'Special Offer',
      message: pendingInvoices.length > 0
        ? `Get 10% off on your next payment. You have ${pendingInvoices.length} pending ${pendingInvoices.length === 1 ? 'invoice' : 'invoices'}.`
        : 'Get 10% off on your next medical consultation. Valid until Dec 31, 2024',
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
                <button 
                  onClick={() => handleActionClick(rec.type)}
                  className="text-xs text-primary hover:underline font-medium cursor-pointer transition-colors hover:text-primary/80"
                >
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
          <p className="text-xs text-muted-foreground mb-2">
            You have {pendingInvoices.length} pending {pendingInvoices.length === 1 ? 'payment' : 'payments'}. 
            Complete them to avoid delays in your case processing.
          </p>
          <button
            onClick={() => navigate('/client/payment-gateway')}
            className="text-xs text-warning hover:underline font-medium cursor-pointer transition-colors hover:text-warning/80"
          >
            Pay Now →
          </button>
        </div>
      )}

      {/* Dialogs */}
      <AppointmentDetailsDialog
        open={appointmentDialogOpen}
        onOpenChange={setAppointmentDialogOpen}
        caseData={firstActiveCase}
      />
      <RecommendationDialog
        open={recommendationDialogOpen}
        onOpenChange={setRecommendationDialogOpen}
        caseData={firstActiveCase}
      />
      <MissingDocumentsDialog
        open={missingDocsDialogOpen}
        onOpenChange={setMissingDocsDialogOpen}
        caseData={firstActiveCase}
      />
      <SpecialOfferDialog
        open={offerDialogOpen}
        onOpenChange={setOfferDialogOpen}
        pendingInvoices={pendingInvoices}
      />
      <FeedbackDialog
        open={feedbackDialogOpen}
        onOpenChange={setFeedbackDialogOpen}
        completedCasesCount={completedCases.length}
      />

      {/* Customer Satisfaction Metrics */}
      <div className="bg-card rounded-xl border border-border p-4 space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <ThumbsUp className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">Satisfaction Metrics</h3>
            <p className="text-xs text-muted-foreground">Your service experience insights</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {/* Overall Satisfaction Score */}
          <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-warning" />
              <span className="text-xs font-medium text-foreground">Overall Satisfaction</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-foreground">{satisfactionScore}</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      'w-3 h-3',
                      star <= Math.floor(satisfactionScore)
                        ? 'text-warning fill-warning'
                        : star === Math.ceil(satisfactionScore) && satisfactionScore % 1 >= 0.5
                        ? 'text-warning fill-warning/50'
                        : 'text-muted-foreground'
                    )}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Response Time */}
          <div className="flex items-center justify-between p-3 bg-info/5 rounded-lg">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-info" />
              <span className="text-xs font-medium text-foreground">Avg. Response Time</span>
            </div>
            <span className="text-sm font-semibold text-info">{responseTime}</span>
          </div>

          {/* Recommendation Accuracy */}
          <div className="flex items-center justify-between p-3 bg-success/5 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span className="text-xs font-medium text-foreground">Recommendation Accuracy</span>
            </div>
            <span className="text-sm font-semibold text-success">{recommendationAccuracy}</span>
          </div>

          {/* Completed Cases */}
          {completedCases.length > 0 && (
            <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-foreground">Completed Cases</span>
              </div>
              <span className="text-sm font-semibold text-primary">{completedCases.length}</span>
            </div>
          )}
        </div>

        {/* Feedback Prompt */}
        {completedCases.length > 0 && (
          <button 
            onClick={() => setFeedbackDialogOpen(true)}
            className="w-full mt-3 p-2 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors cursor-pointer"
          >
            <span className="text-xs font-medium text-primary">Share Your Feedback →</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default CustomerAI;

