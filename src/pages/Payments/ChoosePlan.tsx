// src/pages/Payments/ChoosePlan.tsx (Fixed Version)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { subscriptionService } from '../../services/firebase';
import { updateDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Subscription } from '../../types';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function ChoosePlan() {
  const { userProfile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubscriptions = async () => {
      if (!userProfile) {
        setError("User profile not found. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching subscriptions...');
        const subs = await subscriptionService.getActiveSubscriptions();
        console.log('Fetched subscriptions:', subs);
        
        if (!subs || subs.length === 0) {
          setError("No subscription plans available at the moment.");
        } else {
          setSubscriptions(subs);
        }
      } catch (err) {
        console.error("Error fetching subscriptions:", err);
        
        // More specific error handling
        if (err instanceof Error) {
          setError(`Failed to load subscription plans: ${err.message}`);
        } else {
          setError("Could not load subscription plans. Please check your internet connection and try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [userProfile]);

  // Retry function for failed subscription loading
  const retryFetchSubscriptions = async () => {
    setLoading(true);
    setError('');
    
    try {
      const subs = await subscriptionService.getActiveSubscriptions();
      if (!subs || subs.length === 0) {
        setError("No subscription plans available at the moment.");
      } else {
        setSubscriptions(subs);
      }
    } catch (err) {
      console.error("Error fetching subscriptions:", err);
      setError("Could not load subscription plans. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (subscription: Subscription) => {
    const res = await loadRazorpayScript();
    if (!res) {
      setError("Razorpay SDK failed to load. Are you online?");
      return;
    }

    if (!userProfile || !userProfile.communityId) {
      setError("User profile or Community ID not found. Please log in again.");
      return;
    }

    const options = {
      key: 'YOUR_RAZORPAY_KEY_ID', // Replace with your actual Razorpay Key ID
      amount: subscription.price * 100,
      currency: "INR",
      name: "SocietyPay Subscription",
      description: `Payment for ${subscription.name}`,
      handler: async function (response: any) {
        try {
          // ⭐ FIX: Calculate the subscription end date
          const now = new Date();
          const endDate = new Date(now.setMonth(now.getMonth() + subscription.duration));

          // Step 1: Update the community document with the end date
          const communityRef = doc(db, 'communities', userProfile.communityId!);
          await updateDoc(communityRef, {
            subscriptionId: subscription.id,
            isActive: true,
            subscriptionEndDate: endDate, // Save the end date
            updatedAt: new Date(),
          });

          // Step 2: Update the user to be active
          const userRef = doc(db, 'users', userProfile.id);
          await updateDoc(userRef, {
            isActive: true,
            updatedAt: new Date(),
          });

          // Step 3: Save payment record
          await setDoc(doc(db, 'payments', response.razorpay_payment_id), {
            userId: userProfile.id,
            communityId: userProfile.communityId,
            subscriptionId: subscription.id,
            amount: subscription.price,
            status: 'success',
            razorpayPaymentId: response.razorpay_payment_id,
            createdAt: new Date(),
          });
          
          // Step 4: Refresh the user's profile state
          await refreshProfile();
          
          // Step 5: Redirect to the admin dashboard
          navigate('/admin');

        } catch (err) {
          console.error("Failed to update documents after payment:", err);
          setError("Payment was successful, but we failed to activate your account. Please contact support.");
        }
      },
      prefill: {
        name: userProfile.name,
        email: userProfile.email,
        contact: userProfile.phone,
      },
      notes: {
        communityId: userProfile.communityId,
        userId: userProfile.id,
      },
      theme: {
        color: "#16a34a",
      },
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading subscription plans...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="text-center p-8 max-w-md mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Plans</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={retryFetchSubscriptions}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
          <button
            onClick={() => navigate('/admin')}
            className="text-gray-600 hover:text-gray-800 underline"
          >
            Go back to dashboard
          </button>
        </div>
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="text-center p-8 max-w-md mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-4">
            <h2 className="text-lg font-semibold text-yellow-800 mb-2">No Plans Available</h2>
            <p className="text-yellow-600 mb-4">No subscription plans are currently available.</p>
            <button
              onClick={retryFetchSubscriptions}
              className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors"
            >
              Refresh Plans
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-2 text-center">Choose Your Subscription Plan</h1>
        <p className="text-gray-600 mb-8 text-center">Your account is created. Select a plan to activate your community.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {subscriptions.map((sub) => (
            <div key={sub.id} className="border p-6 rounded-lg shadow-lg flex flex-col">
              <h2 className="text-2xl font-semibold mb-2">{sub.name}</h2>
              <p className="text-4xl font-bold mb-4">₹{sub.price}</p>
              <p className="text-gray-600 mb-4 flex-grow">{sub.description}</p>
              <ul className="mb-6 space-y-2">
                {sub.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => handlePayment(sub)}
                className="w-full mt-auto bg-secondary text-white py-2 rounded-md hover:bg-secondary/90 transition-colors"
              >
                Choose Plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}