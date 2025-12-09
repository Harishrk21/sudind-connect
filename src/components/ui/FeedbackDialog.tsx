import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ThumbsUp, Star, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  completedCasesCount: number;
}

const FeedbackDialog: React.FC<FeedbackDialogProps> = ({ 
  open, 
  onOpenChange, 
  completedCasesCount 
}) => {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      return;
    }
    
    // In production, this would send feedback to the backend
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setRating(0);
      setFeedback('');
      onOpenChange(false);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <ThumbsUp className="w-6 h-6 text-primary" />
            Share Your Feedback
          </DialogTitle>
          <DialogDescription>
            Your feedback helps us improve our services. We appreciate your time!
          </DialogDescription>
        </DialogHeader>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            {/* Rating Section */}
            <div>
              <Label className="text-base font-semibold text-foreground mb-3 block">
                How would you rate your overall experience?
              </Label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className={cn(
                      'p-2 rounded-lg transition-all',
                      (hoveredRating >= star || rating >= star)
                        ? 'bg-warning/20 scale-110'
                        : 'bg-card hover:bg-card/80'
                    )}
                  >
                    <Star
                      className={cn(
                        'w-8 h-8 transition-colors',
                        (hoveredRating >= star || rating >= star)
                          ? 'text-warning fill-warning'
                          : 'text-muted-foreground'
                      )}
                    />
                  </button>
                ))}
                {rating > 0 && (
                  <span className="ml-2 text-sm font-medium text-foreground">
                    {rating === 5 ? 'Excellent' : 
                     rating === 4 ? 'Very Good' : 
                     rating === 3 ? 'Good' : 
                     rating === 2 ? 'Fair' : 'Poor'}
                  </span>
                )}
              </div>
            </div>

            {/* Feedback Text */}
            <div>
              <Label htmlFor="feedback" className="text-base font-semibold text-foreground mb-2 block">
                Tell us more about your experience
              </Label>
              <Textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="What did you like? What could we improve? Your detailed feedback is valuable to us..."
                className="min-h-[120px]"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {feedback.length} characters
              </p>
            </div>

            {/* Quick Feedback Options */}
            <div>
              <Label className="text-sm font-medium text-foreground mb-2 block">
                What did you appreciate most? (Optional)
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'Fast Response Time',
                  'Professional Service',
                  'Clear Communication',
                  'Helpful Support',
                  'Easy to Use Platform',
                  'Quality of Care'
                ].map((option) => (
                  <button
                    key={option}
                    type="button"
                    className="text-left px-3 py-2 bg-card border border-border rounded-lg hover:bg-primary/10 hover:border-primary/30 transition-colors text-sm"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            {completedCasesCount > 0 && (
              <div className="bg-info/10 border border-info/20 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  Thank you for being a valued customer! You've completed {completedCasesCount} 
                  {completedCasesCount === 1 ? ' case' : ' cases'} with us.
                </p>
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => onOpenChange(false)}
              >
                Skip
              </Button>
              <Button
                type="submit"
                disabled={rating === 0}
              >
                <Send className="w-4 h-4" />
                Submit Feedback
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Thank You!</h3>
            <p className="text-sm text-muted-foreground">
              Your feedback has been submitted successfully. We appreciate your input!
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;

