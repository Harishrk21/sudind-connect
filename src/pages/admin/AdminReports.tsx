import React from 'react';
import { FileText, Download, BarChart3, PieChart, TrendingUp, Calendar } from 'lucide-react';
import { cases, invoices, users } from '@/lib/mockData';
import { cn } from '@/lib/utils';

const AdminReports: React.FC = () => {
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
        <h3 className="font-semibold text-foreground mb-4">Available Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((report, index) => (
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
                  <span className="inline-block mt-2 text-xs bg-muted px-2 py-1 rounded">
                    {report.type}
                  </span>
                </div>
              </div>
              <button className="p-2 rounded-lg hover:bg-muted transition-colors">
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
