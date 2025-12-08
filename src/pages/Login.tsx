import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useDataStore } from '@/contexts/DataStore';
import { Building2, Mail, Lock, Eye, EyeOff, AlertCircle, Users, UserCheck, User } from 'lucide-react';
import { users as staticUsers, UserRole } from '@/lib/mockData';
import { cn } from '@/lib/utils';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { users: dataStoreUsers } = useDataStore();
  const navigate = useNavigate();
  
  // Combine static and dynamic users
  const allUsers = [...staticUsers, ...dataStoreUsers.filter(du => !staticUsers.find(su => su.id === du.id))];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        const user = allUsers.find(u => u.email === email);
        if (user) {
          navigate(`/${user.role}`);
        }
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const demoLogins = [
    { role: 'admin' as UserRole, label: 'Admin', email: 'admin@sudind.com', password: 'Admin123!', icon: Building2, color: 'bg-primary' },
    { role: 'agent' as UserRole, label: 'Agent', email: 'agent1@indigo.com', password: 'Agent123!', icon: UserCheck, color: 'bg-accent' },
    { role: 'client' as UserRole, label: 'Client', email: 'ali@gmail.com', password: 'Client123!', icon: User, color: 'bg-success' },
  ];

  const handleDemoLogin = async (demoEmail: string, demoPassword: string, role: UserRole) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    setIsLoading(true);

    try {
      const success = await login(demoEmail, demoPassword);
      if (success) {
        navigate(`/${role}`);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50"></div>
        
        <div className="relative z-10 flex flex-col justify-center p-12 text-primary-foreground">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary-foreground/20 flex items-center justify-center backdrop-blur-sm">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">SudInd Portal</h1>
              <p className="text-primary-foreground/80">Smart Healthcare & Education</p>
            </div>
          </div>
          
          <div className="space-y-6 max-w-md">
            <h2 className="text-4xl font-bold leading-tight">
              Connecting Sudan to India's Best Healthcare & Education
            </h2>
            <p className="text-lg text-primary-foreground/80">
              A unified platform for medical treatments, academic admissions, and seamless coordination between patients, students, agents, and administrators.
            </p>
            
            <div className="grid grid-cols-2 gap-4 pt-6">
              <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl font-bold">500+</div>
                <div className="text-sm text-primary-foreground/70">Successful Cases</div>
              </div>
              <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl font-bold">50+</div>
                <div className="text-sm text-primary-foreground/70">Partner Hospitals</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 animate-slide-up">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">SudInd Portal</h1>
              <p className="text-xs text-muted-foreground">Smart Healthcare & Education</p>
            </div>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
            <p className="text-muted-foreground mt-2">Sign in to access your portal</p>
          </div>

          {/* Demo login buttons */}
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground text-center">Quick demo access</p>
            <div className="grid grid-cols-3 gap-3">
              {demoLogins.map((demo) => (
                <button
                  key={demo.role}
                  onClick={() => handleDemoLogin(demo.email, demo.password, demo.role)}
                  disabled={isLoading}
                  className={cn(
                    'flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-border transition-all duration-200 hover:border-primary hover:shadow-md disabled:opacity-50',
                  )}
                >
                  <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center text-primary-foreground', demo.color)}>
                    <demo.icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{demo.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-background text-muted-foreground">or continue with email</span>
            </div>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm animate-fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input-field pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Need help? Contact{' '}
            <a href="mailto:support@sudind.com" className="text-primary hover:underline">
              support@sudind.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
