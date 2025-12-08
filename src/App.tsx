import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Layout
import DashboardLayout from "@/components/layout/DashboardLayout";

// Pages
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import Settings from "@/pages/Settings";

// Admin pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminCases from "@/pages/admin/AdminCases";
import AdminCaseDetail from "@/pages/admin/AdminCaseDetail";
import AdminClients from "@/pages/admin/AdminClients";
import AdminAgents from "@/pages/admin/AdminAgents";
import AdminFinancials from "@/pages/admin/AdminFinancials";
import AdminReports from "@/pages/admin/AdminReports";
import AdminMessages from "@/pages/admin/AdminMessages";

// Agent pages
import AgentDashboard from "@/pages/agent/AgentDashboard";
import AgentCases from "@/pages/agent/AgentCases";
import AgentUpload from "@/pages/agent/AgentUpload";

// Client pages
import ClientDashboard from "@/pages/client/ClientDashboard";
import ClientCases from "@/pages/client/ClientCases";
import ClientPayments from "@/pages/client/ClientPayments";

const queryClient = new QueryClient();

// Protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({ 
  children, 
  allowedRoles 
}) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}`} replace />;
  }
  
  return <>{children}</>;
};

// Redirect based on role
const RoleRedirect: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <Navigate to={`/${user?.role}`} replace />;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={isAuthenticated ? <RoleRedirect /> : <Login />} />
      
      {/* Root redirect */}
      <Route path="/" element={<RoleRedirect />} />
      
      {/* Admin routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="cases" element={<AdminCases />} />
        <Route path="cases/:caseId" element={<AdminCaseDetail />} />
        <Route path="clients" element={<AdminClients />} />
        <Route path="clients/:clientId" element={<div>Client Profile</div>} />
        <Route path="agents" element={<AdminAgents />} />
        <Route path="agents/:agentId" element={<div>Agent Profile</div>} />
        <Route path="financials" element={<AdminFinancials />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="messages" element={<AdminMessages />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      
      {/* Agent routes */}
      <Route path="/agent" element={
        <ProtectedRoute allowedRoles={['agent']}>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<AgentDashboard />} />
        <Route path="cases" element={<AgentCases />} />
        <Route path="cases/:caseId" element={<AdminCaseDetail />} />
        <Route path="upload" element={<AgentUpload />} />
        <Route path="messages" element={<AdminMessages />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      
      {/* Client routes */}
      <Route path="/client" element={
        <ProtectedRoute allowedRoles={['client']}>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<ClientDashboard />} />
        <Route path="cases" element={<ClientCases />} />
        <Route path="cases/:caseId" element={<AdminCaseDetail />} />
        <Route path="upload" element={<AgentUpload />} />
        <Route path="payments" element={<ClientPayments />} />
        <Route path="messages" element={<AdminMessages />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      
      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
