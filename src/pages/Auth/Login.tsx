// src/pages/Auth/Login.tsx

import React, { useState, useEffect } from 'react'; // ⭐ 1. Import useEffect
import { Navigate, Link, useNavigate } from 'react-router-dom'; // ⭐ 2. Import useNavigate
import { useAuth } from '../../contexts/AuthContext';
import { Building2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, userProfile } = useAuth();
  const navigate = useNavigate(); // ⭐ 3. Initialize the navigate function

  // ⭐ 4. THE FIX: Relocated redirection logic into a useEffect hook.
  // This hook will now only run when `userProfile` or `Maps` changes.
  useEffect(() => {
    if (userProfile) {
      console.log("Login Component: UserProfile detected, attempting redirection via useEffect.");
      console.log("Login Component: User Role for redirection:", userProfile.role);
      
      const targetPath = userProfile.role === 'super_admin' ? '/super-admin' : '/community-admin';
      navigate(targetPath, { replace: true }); // Use the navigate function for redirection
    }
  }, [userProfile, navigate]); // The dependency array prevents the loop

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      // After a successful login, AuthContext updates `userProfile`.
      // This change in `userProfile` will trigger the useEffect above,
      // causing the redirection to happen correctly and only once.
      console.log("Login Component: Login attempt successful.");
    } catch (err) {
      console.error("Login Component: Login error:", err);
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ⭐ 5. If a user is already logged in, render nothing or a loading spinner
  // while the useEffect handles the redirection. This prevents the login form
  // from briefly flashing on the screen for an already authenticated user.
  if (userProfile) {
    return null; // Or <p>Redirecting...</p>
  }

  // The rest of your JSX remains the same...
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-white rounded-lg flex items-center justify-center">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Sign in to SocietyPay
          </h2>
          <p className="mt-2 text-sm text-gray-200">
            Maintenance Management System
          </p>
        </div>
        
        <form className="mt-8 space-y-6 bg-white rounded-lg shadow-xl p-8" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-secondary focus:border-secondary focus:z-10 sm:text-sm"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-secondary focus:border-secondary focus:z-10 sm:text-sm"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-secondary hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
            
            <p className="mt-4 text-center text-sm text-gray-600">
              New community?{' '}
              <Link to="/signup" className="text-secondary hover:text-secondary/80 font-medium">
                Register here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}