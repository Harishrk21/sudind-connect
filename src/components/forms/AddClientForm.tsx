import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDataStore } from '@/contexts/DataStore';
import { ClientType } from '@/lib/mockData';
import { AlertCircle, User, Mail, Phone, MapPin, Calendar, FileText, Stethoscope, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddClientFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddClientForm: React.FC<AddClientFormProps> = ({ open, onOpenChange }) => {
  const { addUser, addNotification } = useDataStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Information
    name: '',
    email: '',
    password: '',
    phone: '',
    dateOfBirth: '',
    gender: '' as 'male' | 'female' | 'other' | '',
    nationality: 'Sudanese',
    passportNumber: '',
    passportExpiry: '',
    address: '',
    city: '',
    state: '',
    country: 'Sudan',
    postalCode: '',
    
    // Client Type Specific
    clientType: '' as ClientType | '',
    
    // Medical Specific (for patients)
    bloodGroup: '',
    medicalHistory: '',
    currentMedications: '',
    allergies: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    
    // Academic Specific (for students)
    previousEducation: '',
    institutionName: '',
    graduationYear: '',
    gpa: '',
    desiredProgram: '',
    desiredUniversity: '',
    
    // Account Status
    status: 'active' as 'active' | 'inactive',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.password || !formData.clientType || 
          !formData.phone || !formData.dateOfBirth || !formData.passportNumber) {
        setError('Please fill in all required fields marked with *');
        setLoading(false);
        return;
      }

      // Add client
      const newClient = addUser({
        role: 'client',
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        clientType: formData.clientType as ClientType,
        country: formData.country,
        status: formData.status,
      });

      // Add notification
      addNotification({
        userId: 1, // Admin
        title: 'New Client Registered',
        message: `${formData.name} has been registered as a ${formData.clientType}`,
        type: 'success',
      });

      // Send welcome email
      try {
        const { EmailWorkflowService } = await import('@/lib/notificationService');
        await EmailWorkflowService.sendWelcomeEmail(formData.email, formData.name);
      } catch (error) {
        console.error('Failed to send welcome email:', error);
      }

      setSuccess(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        dateOfBirth: '',
        gender: '' as 'male' | 'female' | 'other' | '',
        nationality: 'Sudanese',
        passportNumber: '',
        passportExpiry: '',
        address: '',
        city: '',
        state: '',
        country: 'Sudan',
        postalCode: '',
        clientType: '' as ClientType | '',
        bloodGroup: '',
        medicalHistory: '',
        currentMedications: '',
        allergies: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        emergencyContactRelation: '',
        previousEducation: '',
        institutionName: '',
        graduationYear: '',
        gpa: '',
        desiredProgram: '',
        desiredUniversity: '',
        status: 'active',
      });

      setTimeout(() => {
        onOpenChange(false);
        setSuccess(false);
      }, 1500);
    } catch (error) {
      setError('Failed to add client. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Register New Client</DialogTitle>
          <p className="text-sm text-muted-foreground">Complete all required fields to register a new client</p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
          {success && (
            <div className="bg-success/10 border border-success/20 rounded-lg p-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-success" />
              <p className="text-sm text-success">Client registered successfully!</p>
            </div>
          )}

          {/* Client Type Selection */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
            <Label className="text-base font-semibold flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-primary" />
              Client Type *
            </Label>
            <Select
              value={formData.clientType}
              onValueChange={(value) => setFormData({ ...formData, clientType: value as ClientType })}
              required
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select client type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="patient">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-info" />
                    <span>Medical Patient</span>
                  </div>
                </SelectItem>
                <SelectItem value="student">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-accent" />
                    <span>Student</span>
                  </div>
                </SelectItem>
                <SelectItem value="visitor">Visitor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Personal Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Personal Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name (as per passport) *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="example@email.com"
                />
              </div>
              <div>
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  placeholder="Minimum 8 characters"
                  minLength={8}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  placeholder="+249 XXX XXX XXX"
                />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  required
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender *</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => setFormData({ ...formData, gender: value as 'male' | 'female' | 'other' })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="nationality">Nationality</Label>
                <Input
                  id="nationality"
                  value={formData.nationality}
                  onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                  placeholder="Nationality"
                />
              </div>
              <div>
                <Label htmlFor="passportNumber">Passport Number *</Label>
                <Input
                  id="passportNumber"
                  value={formData.passportNumber}
                  onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value })}
                  required
                  placeholder="Enter passport number"
                />
              </div>
              <div>
                <Label htmlFor="passportExpiry">Passport Expiry Date</Label>
                <Input
                  id="passportExpiry"
                  type="date"
                  value={formData.passportExpiry}
                  onChange={(e) => setFormData({ ...formData, passportExpiry: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Address Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street address"
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="City"
                />
              </div>
              <div>
                <Label htmlFor="state">State/Province</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="State/Province"
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="Country"
                />
              </div>
              <div>
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  placeholder="Postal code"
                />
              </div>
            </div>
          </div>

          {/* Medical Information (for patients) */}
          {formData.clientType === 'patient' && (
            <div className="space-y-4 bg-info/5 border border-info/20 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-info" />
                Medical Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bloodGroup">Blood Group</Label>
                  <Select
                    value={formData.bloodGroup}
                    onValueChange={(value) => setFormData({ ...formData, bloodGroup: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="allergies">Allergies</Label>
                  <Input
                    id="allergies"
                    value={formData.allergies}
                    onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                    placeholder="List any allergies"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="medicalHistory">Medical History</Label>
                  <Textarea
                    id="medicalHistory"
                    value={formData.medicalHistory}
                    onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                    rows={3}
                    placeholder="Previous medical conditions, surgeries, etc."
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="currentMedications">Current Medications</Label>
                  <Textarea
                    id="currentMedications"
                    value={formData.currentMedications}
                    onChange={(e) => setFormData({ ...formData, currentMedications: e.target.value })}
                    rows={2}
                    placeholder="List current medications"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Academic Information (for students) */}
          {formData.clientType === 'student' && (
            <div className="space-y-4 bg-accent/5 border border-accent/20 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-accent" />
                Academic Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="previousEducation">Previous Education Level</Label>
                  <Select
                    value={formData.previousEducation}
                    onValueChange={(value) => setFormData({ ...formData, previousEducation: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select education level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high_school">High School</SelectItem>
                      <SelectItem value="diploma">Diploma</SelectItem>
                      <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                      <SelectItem value="master">Master's Degree</SelectItem>
                      <SelectItem value="phd">PhD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="graduationYear">Graduation Year</Label>
                  <Input
                    id="graduationYear"
                    type="number"
                    value={formData.graduationYear}
                    onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                    placeholder="YYYY"
                    min="1950"
                    max={new Date().getFullYear()}
                  />
                </div>
                <div>
                  <Label htmlFor="institutionName">Institution Name</Label>
                  <Input
                    id="institutionName"
                    value={formData.institutionName}
                    onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                    placeholder="Name of previous institution"
                  />
                </div>
                <div>
                  <Label htmlFor="gpa">GPA / Percentage</Label>
                  <Input
                    id="gpa"
                    type="number"
                    value={formData.gpa}
                    onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                    placeholder="GPA or percentage"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                </div>
                <div>
                  <Label htmlFor="desiredProgram">Desired Program</Label>
                  <Input
                    id="desiredProgram"
                    value={formData.desiredProgram}
                    onChange={(e) => setFormData({ ...formData, desiredProgram: e.target.value })}
                    placeholder="e.g., MBBS, Engineering, MBA"
                  />
                </div>
                <div>
                  <Label htmlFor="desiredUniversity">Desired University</Label>
                  <Input
                    id="desiredUniversity"
                    value={formData.desiredUniversity}
                    onChange={(e) => setFormData({ ...formData, desiredUniversity: e.target.value })}
                    placeholder="Preferred university name"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Emergency Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary" />
              Emergency Contact
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
                <Input
                  id="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                  placeholder="Full name"
                />
              </div>
              <div>
                <Label htmlFor="emergencyContactPhone">Emergency Contact Phone</Label>
                <Input
                  id="emergencyContactPhone"
                  value={formData.emergencyContactPhone}
                  onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                  placeholder="+249 XXX XXX XXX"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="emergencyContactRelation">Relationship</Label>
                <Input
                  id="emergencyContactRelation"
                  value={formData.emergencyContactRelation}
                  onChange={(e) => setFormData({ ...formData, emergencyContactRelation: e.target.value })}
                  placeholder="e.g., Spouse, Parent, Sibling"
                />
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div>
            <Label htmlFor="status">Account Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value as 'active' | 'inactive' })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || success} className="min-w-[120px]">
              {loading ? 'Registering...' : success ? 'Registered!' : 'Register Client'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddClientForm;
