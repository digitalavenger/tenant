import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';
import { Building2, Check, Crown, Star, Zap } from 'lucide-react';
import { subscriptionService } from '../../services/firebase';
import { Subscription } from '../../types';

export default function CommunitySignup() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [selectedSubscription, setSelectedSubscription] = useState<string>('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Community Details
    communityName: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    totalBlocks: '',
    totalFlats: '',
    
    // Admin Details
    adminName: '',
    adminEmail: '',
    adminPhone: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const subs = await subscriptionService.getActiveSubscriptions();
      setSubscriptions(subs);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.communityName || !formData.address || !formData.city || !formData.state || !formData.pincode) {
      setError('Please fill all community details');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.adminName || !formData.adminEmail || !formData.adminPhone || !formData.password) {
      setError('Please fill all admin details');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setError('');
    setStep(3);
  };

  const handleFinalSubmit = async () => {
    if (!selectedSubscription) {
      setError('Please select a subscription plan');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.adminEmail,
        formData.password
      );
      const user = userCredential.user;

      // Create community document
      const communityId = `community_${Date.now()}`;
      await setDoc(doc(db, 'communities', communityId), {
        name: formData.communityName,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        adminId: user.uid,
        subscriptionId: selectedSubscription,
        isActive: false, // Will be activated after payment
        totalTenants: 0,
        totalBlocks: parseInt(formData.totalBlocks) || 0,
        settings: {
          paymentGateway: {
            razorpayKeyId: '',
            razorpayKeySecret: ''
          },
          whatsapp: {
            apiKey: '',
            phoneNumberId: '',
            templateId: ''
          },
          charges: {
            gstEnabled: true,
            gstPercentage: 18,
            handlingCharges: 50
          }
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Create user profile
      await setDoc(doc(db, 'users', user.uid), {
        email: formData.adminEmail,
        name: formData.adminName,
        phone: formData.adminPhone,
        role: 'community_admin',
        communityId: communityId,
        isActive: false, // Will be activated after payment
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Redirect to success page
      navigate('/signup-success', { 
        state: { 
          communityId: communityId, 
          subscriptionId: selectedSubscription,
          adminEmail: formData.adminEmail
        } 
      });

    } catch (error: any) {
      console.error('Error creating community:', error);
      setError(error.message || 'Failed to create community. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getSubscriptionIcon = (planName: string) => {
    if (planName.toLowerCase().includes('basic')) return Building2;
    if (planName.toLowerCase().includes('premium')) return Star;
    if (planName.toLowerCase().includes('enterprise')) return Crown;
    return Zap;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-white rounded-lg flex items-center justify-center">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Register Your Community
          </h2>
          <p className="mt-2 text-sm text-gray-200">
            Join SocietyPay and streamline your maintenance management
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber 
                    ? 'bg-white text-primary' 
                    : 'bg-primary-light text-gray-300'
                }`}>
                  {step > stepNumber ? <Check className="h-4 w-4" /> : stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-12 h-1 mx-2 ${
                    step > stepNumber ? 'bg-white' : 'bg-primary-light'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm mb-6">
              {error}
            </div>
          )}

          {/* Step 1: Community Details */}
          {step === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Community Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Community Name *
                    </label>
                    <input
                      type="text"
                      name="communityName"
                      required
                      value={formData.communityName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
                      placeholder="e.g., Green Valley Apartments"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
                      placeholder="Complete address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <select
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
                    >
                      <option value="">Select State</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="West Bengal">West Bengal</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      required
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
                      pattern="[0-9]{6}"
                      placeholder="6-digit pincode"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Blocks (Optional)
                    </label>
                    <input
                      type="number"
                      name="totalBlocks"
                      value={formData.totalBlocks}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
                      min="1"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-secondary text-white px-4 py-2 rounded-md hover:bg-secondary/90 font-medium"
              >
                Continue to Admin Details
              </button>
            </form>
          )}

          {/* Step 2: Admin Details */}
          {step === 2 && (
            <form onSubmit={handleStep2Submit} className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Admin Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Admin Name *
                    </label>
                    <input
                      type="text"
                      name="adminName"
                      required
                      value={formData.adminName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="adminEmail"
                      required
                      value={formData.adminEmail}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="adminPhone"
                      required
                      value={formData.adminPhone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password *
                    </label>
                    <input
                      type="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
                      minLength={6}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
                      minLength={6}
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 font-medium"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-secondary text-white px-4 py-2 rounded-md hover:bg-secondary/90 font-medium"
                >
                  Continue to Subscription
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Subscription Selection */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Choose Your Plan</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {subscriptions.map((subscription) => {
                    const Icon = getSubscriptionIcon(subscription.name);
                    return (
                      <div
                        key={subscription.id}
                        className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                          selectedSubscription === subscription.id
                            ? 'border-secondary bg-secondary/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedSubscription(subscription.id)}
                      >
                        <div className="text-center">
                          <Icon className="h-8 w-8 mx-auto mb-3 text-secondary" />
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">
                            {subscription.name}
                          </h4>
                          <p className="text-3xl font-bold text-gray-900 mb-1">
                            ₹{subscription.price.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500 mb-4">
                            per {subscription.duration} months
                          </p>
                          <p className="text-sm text-gray-600 mb-4">
                            {subscription.description}
                          </p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {subscription.features.slice(0, 3).map((feature, index) => (
                              <li key={index} className="flex items-center">
                                <Check className="h-4 w-4 text-secondary mr-2" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 font-medium"
                >
                  Back
                </button>
                <button
                  onClick={handleFinalSubmit}
                  disabled={loading || !selectedSubscription}
                  className="flex-1 bg-secondary text-white px-4 py-2 rounded-md hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {loading ? 'Creating Community...' : 'Complete Registration'}
                </button>
              </div>
            </div>
          )}

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-secondary hover:text-secondary/80 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}