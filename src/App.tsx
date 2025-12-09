import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { DataStoreProvider } from "@/contexts/DataStore";

// Layout
import DashboardLayout from "@/components/layout/DashboardLayout";

// Pages
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "@/pages/NotFound";
import Settings from "@/pages/Settings";

// Admin pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminCases from "@/pages/admin/AdminCases";
import AdminCaseDetail from "@/pages/admin/AdminCaseDetail";
import AdminClients from "@/pages/admin/AdminClients";
import ClientProfile from "@/pages/admin/ClientProfile";
import AdminAgents from "@/pages/admin/AdminAgents";
import AgentProfile from "@/pages/admin/AgentProfile";
import AdminContracts from "@/pages/admin/AdminContracts";
import ContractDetails from "@/pages/admin/ContractDetails";
import AdminFinancials from "@/pages/admin/AdminFinancials";
import AdminAIProcessing from "@/pages/admin/AdminAIProcessing";
import AdminIntegrations from "@/pages/admin/AdminIntegrations";
import AdminReports from "@/pages/admin/AdminReports";
import AdminAuditLog from "@/pages/admin/AdminAuditLog";
import AdminMessages from "@/pages/admin/AdminMessages";

// Agent pages
import AgentDashboard from "@/pages/agent/AgentDashboard";
import AgentCases from "@/pages/agent/AgentCases";
import AgentUpload from "@/pages/agent/AgentUpload";
import AgentCostEstimate from "@/pages/agent/AgentCostEstimate";

// Client pages
import ClientDashboard from "@/pages/client/ClientDashboard";
import ClientCases from "@/pages/client/ClientCases";
import ClientPayments from "@/pages/client/ClientPayments";
import ClientPaymentGateway from "@/pages/client/ClientPaymentGateway";
import ClientUpload from "@/pages/client/ClientUpload";
import ClientChat from "@/pages/client/ClientChat";
import ClientBooking from "@/pages/client/ClientBooking";

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

// Root route handler - show landing page for unauthenticated, redirect authenticated users
const RootRoute: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  
  if (isAuthenticated && user) {
    return <Navigate to={`/${user.role}`} replace />;
  }
  
  return <Landing />;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<RootRoute />} />
      <Route path="/login" element={isAuthenticated ? <RoleRedirect /> : <Login />} />
      <Route path="/register" element={isAuthenticated ? <RoleRedirect /> : <Register />} />
      
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
        <Route path="clients/:clientId" element={<ClientProfile />} />
        <Route path="agents" element={<AdminAgents />} />
        <Route path="agents/:agentId" element={<AgentProfile />} />
        <Route path="contracts" element={<AdminContracts />} />
        <Route path="contracts/:contractId" element={<ContractDetails />} />
        <Route path="financials" element={<AdminFinancials />} />
        <Route path="ai-processing" element={<AdminAIProcessing />} />
        <Route path="integrations" element={<AdminIntegrations />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="audit-log" element={<AdminAuditLog />} />
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
        <Route path="cost-estimate" element={<AgentCostEstimate />} />
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
        <Route path="upload" element={<ClientUpload />} />
        <Route path="payments" element={<ClientPayments />} />
        <Route path="payment-gateway" element={<ClientPaymentGateway />} />
        <Route path="chat" element={<ClientChat />} />
        <Route path="booking" element={<ClientBooking />} />
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
          <DataStoreProvider>
            <AppRoutes />
          </DataStoreProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
