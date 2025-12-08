import React, { useState } from 'react';
import { Building, GraduationCap, CheckCircle2, Clock, X, Search, Link2 } from 'lucide-react';
import { hospitals, universities } from '@/lib/mockData';
import { cn } from '@/lib/utils';

const AdminIntegrations: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'hospitals' | 'universities'>('hospitals');

  const filteredHospitals = hospitals.filter(h =>
    h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUniversities = universities.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    if (status === 'connected') {
      return (
        <span className="flex items-center gap-1 status-badge bg-success/15 text-success">
          <CheckCircle2 className="w-3 h-3" />
          Connected
        </span>
      );
    } else if (status === 'pending') {
      return (
        <span className="flex items-center gap-1 status-badge bg-warning/15 text-warning">
          <Clock className="w-3 h-3" />
          Pending
        </span>
      );
    } else {
      return (
        <span className="flex items-center gap-1 status-badge bg-destructive/15 text-destructive">
          <X className="w-3 h-3" />
          Disconnected
        </span>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Hospital & University Integrations</h2>
        <p className="text-muted-foreground">
          Manage API integrations with medical and educational institutions in India
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-info/10">
              <Building className="w-5 h-5 text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{hospitals.length}</p>
              <p className="text-sm text-muted-foreground">Hospitals</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <GraduationCap className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{universities.length}</p>
              <p className="text-sm text-muted-foreground">Universities</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <Link2 className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {hospitals.filter(h => h.integrationStatus === 'connected').length + 
                 universities.filter(u => u.integrationStatus === 'connected').length}
              </p>
              <p className="text-sm text-muted-foreground">Connected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('hospitals')}
            className={cn(
              'pb-3 text-sm font-medium transition-colors relative',
              activeTab === 'hospitals'
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Hospitals ({hospitals.length})
            {activeTab === 'hospitals' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('universities')}
            className={cn(
              'pb-3 text-sm font-medium transition-colors relative',
              activeTab === 'universities'
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Universities ({universities.length})
            {activeTab === 'universities' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder={`Search ${activeTab}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {/* Hospitals List */}
      {activeTab === 'hospitals' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredHospitals.map((hospital) => (
            <div
              key={hospital.id}
              className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-info/10">
                    <Building className="w-5 h-5 text-info" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{hospital.name}</h3>
                    <p className="text-sm text-muted-foreground">{hospital.city}, {hospital.country}</p>
                  </div>
                </div>
                {getStatusBadge(hospital.integrationStatus)}
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Specialties</p>
                  <div className="flex flex-wrap gap-1">
                    {hospital.specialties.map((spec, idx) => (
                      <span key={idx} className="text-xs bg-muted px-2 py-1 rounded">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-foreground">Rating:</span>
                    <span className="text-sm text-warning">{'★'.repeat(Math.floor(hospital.rating))}</span>
                    <span className="text-sm text-muted-foreground">({hospital.rating})</span>
                  </div>
                  <button className="text-sm text-primary hover:underline">
                    Manage API
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Universities List */}
      {activeTab === 'universities' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredUniversities.map((university) => (
            <div
              key={university.id}
              className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <GraduationCap className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{university.name}</h3>
                    <p className="text-sm text-muted-foreground">{university.city}, {university.country}</p>
                  </div>
                </div>
                {getStatusBadge(university.integrationStatus)}
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Programs</p>
                  <div className="flex flex-wrap gap-1">
                    {university.programs.map((prog, idx) => (
                      <span key={idx} className="text-xs bg-muted px-2 py-1 rounded">
                        {prog}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-foreground">Rating:</span>
                    <span className="text-sm text-warning">{'★'.repeat(Math.floor(university.rating))}</span>
                    <span className="text-sm text-muted-foreground">({university.rating})</span>
                  </div>
                  <button className="text-sm text-primary hover:underline">
                    Manage API
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminIntegrations;

