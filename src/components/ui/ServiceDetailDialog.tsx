import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { LucideIcon, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ServiceDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: {
    icon: LucideIcon;
    title: string;
    description: string;
    detailedDescription: string;
    features: string[];
    benefits: string[];
    process: string[];
    useCases?: string[];
  };
}

const ServiceDetailDialog: React.FC<ServiceDetailDialogProps> = ({
  open,
  onOpenChange,
  service,
}) => {
  const Icon = service.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10">
              <Icon className="h-8 w-8 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl">{service.title}</DialogTitle>
              <DialogDescription className="text-base mt-2">
                {service.description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Detailed Description */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Overview</h3>
            <p className="text-muted-foreground leading-relaxed">
              {service.detailedDescription}
            </p>
          </div>

          {/* Key Features */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Key Features</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {service.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          {service.benefits && service.benefits.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3">Benefits</h3>
              <ul className="space-y-2">
                {service.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <ArrowRight className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Process */}
          {service.process && service.process.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3">How It Works</h3>
              <ol className="space-y-3">
                {service.process.map((step, index) => (
                  <li key={index} className="flex gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className="text-sm text-muted-foreground pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Use Cases */}
          {service.useCases && service.useCases.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3">Use Cases</h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {service.useCases.map((useCase, index) => (
                  <div key={index} className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{useCase}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={() => onOpenChange(false)}>
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceDetailDialog;

