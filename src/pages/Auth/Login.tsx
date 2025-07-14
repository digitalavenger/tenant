// src/pages/Auth/Login.tsx (Final Version)

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Building2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn, userProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (userProfile) {
      let targetPath = '/';
      if (userProfile.role === 'super_admin') {
        targetPath = '/super-admin';
      } else if (userProfile.role === 'community_admin') {
        const now = new Date();
        const hasActiveSubscription = userProfile.subscriptionEndDate && userProfile.subscriptionEndDate.toDate() > now;
        targetPath = hasActiveSubscription ? '/admin' : '/choose-plan';
      }
      navigate(targetPath, { replace: true });
    }
  }, [userProfile, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signIn(email, password);
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  if (userProfile) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading your dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center py-12 px-4">
      {/* Login Form JSX */}
    </div>
  );
}