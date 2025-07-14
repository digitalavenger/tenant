// src/App.tsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';

import Login from './pages/Auth/Login';
import CommunitySignup from './pages/Auth/CommunitySignup';
import SignupSuccess from './pages/Auth/SignupSuccess';
import Unauthorized from './pages/Auth/Unauthorized';
import ChoosePlan from './pages/Payments/ChoosePlan';

// Super Admin
import SuperAdminDashboard from './pages/SuperAdmin/Dashboard';
import Communities from './pages/SuperAdmin/Communities';
import Subscriptions from './pages/SuperAdmin/Subscriptions';
import SuperAdminPayments from './pages/SuperAdmin/Payments';
import SuperAdminReports from './pages/SuperAdmin/Reports';
import SuperAdminSettings from './pages/SuperAdmin/Settings';

// Community Admin
import CommunityAdminDashboard from './pages/CommunityAdmin/Dashboard';
import BlocksFlats from './pages/CommunityAdmin/BlocksFlats';
import Tenants from './pages/CommunityAdmin/Tenants';
import Maintenance from './pages/CommunityAdmin/Maintenance';
import Notifications from './pages/CommunityAdmin/Notifications';
import CommunityReports from './pages/CommunityAdmin/Reports';
import Settings from './pages/CommunityAdmin/Settings';

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />
      <main>{children}</main>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<CommunitySignup />} />
      <Route path="/signup-success" element={<SignupSuccess />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Onboarding Route */}
      <Route
        path="/choose-plan"
        element={
          <ProtectedRoute requiredRole="community_admin">
            <ChoosePlan />
          </ProtectedRoute>
        }
      />

      {/* Super Admin Routes */}
      <Route path="/super-admin" element={
        <ProtectedRoute requiredRole="super_admin">
          <AppLayout><SuperAdminDashboard /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/super-admin/communities" element={
        <ProtectedRoute requiredRole="super_admin">
          <AppLayout><Communities /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/super-admin/subscriptions" element={
        <ProtectedRoute requiredRole="super_admin">
          <AppLayout><Subscriptions /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/super-admin/payments" element={
        <ProtectedRoute requiredRole="super_admin">
          <AppLayout><SuperAdminPayments /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/super-admin/reports" element={
        <ProtectedRoute requiredRole="super_admin">
          <AppLayout><SuperAdminReports /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/super-admin/settings" element={
        <ProtectedRoute requiredRole="super_admin">
          <AppLayout><SuperAdminSettings /></AppLayout>
        </ProtectedRoute>
      } />

      {/* Community Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute requiredRole="community_admin">
          <AppLayout><CommunityAdminDashboard /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/blocks" element={
        <ProtectedRoute requiredRole="community_admin">
          <AppLayout><BlocksFlats /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/tenants" element={
        <ProtectedRoute requiredRole="community_admin">
          <AppLayout><Tenants /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/maintenance" element={
        <ProtectedRoute requiredRole="community_admin">
          <AppLayout><Maintenance /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/notifications" element={
        <ProtectedRoute requiredRole="community_admin">
          <AppLayout><Notifications /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/reports" element={
        <ProtectedRoute requiredRole="community_admin">
          <AppLayout><CommunityReports /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/settings" element={
        <ProtectedRoute requiredRole="community_admin">
          <AppLayout><Settings /></AppLayout>
        </ProtectedRoute>
      } />

      {/* Default */}
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
