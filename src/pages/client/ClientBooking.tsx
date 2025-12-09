import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Building2, GraduationCap, Calendar, MapPin, Star, CheckCircle2, ArrowLeft, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useDataStore } from '@/contexts/DataStore';
import { cn } from '@/lib/utils';

interface BookingData {
  institutionName: string;
  institutionType: 'hospital' | 'university';
  city: string;
  preferredDate?: string;
  preferredTime?: string;
  specialRequirements?: string;
  contactPhone?: string;
  notes?: string;
}

const ClientBooking: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { addCase, addNotification } = useDataStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Get booking data from location state (passed from recommendation dialog)
  const bookingData = location.state as BookingData | null;

  const [formData, setFormData] = useState<BookingData>({
    institutionName: bookingData?.institutionName || '',
    institutionType: bookingData?.institutionType || 'hospital',
    city: bookingData?.city || '',
    preferredDate: '',
    preferredTime: '',
    specialRequirements: '',
    contactPhone: user?.phone || '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      // In production, this would create a booking/appointment request
      // For now, we'll create a new case
      if (user) {
        const newCase = addCase({
          clientId: user.id,
          agentId: 1, // Unassigned initially
          type: formData.institutionType === 'hospital' ? 'medical' : 'academic',
          status: 'new',
          title: `${formData.institutionType === 'hospital' ? 'Appointment' : 'Application'} Request - ${formData.institutionName}`,
          description: `Request for ${formData.institutionType === 'hospital' ? 'appointment' : 'admission'} at ${formData.institutionName} in ${formData.city}. ${formData.specialRequirements ? `Special requirements: ${formData.specialRequirements}` : ''} ${formData.notes ? `Notes: ${formData.notes}` : ''}`,
          hospital: formData.institutionType === 'hospital' ? formData.institutionName : undefined,
          university: formData.institutionType === 'university' ? formData.institutionName : undefined,
        });

        addNotification({
          userId: user.id,
          title: 'Booking Request Submitted',
          message: `Your ${formData.institutionType === 'hospital' ? 'appointment' : 'application'} request has been submitted successfully. Case ID: ${newCase.caseId}`,
          type: 'success',
        });

        setSuccess(true);
        setTimeout(() => {
          navigate(`/client/cases/${newCase.caseId}`);
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to submit booking:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Please log in to make a booking.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {formData.institutionType === 'hospital' ? 'Request Appointment' : 'Apply for Admission'}
          </h2>
          <p className="text-muted-foreground">
            {formData.institutionType === 'hospital' 
              ? 'Book an appointment with the recommended hospital'
              : 'Submit your application to the recommended university'}
          </p>
        </div>
      </div>

      {success ? (
        <div className="bg-card rounded-xl border border-border p-8 text-center">
          <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-success" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">Request Submitted!</h3>
          <p className="text-muted-foreground">
            Your {formData.institutionType === 'hospital' ? 'appointment' : 'application'} request has been submitted successfully.
            Redirecting to your case...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Institution Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border border-border p-6 sticky top-4">
              <div className="flex items-center gap-3 mb-4">
                {formData.institutionType === 'hospital' ? (
                  <Building2 className="w-8 h-8 text-primary" />
                ) : (
                  <GraduationCap className="w-8 h-8 text-primary" />
                )}
                <div>
                  <h3 className="font-semibold text-foreground text-lg">
                    {formData.institutionName || 'Institution Name'}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{formData.city || 'City'}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-warning fill-warning" />
                  <span className="text-muted-foreground">Highly Recommended</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span className="text-muted-foreground">
                    {formData.institutionType === 'hospital' ? 'Verified Hospital' : 'Accredited University'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="institutionName">
                    {formData.institutionType === 'hospital' ? 'Hospital Name' : 'University Name'} *
                  </Label>
                  <Input
                    id="institutionName"
                    value={formData.institutionName}
                    onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                    required
                    placeholder="Enter institution name"
                  />
                </div>
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                    placeholder="Enter city"
                  />
                </div>
              </div>

              {formData.institutionType === 'hospital' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="preferredDate">Preferred Date</Label>
                    <Input
                      id="preferredDate"
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <Label htmlFor="preferredTime">Preferred Time</Label>
                    <Input
                      id="preferredTime"
                      type="time"
                      value={formData.preferredTime}
                      onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                    />
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="contactPhone">Contact Phone *</Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  required
                  placeholder="+249 XXX XXX XXX"
                />
              </div>

              <div>
                <Label htmlFor="specialRequirements">
                  {formData.institutionType === 'hospital' ? 'Medical Requirements' : 'Academic Requirements'}
                </Label>
                <Textarea
                  id="specialRequirements"
                  value={formData.specialRequirements}
                  onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                  placeholder={formData.institutionType === 'hospital' 
                    ? 'Describe your medical condition or treatment needs...'
                    : 'Describe your academic background and program interests...'}
                  className="min-h-[100px]"
                />
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any additional information you'd like to provide..."
                  className="min-h-[80px]"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate(-1)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading || !formData.institutionName || !formData.city || !formData.contactPhone}
                  className="flex-1"
                >
                  {loading ? 'Submitting...' : formData.institutionType === 'hospital' ? 'Request Appointment' : 'Submit Application'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientBooking;

