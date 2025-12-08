import React from 'react';
import { User, Mail, Phone, MapPin, Shield, Bell, Globe } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Settings: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Profile Section */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="font-semibold text-foreground mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Profile Information
        </h3>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
            {user.name.charAt(0)}
          </div>
          <div>
            <h4 className="text-lg font-semibold text-foreground">{user.name}</h4>
            <p className="text-muted-foreground capitalize">{user.role}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">Full Name</label>
            <input
              type="text"
              defaultValue={user.name}
              className="input-field mt-1"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground flex items-center gap-2">
              <Mail className="w-4 h-4" /> Email
            </label>
            <input
              type="email"
              defaultValue={user.email}
              className="input-field mt-1"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground flex items-center gap-2">
              <Phone className="w-4 h-4" /> Phone
            </label>
            <input
              type="tel"
              defaultValue={user.phone}
              className="input-field mt-1"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Country
            </label>
            <input
              type="text"
              defaultValue={user.country}
              className="input-field mt-1"
            />
          </div>
        </div>

        <button className="btn-primary mt-6">Save Changes</button>
      </div>

      {/* Security Section */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="font-semibold text-foreground mb-6 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Security
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">Current Password</label>
            <input
              type="password"
              placeholder="Enter current password"
              className="input-field mt-1"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              className="input-field mt-1"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Confirm New Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              className="input-field mt-1"
            />
          </div>
        </div>

        <button className="btn-secondary mt-6">Update Password</button>
      </div>

      {/* Notifications Section */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="font-semibold text-foreground mb-6 flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          Notifications
        </h3>
        
        <div className="space-y-4">
          {[
            { label: 'Email notifications', description: 'Receive updates via email' },
            { label: 'SMS notifications', description: 'Receive updates via SMS' },
            { label: 'Case status updates', description: 'Get notified when case status changes' },
            { label: 'Payment reminders', description: 'Receive payment due reminders' },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-foreground">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Language Section */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="font-semibold text-foreground mb-6 flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary" />
          Language & Region
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">Language</label>
            <select className="input-field mt-1">
              <option>English</option>
              <option>Arabic</option>
              <option>Hindi</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Timezone</label>
            <select className="input-field mt-1">
              <option>Africa/Khartoum (UTC+2)</option>
              <option>Asia/Kolkata (UTC+5:30)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
