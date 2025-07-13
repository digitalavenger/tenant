// src/App.tsx (Updated)

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext'; // Make sure useAuth is exported from AuthProvider file
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Login from './pages/Auth/Login';

// --- Placeholder Pages (You'll create these files in Step 2) ---
import SuperAdminDashboard from './pages/SuperAdmin/Dashboard';
import CommunitiesPage from './pages/SuperAdmin/Communities';
import PaymentsPage from './pages/SuperAdmin/Payments';
import SettingsPage from './pages/SuperAdmin/Settings';


// This is your main layout for authenticated users
function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64"> {/* This div wraps the content to the right of the sidebar */}
        <Header />
        <main>
          {/* The Outlet component renders the active child route */}
          <Outlet /> 
        </main>
      </div>
    </div>
  );
}

function AppRoutes() {
  const { userProfile } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      {/* ... other public routes like /signup ... */}

      {/* --- Super Admin Protected Routes --- */}
      <Route 
        path="/super-admin"
        element={
          <ProtectedRoute requiredRole="super_admin">
            <AppLayout />
          </ProtectedRoute>
        }
      >
        {/* The "index" route is the default page for "/super-admin" */}
        <Route index element={<SuperAdminDashboard />} />
        <Route path="communities" element={<CommunitiesPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        {/* Add other super admin routes here */}
      </Route>

      {/* You would create a similar structure for community_admin */}
      {/* <Route path="/admin" element={...}> ... </Route> */}

      {/* Fallback route to redirect users on login */}
      <Route
        path="/"
        element={
          userProfile ? (
            <Navigate 
              to={userProfile.role === 'super_admin' ? '/super-admin' : '/admin'} 
              replace 
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
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