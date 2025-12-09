import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Heart, 
  GraduationCap, 
  FileText, 
  Shield, 
  Clock, 
  Users, 
  CheckCircle2,
  ArrowRight,
  Globe,
  Phone,
  Mail,
  MapPin,
  Stethoscope,
  BookOpen,
  CreditCard,
  MessageCircle,
  BarChart3,
  Info,
  Sparkles,
  Zap,
  Lock,
  Cloud,
  Brain,
  Bell
} from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import ServiceDetailDialog from '@/components/ui/ServiceDetailDialog';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [selectedService, setSelectedService] = useState<number | null>(null);

  const handleGetStarted = () => {
    if (email) {
      // Store email in sessionStorage for pre-filling login
      sessionStorage.setItem('prefillEmail', email);
    }
    navigate('/register');
  };

  const services = [
    {
      icon: Stethoscope,
      title: 'Medical Treatment Services',
      description: 'Connect with top hospitals in India for specialized medical treatments, surgeries, and consultations.',
      detailedDescription: 'Our medical treatment services provide a comprehensive bridge between patients in Sudan and premier healthcare facilities in India. We facilitate everything from initial consultations to complex surgeries, ensuring seamless coordination throughout your medical journey. Our network includes 50+ accredited hospitals specializing in cardiology, oncology, orthopedics, neurology, and more.',
      features: [
        'Medical Reports Management',
        'Hospital Coordination',
        'Treatment Planning',
        'Radiology & Lab Services',
        'Second Opinion Consultations',
        'Post-Treatment Follow-up'
      ],
      benefits: [
        'Access to world-class medical facilities',
        'Cost-effective treatment options',
        'Expert medical coordinators',
        'Transparent pricing and estimates',
        'Multilingual support staff'
      ],
      process: [
        'Submit your medical reports and requirements',
        'Our team reviews and matches you with suitable hospitals',
        'Receive detailed treatment plan and cost estimate',
        'Get assistance with travel and accommodation',
        'Undergo treatment with continuous support',
        'Follow-up care and documentation'
      ],
      useCases: [
        'Cardiac surgeries and procedures',
        'Cancer treatment and chemotherapy',
        'Organ transplants',
        'Orthopedic surgeries',
        'Neurological treatments',
        'Cosmetic and reconstructive surgery'
      ]
    },
    {
      icon: GraduationCap,
      title: 'Academic Admissions',
      description: 'Seamless university admissions process with document verification and academic counseling.',
      detailedDescription: 'Navigate the complex world of Indian higher education with our comprehensive academic admission services. We help students from Sudan gain admission to India\'s top universities and colleges. Our services cover everything from application submission to visa processing, ensuring a smooth transition to your academic journey in India.',
      features: [
        'University Applications',
        'Certificate Verification',
        'Academic Counseling',
        'Visa Assistance',
        'Scholarship Guidance',
        'Course Selection Support'
      ],
      benefits: [
        'Access to 30+ partner universities',
        'Expert academic counselors',
        'Streamlined application process',
        'Document verification support',
        'Visa processing assistance'
      ],
      process: [
        'Submit academic credentials and desired program',
        'Our counselors match you with suitable universities',
        'Complete application with our guidance',
        'Get assistance with document verification',
        'Receive admission offer and process visa',
        'Pre-departure orientation and support'
      ],
      useCases: [
        'Undergraduate degree programs',
        'Postgraduate and master\'s programs',
        'PhD and research programs',
        'Professional courses (Engineering, Medicine, MBA)',
        'Short-term courses and certifications',
        'Exchange programs'
      ]
    },
    {
      icon: FileText,
      title: 'Document Management',
      description: 'Secure document vault with end-to-end encryption for all your medical and academic documents.',
      detailedDescription: 'Our secure document management system ensures all your sensitive medical and academic documents are safely stored, encrypted, and easily accessible. With end-to-end encryption and cloud backup, your documents are protected while being readily available when needed. The system supports automatic forwarding to institutions and real-time tracking of document status.',
      features: [
        'End-to-End Encryption',
        'Secure Cloud Storage',
        'Document Forwarding',
        'Real-time Tracking',
        'Cloud Backup',
        'Multi-format Support'
      ],
      benefits: [
        'Military-grade encryption',
        '24/7 document access',
        'Automatic backup',
        'Easy sharing with institutions',
        'Version control and history',
        'Mobile app access'
      ],
      process: [
        'Upload documents through secure portal',
        'Documents are encrypted and stored',
        'Automatic categorization and indexing',
        'Forward to relevant institutions when needed',
        'Track document status in real-time',
        'Access anytime from any device'
      ],
      useCases: [
        'Medical reports and test results',
        'Academic certificates and transcripts',
        'Passport and identification documents',
        'Visa documents',
        'Insurance papers',
        'Legal documents'
      ]
    },
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'Multiple payment options including Mobile Money, Bank Cards, and Bank Transfers.',
      detailedDescription: 'Our secure payment gateway supports multiple payment methods tailored for clients in Sudan. Whether you prefer mobile money, bank cards, or direct bank transfers, we provide a secure and convenient payment experience. All transactions are encrypted and processed through PCI-DSS compliant systems.',
      features: [
        'Mobile Money (MTN, Zain)',
        'Bank Cards (Visa, Mastercard)',
        'Bank Transfer',
        'Secure Processing',
        'Payment History',
        'Invoice Management'
      ],
      benefits: [
        'Multiple payment options',
        'Secure transaction processing',
        'Instant payment confirmation',
        'Payment history tracking',
        'Multi-currency support',
        '24/7 payment processing'
      ],
      process: [
        'Select invoice or service to pay',
        'Choose your preferred payment method',
        'Enter payment details securely',
        'Confirm and process payment',
        'Receive instant confirmation',
        'Get receipt via email'
      ],
      useCases: [
        'Treatment cost payments',
        'University fee payments',
        'Service charges',
        'Document processing fees',
        'Consultation fees',
        'Emergency payments'
      ]
    },
    {
      icon: MessageCircle,
      title: '24/7 Support',
      description: 'Round-the-clock customer support with real-time chat and instant notifications.',
      detailedDescription: 'Our dedicated support team is available 24/7 to assist you with any questions or concerns. Whether you need help with your case, have questions about services, or require technical assistance, our multilingual support staff is ready to help via live chat, email, or phone.',
      features: [
        'Live Chat Support',
        'Email Notifications',
        'SMS Alerts',
        'Case Updates',
        'Multilingual Support',
        'Video Consultations'
      ],
      benefits: [
        '24/7 availability',
        'Multilingual support (Arabic, English, Hindi)',
        'Quick response times',
        'Multiple communication channels',
        'Expert assistance',
        'Personalized service'
      ],
      process: [
        'Contact support via your preferred channel',
        'Get connected with a support agent',
        'Receive immediate assistance',
        'Follow up on your query',
        'Get regular updates on your case',
        'Access support resources and FAQs'
      ],
      useCases: [
        'Case status inquiries',
        'Technical support',
        'Service information',
        'Emergency assistance',
        'Documentation help',
        'Payment queries'
      ]
    },
    {
      icon: BarChart3,
      title: 'Case Tracking',
      description: 'Track your case progress in real-time with step-by-step updates and timeline visualization.',
      detailedDescription: 'Stay informed about your case progress with our comprehensive tracking system. Visualize your journey from initial submission to completion with detailed timelines, progress percentages, and status updates. Know exactly what\'s happening at each stage and what comes next.',
      features: [
        'Progress Tracking',
        'Status Updates',
        'Timeline View',
        'Completion Estimates',
        'Milestone Notifications',
        'Historical Records'
      ],
      benefits: [
        'Real-time progress updates',
        'Visual timeline representation',
        'Clear milestone tracking',
        'Estimated completion dates',
        'Historical case records',
        'Mobile notifications'
      ],
      process: [
        'Case is created and assigned',
        'Track initial review and processing',
        'Monitor document verification',
        'Follow institution coordination',
        'Track treatment/admission progress',
        'Receive completion notification'
      ],
      useCases: [
        'Medical treatment cases',
        'University admission cases',
        'Document processing cases',
        'Visa application cases',
        'Consultation cases',
        'Follow-up cases'
      ]
    }
  ];

  const stats = [
    { value: '500+', label: 'Successful Cases', icon: CheckCircle2 },
    { value: '50+', label: 'Partner Hospitals', icon: Building2 },
    { value: '30+', label: 'Partner Universities', icon: GraduationCap },
    { value: '24/7', label: 'Support Available', icon: Clock }
  ];

  const features = [
    'End-to-End Encryption',
    'AI-Powered Processing',
    'Real-time Notifications',
    'Multi-language Support',
    'Mobile Responsive',
    'Secure Cloud Storage'
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Logo size="md" clickable={true} textClassName="text-foreground" />
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/login')}
                className="hidden sm:flex"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => navigate('/register')}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Create Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20 sm:py-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23000000%22%20fill-opacity%3D%220.02%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50"></div>
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/80 px-4 py-2 text-sm backdrop-blur-sm">
              <Globe className="h-4 w-4 text-primary" />
              <span>Connecting Sudan to India's Best Healthcare & Education</span>
            </div>
            
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/80 px-4 py-2 text-sm backdrop-blur-sm animate-fade-in">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span>An Intelligent Platform for Medical & Educational Services</span>
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl animate-slide-up">
              Your Gateway to{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Quality Healthcare
              </span>
              {' '}&{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Education
              </span>
            </h1>
            
            <p className="mb-8 text-lg text-muted-foreground sm:text-xl md:text-2xl animate-slide-up delay-100">
              SudInd Smart Portal connects patients, students, and visitors from Sudan to India's premier hospitals and universities. 
              Experience seamless coordination, secure document management, and real-time case tracking.
            </p>

            <div className="mb-8 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground animate-fade-in delay-200">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <span>Fast & Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-primary" />
                <span>End-to-End Encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <Cloud className="h-4 w-4 text-primary" />
                <span>Cloud-Based</span>
              </div>
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-primary" />
                <span>AI-Powered</span>
              </div>
            </div>

            {/* Quick Access Form */}
            <Card className="mx-auto max-w-2xl border-2">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Input
                    type="email"
                    placeholder="Enter your email to get started"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && handleGetStarted()}
                  />
                  <Button 
                    onClick={handleGetStarted}
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-4 space-y-2">
                  <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <button 
                      onClick={() => navigate('/login')}
                      className="font-medium text-primary hover:underline"
                    >
                      Sign in here
                    </button>
                  </p>
                  <p className="text-center text-xs text-muted-foreground">
                    By continuing, you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="mb-2 flex justify-center">
                  <div className="rounded-full bg-primary/10 p-3">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Who We Are
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              SudInd Smart Portal is an integrated digital platform that bridges the gap between Sudan and India, 
              facilitating seamless connections for medical treatments, academic admissions, and professional services.
            </p>
            <div className="grid gap-6 sm:grid-cols-3">
              <Card>
                <CardContent className="p-6 text-center">
                  <Building2 className="mx-auto mb-4 h-12 w-12 text-primary" />
                  <h3 className="mb-2 font-semibold">Sudan Head Office</h3>
                  <p className="text-sm text-muted-foreground">
                    Centralized administration and coordination
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="mx-auto mb-4 h-12 w-12 text-primary" />
                  <h3 className="mb-2 font-semibold">India Agents</h3>
                  <p className="text-sm text-muted-foreground">
                    Local coordinators and medical/academic experts
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Heart className="mx-auto mb-4 h-12 w-12 text-primary" />
                  <h3 className="mb-2 font-semibold">Our Clients</h3>
                  <p className="text-sm text-muted-foreground">
                    Patients, students, and visitors we serve
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-muted/50 py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Our Services
            </h2>
            <p className="text-lg text-muted-foreground">
              Comprehensive solutions for your medical and academic needs
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border-2 hover:border-primary/50"
                onClick={() => setSelectedService(index)}
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <service.icon className="h-6 w-6 text-primary" />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedService(index);
                      }}
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                  </div>
                  <h3 className="mb-2 text-xl font-semibold group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="mb-4 text-sm text-muted-foreground">{service.description}</p>
                  <ul className="space-y-2 mb-4">
                    {service.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedService(index);
                    }}
                  >
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Service Detail Dialogs */}
          {selectedService !== null && (
            <ServiceDetailDialog
              open={selectedService !== null}
              onOpenChange={(open) => !open && setSelectedService(null)}
              service={services[selectedService]}
            />
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Why Choose SudInd?
            </h2>
            <p className="text-lg text-muted-foreground">
              Advanced features for a seamless experience
            </p>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 rounded-lg border bg-card p-4">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-primary to-accent py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
              Ready to Get Started?
            </h2>
            <p className="mb-8 text-lg text-primary-foreground/90">
              Join hundreds of satisfied clients who trust SudInd for their medical and academic needs.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button 
                size="lg"
                variant="secondary"
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto"
              >
                Sign In to Your Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto bg-background/10 border-primary-foreground/20 text-primary-foreground hover:bg-background/20"
              >
                Create New Account
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <Logo size="md" textClassName="text-foreground" />
              <p className="mt-4 text-sm text-muted-foreground">
                Connecting Sudan to India's best healthcare and education services.
              </p>
            </div>
            
            <div>
              <h3 className="mb-4 font-semibold">Services</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Medical Treatment</li>
                <li>Academic Admissions</li>
                <li>Document Management</li>
                <li>Payment Processing</li>
              </ul>
            </div>
            
            <div>
              <h3 className="mb-4 font-semibold">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>About Us</li>
                <li>Our Partners</li>
                <li>Success Stories</li>
                <li>Contact Us</li>
              </ul>
            </div>
            
            <div>
              <h3 className="mb-4 font-semibold">Contact</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  support@sudind.com
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  +249 XXX XXX XXX
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Khartoum, Sudan
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} SudInd Smart Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

