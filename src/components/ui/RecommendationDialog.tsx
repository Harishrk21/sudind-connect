import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Heart, Star, MapPin, CheckCircle2, Building2, GraduationCap } from 'lucide-react';
import { Case } from '@/lib/mockData';
import { cn } from '@/lib/utils';

interface RecommendationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caseData: Case | null;
}

const RecommendationDialog: React.FC<RecommendationDialogProps> = ({ 
  open, 
  onOpenChange, 
  caseData 
}) => {
  const navigate = useNavigate();

  // Mock recommendations based on case type
  const medicalRecommendations = [
    {
      id: 1,
      name: 'Apollo Hospitals',
      city: 'New Delhi',
      specialties: ['Cardiology', 'Orthopedics', 'Oncology'],
      rating: 4.8,
      distance: '2.5 km',
      availability: 'Available',
      estimatedCost: '$5,000 - $8,000',
      features: ['24/7 Emergency', 'ICU Facilities', 'International Patients']
    },
    {
      id: 2,
      name: 'Fortis Healthcare',
      city: 'Mumbai',
      specialties: ['Orthopedics', 'Neurology', 'Cardiac Surgery'],
      rating: 4.7,
      distance: '3.2 km',
      availability: 'Available',
      estimatedCost: '$4,500 - $7,500',
      features: ['JCI Accredited', 'Robotic Surgery', 'Multi-specialty']
    },
    {
      id: 3,
      name: 'Max Healthcare',
      city: 'Gurgaon',
      specialties: ['Oncology', 'Transplant', 'Cardiology'],
      rating: 4.9,
      distance: '5.1 km',
      availability: 'Available',
      estimatedCost: '$6,000 - $10,000',
      features: ['Premium Care', 'International Standards', 'Expert Doctors']
    }
  ];

  const academicRecommendations = [
    {
      id: 1,
      name: 'Indian Institute of Technology (IIT)',
      city: 'Delhi',
      programs: ['B.Tech Computer Science', 'M.Tech', 'PhD'],
      rating: 4.9,
      acceptanceRate: '5%',
      tuition: '$2,000 - $4,000/year',
      features: ['Top Ranked', 'Research Opportunities', 'Placement Support']
    },
    {
      id: 2,
      name: 'Delhi University',
      city: 'New Delhi',
      programs: ['B.A.', 'B.Sc.', 'M.A.', 'M.Sc.'],
      rating: 4.6,
      acceptanceRate: '15%',
      tuition: '$1,500 - $3,000/year',
      features: ['Diverse Programs', 'Cultural Activities', 'Affordable']
    },
    {
      id: 3,
      name: 'Jawaharlal Nehru University (JNU)',
      city: 'New Delhi',
      programs: ['M.A.', 'M.Phil', 'PhD'],
      rating: 4.7,
      acceptanceRate: '10%',
      tuition: '$1,000 - $2,500/year',
      features: ['Research Focus', 'Scholarships Available', 'International Students']
    }
  ];

  const recommendations = caseData?.type === 'medical' ? medicalRecommendations : academicRecommendations;
  const isMedical = caseData?.type === 'medical';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Heart className="w-6 h-6 text-success" />
            {isMedical ? 'Recommended Hospitals' : 'Recommended Universities'}
          </DialogTitle>
          <DialogDescription>
            {isMedical 
              ? 'Based on your case, we recommend these top-rated hospitals for your treatment'
              : 'Based on your profile, we recommend these top universities for your studies'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {isMedical ? (
                      <Building2 className="w-5 h-5 text-primary" />
                    ) : (
                      <GraduationCap className="w-5 h-5 text-primary" />
                    )}
                    <h3 className="font-semibold text-foreground text-lg">{rec.name}</h3>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{rec.city}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-warning fill-warning" />
                      <span>{rec.rating}</span>
                    </div>
                    {!isMedical && (
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                        <span>Acceptance: {rec.acceptanceRate}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className={cn(
                  'px-3 py-1 rounded-full text-xs font-medium',
                  rec.availability === 'Available' || rec.acceptanceRate
                    ? 'bg-success/10 text-success'
                    : 'bg-warning/10 text-warning'
                )}>
                  {rec.availability || 'Open'}
                </div>
              </div>

              <div className="mb-3">
                <p className="text-xs text-muted-foreground mb-1">
                  {isMedical ? 'Specialties' : 'Programs'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {(isMedical ? rec.specialties : rec.programs).map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {isMedical ? 'Estimated Cost' : 'Tuition Fee'}
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {isMedical ? rec.estimatedCost : rec.tuition}
                  </p>
                </div>
                {isMedical && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Distance</p>
                    <p className="text-sm font-semibold text-foreground">{rec.distance}</p>
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-2">Key Features</p>
                <div className="flex flex-wrap gap-2">
                  {rec.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1 px-2 py-1 bg-success/10 rounded-md"
                    >
                      <CheckCircle2 className="w-3 h-3 text-success" />
                      <span className="text-xs text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => {
                  onOpenChange(false);
                  navigate('/client/booking', {
                    state: {
                      institutionName: rec.name,
                      institutionType: isMedical ? 'hospital' : 'university',
                      city: rec.city,
                    }
                  });
                }}
                className="w-full mt-4"
                size="sm"
              >
                Request Appointment / Apply Now
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 bg-info/10 border border-info/20 rounded-xl">
          <p className="text-xs text-muted-foreground text-center">
            💡 These recommendations are based on your case details, ratings, and availability. 
            Our team can help you with the booking or application process.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecommendationDialog;

