import React, { useState } from 'react';
import { FileText, Download, BarChart3, PieChart, TrendingUp, Calendar, Filter } from 'lucide-react';
import { useDataStore } from '@/contexts/DataStore';
import { cn, downloadDemoFile, ReportData } from '@/lib/utils';

const AdminReports: React.FC = () => {
  const { cases, invoices, users } = useDataStore();
  const [reportPeriod, setReportPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [reportType, setReportType] = useState<'administrative' | 'financial' | 'all'>('all');

  // Calculate stats
  const totalCases = cases.length;
  const medicalCases = cases.filter(c => c.type === 'medical').length;
  const academicCases = cases.filter(c => c.type === 'academic').length;
  const completedCases = cases.filter(c => c.status === 'completed').length;
  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);

  const statusDistribution = [
    { status: 'New', count: cases.filter(c => c.status === 'new').length, color: 'bg-info' },
    { status: 'Review', count: cases.filter(c => c.status === 'review').length, color: 'bg-warning' },
    { status: 'Pending', count: cases.filter(c => c.status === 'pending').length, color: 'bg-warning' },
    { status: 'Approved', count: cases.filter(c => c.status === 'approved').length, color: 'bg-success' },
    { status: 'In Progress', count: cases.filter(c => ['under_treatment', 'under_admission'].includes(c.status)).length, color: 'bg-accent' },
    { status: 'Completed', count: completedCases, color: 'bg-success' },
  ];

  const reports = [
    {
      title: 'Monthly Summary Report',
      description: 'Overview of cases, revenue, and key metrics for the current month',
      icon: BarChart3,
      type: 'PDF',
    },
    {
      title: 'Case Status Report',
      description: 'Detailed breakdown of all cases by status and type',
      icon: PieChart,
      type: 'Excel',
    },
    {
      title: 'Financial Report',
      description: 'Revenue, payments, and outstanding invoices summary',
      icon: TrendingUp,
      type: 'PDF',
    },
    {
      title: 'Agent Performance Report',
      description: 'Case completion rates and metrics by agent',
      icon: FileText,
      type: 'Excel',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Report Filters */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-foreground mb-1">Reports & Analytics</h2>
            <p className="text-sm text-muted-foreground">Generate administrative and financial reports</p>
          </div>
          <div className="flex gap-3">
            <select
              value={reportPeriod}
              onChange={(e) => setReportPeriod(e.target.value as typeof reportPeriod)}
              className="input-field w-auto min-w-[120px]"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as typeof reportType)}
              className="input-field w-auto min-w-[150px]"
            >
              <option value="all">All Reports</option>
              <option value="administrative">Administrative</option>
              <option value="financial">Financial</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Total Cases</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{totalCases}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {medicalCases} medical, {academicCases} academic
          </p>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-success/10">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Total Revenue</span>
          </div>
          <p className="text-3xl font-bold text-foreground">${totalRevenue.toLocaleString()}</p>
          <p className="text-sm text-success mt-1">+15% from last month</p>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-accent/10">
              <PieChart className="w-5 h-5 text-accent" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Completion Rate</span>
          </div>
          <p className="text-3xl font-bold text-foreground">
            {Math.round((completedCases / totalCases) * 100)}%
          </p>
          <p className="text-sm text-muted-foreground mt-1">{completedCases} completed</p>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-warning/10">
              <Calendar className="w-5 h-5 text-warning" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Active Clients</span>
          </div>
          <p className="text-3xl font-bold text-foreground">
            {users.filter(u => u.role === 'client' && u.status === 'active').length}
          </p>
          <p className="text-sm text-muted-foreground mt-1">Registered this month</p>
        </div>
      </div>

      {/* Case Status Distribution */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="font-semibold text-foreground mb-6">Case Status Distribution</h3>
        <div className="space-y-4">
          {statusDistribution.map((item) => (
            <div key={item.status} className="flex items-center gap-4">
              <div className="w-24 text-sm text-muted-foreground">{item.status}</div>
              <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all', item.color)}
                  style={{ width: `${(item.count / totalCases) * 100}%` }}
                />
              </div>
              <div className="w-12 text-right text-sm font-medium text-foreground">{item.count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Available Reports */}
      <div>
        <h3 className="font-semibold text-foreground mb-4">
          Available Reports - {reportPeriod.charAt(0).toUpperCase() + reportPeriod.slice(1)} View
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports
            .filter(report => {
              if (reportType === 'all') return true;
              if (reportType === 'administrative') {
                return report.title.includes('Summary') || report.title.includes('Status') || report.title.includes('Performance');
              }
              if (reportType === 'financial') {
                return report.title.includes('Financial');
              }
              return true;
            })
            .map((report, index) => (
            <div
              key={index}
              className="bg-card rounded-xl border border-border p-5 flex items-start justify-between hover:shadow-md transition-all cursor-pointer hover:border-primary/30"
            >
              <div className="flex gap-4">
                <div className="p-3 rounded-xl bg-muted">
                  <report.icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">{report.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{report.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs bg-muted px-2 py-1 rounded">
                      {report.type}
                    </span>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      {reportPeriod}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                onClick={() => {
                  const reportData: ReportData = {
                    title: report.title,
                    type: report.type,
                    period: reportPeriod,
                    data: {
                      'Total Cases': totalCases,
                      'Medical Cases': medicalCases,
                      'Academic Cases': academicCases,
                      'Completed Cases': completedCases,
                      'Total Revenue': `$${totalRevenue.toLocaleString()}`,
                      'Completion Rate': `${Math.round((completedCases / totalCases) * 100)}%`,
                    }
                  };
                  downloadDemoFile(
                    `${report.title.replace(/\s+/g, '-').toLowerCase()}.pdf`,
                    'report',
                    reportData
                  );
                }}
                title={`Download ${report.title}`}
              >
                <Download className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
