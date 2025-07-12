import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Login from './pages/Auth/Login';
import SuperAdminDashboard from './pages/SuperAdmin/Dashboard';
import CommunityAdminDashboard from './pages/CommunityAdmin/Dashboard';
import { useAuth } from './contexts/AuthContext';

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
  const { userProfile } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route path="/super-admin" element={
        <ProtectedRoute requiredRole="super_admin">
          <AppLayout>
            <SuperAdminDashboard />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin" element={
        <ProtectedRoute requiredRole="community_admin">
          <AppLayout>
            <CommunityAdminDashboard />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/" element={
        <Navigate to={
          userProfile?.role === 'super_admin' ? '/super-admin' : 
          userProfile?.role === 'community_admin' ? '/admin' : 
          '/login'
        } replace />
      } />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;