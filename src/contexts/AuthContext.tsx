// src/contexts/AuthContext.tsx

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback
} from 'react';
import {
  User,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'super_admin' | 'community_admin' | 'tenant';
  communityId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, phone: string, communityId: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          id: userDoc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      const profile = await fetchUserProfile(user.uid);
      setUserProfile(profile);
    }
  }, [user, fetchUserProfile]);

  const checkSubscriptionAndRedirect = useCallback(async (profile: UserProfile) => {
    if (profile.role === 'community_admin' && profile.communityId) {
      const communityDoc = await getDoc(doc(db, 'communities', profile.communityId));
      const community = communityDoc.exists() ? communityDoc.data() : null;
      const hasSubscription = community?.subscriptionId && community?.isActive;

      if (hasSubscription) {
        navigate('/admin');
      } else {
        navigate('/choose-plan');
      }
    } else if (profile.role === 'super_admin') {
      navigate('/super-admin');
    } else {
      navigate('/dashboard');
    }
  }, [navigate]);

  const signIn = useCallback(async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const profile = await fetchUserProfile(userCredential.user.uid);

    if (!profile) throw new Error('User profile not found. Please contact administrator.');
    if (!profile.isActive) throw new Error('Your account is inactive. Please contact administrator.');

    setUser(userCredential.user);
    setUserProfile(profile);
    checkSubscriptionAndRedirect(profile);
  }, [fetchUserProfile, checkSubscriptionAndRedirect]);

  const signUp = useCallback(async (email: string, password: string, name: string, phone: string, communityId: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userRef = doc(db, 'users', userCredential.user.uid);
    const now = new Date();

    const newProfile: UserProfile = {
      id: userCredential.user.uid,
      email,
      name,
      phone,
      role: 'community_admin',
      communityId,
      isActive: true,
      createdAt: now,
      updatedAt: now
    };

    await setDoc(userRef, newProfile);
    setUser(userCredential.user);
    setUserProfile(newProfile);
    navigate('/choose-plan');
  }, [navigate]);

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setUserProfile(null);
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const profile = await fetchUserProfile(user.uid);
        setUserProfile(profile);
        if (profile) {
          checkSubscriptionAndRedirect(profile);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [fetchUserProfile, checkSubscriptionAndRedirect]);

  const value = useMemo(() => ({
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut,
    refreshProfile,
  }), [user, userProfile, loading, signIn, signUp, signOut, refreshProfile]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
