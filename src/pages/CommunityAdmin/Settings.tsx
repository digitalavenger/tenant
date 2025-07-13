import React, { useState } from 'react';
import { Settings as SettingsIcon, Building2, CreditCard, MessageSquare, Bell } from 'lucide-react';
import WhatsAppConfig from '../../components/WhatsApp/WhatsAppConfig';
import MessageTemplates from '../../components/WhatsApp/MessageTemplates';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('community');
  const [communitySettings, setCommunitySettings] = useState({
    name: 'Green Valley Apartments',
    address: '123 Green Valley Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    adminName: 'Rajesh Kumar',
    adminEmail: 'admin@greenvalley.com',
    adminPhone: '+91 98765 43210',
  });

  const [paymentSettings, setPaymentSettings] = useState({
    razorpayKeyId: '',
    razorpayKeySecret: '',
    gstEnabled: true,
    gstPercentage: 18,
    handlingCharges: 50,
    paymentMethods: ['card', 'netbanking', 'upi', 'wallet'],
  });

  const [whatsappSettings, setWhatsappSettings] = useState({
    wabaNumber: '',
    apiKey: '',
    baseUrl: 'https://cpaasreseller.notify24x7.com/REST/directApi',
    autoReminders: true,
    reminderDays: [3, 1], // Days before due date
  });

  const tabs = [
    { id: 'community', label: 'Community Details', icon: Building2 },
    { id: 'payment', label: 'Payment Gateway', icon: CreditCard },
    { id: 'whatsapp', label: 'WhatsApp Settings', icon: MessageSquare },
    { id: 'templates', label: 'Message Templates', icon: Bell },
  ];

  const handleSaveCommunitySettings = () => {
    // Save community settings logic
    console.log('Saving community settings:', communitySettings);
  };

  const handleSavePaymentSettings = () => {
    // Save payment settings logic
    console.log('Saving payment settings:', paymentSettings);
  };

  const handleSaveWhatsAppSettings = (config: any) => {
    setWhatsappSettings({ ...whatsappSettings, ...config });
    console.log('Saving WhatsApp settings:', config);
  };

  return (
    <div className="p-6 ml-64">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your community and system settings</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === tab.id
                  ? 'border-secondary text-secondary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'community' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <Building2 className="h-6 w-6 text-primary mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Community Details</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Community Name
              </label>
              <input
                type="text"
                value={communitySettings.name}
                onChange={(e) => setCommunitySettings({ ...communitySettings, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                value={communitySettings.address}
                onChange={(e) => setCommunitySettings({ ...communitySettings, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                value={communitySettings.city}
                onChange={(e) => setCommunitySettings({ ...communitySettings, city: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <input
                type="text"
                value={communitySettings.state}
                onChange={(e) => setCommunitySettings({ ...communitySettings, state: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pincode
              </label>
              <input
                type="text"
                value={communitySettings.pincode}
                onChange={(e) => setCommunitySettings({ ...communitySettings, pincode: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Name
              </label>
              <input
                type="text"
                value={communitySettings.adminName}
                onChange={(e) => setCommunitySettings({ ...communitySettings, adminName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Email
              </label>
              <input
                type="email"
                value={communitySettings.adminEmail}
                onChange={(e) => setCommunitySettings({ ...communitySettings, adminEmail: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Phone
              </label>
              <input
                type="tel"
                value={communitySettings.adminPhone}
                onChange={(e) => setCommunitySettings({ ...communitySettings, adminPhone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleSaveCommunitySettings}
              className="bg-secondary text-white px-6 py-2 rounded-md hover:bg-secondary/90"
            >
              Save Community Settings
            </button>
          </div>
        </div>
      )}

      {activeTab === 'payment' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <CreditCard className="h-6 w-6 text-primary mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Payment Gateway Settings</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Razorpay Key ID
              </label>
              <input
                type="text"
                value={paymentSettings.razorpayKeyId}
                onChange={(e) => setPaymentSettings({ ...paymentSettings, razorpayKeyId: e.target.value })}
                placeholder="rzp_test_xxxxxxxxxx"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Razorpay Key Secret
              </label>
              <input
                type="password"
                value={paymentSettings.razorpayKeySecret}
                onChange={(e) => setPaymentSettings({ ...paymentSettings, razorpayKeySecret: e.target.value })}
                placeholder="Enter your secret key"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GST Percentage
              </label>
              <input
                type="number"
                value={paymentSettings.gstPercentage}
                onChange={(e) => setPaymentSettings({ ...paymentSettings, gstPercentage: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Handling Charges (₹)
              </label>
              <input
                type="number"
                value={paymentSettings.handlingCharges}
                onChange={(e) => setPaymentSettings({ ...paymentSettings, handlingCharges: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={paymentSettings.gstEnabled}
                onChange={(e) => setPaymentSettings({ ...paymentSettings, gstEnabled: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Enable GST Collection</span>
            </label>
          </div>

          <div className="mt-6">
            <button
              onClick={handleSavePaymentSettings}
              className="bg-secondary text-white px-6 py-2 rounded-md hover:bg-secondary/90"
            >
              Save Payment Settings
            </button>
          </div>
        </div>
      )}

      {activeTab === 'whatsapp' && (
        <WhatsAppConfig
          communityId="community-1"
          initialConfig={whatsappSettings}
          onSave={handleSaveWhatsAppSettings}
        />
      )}

      {activeTab === 'templates' && (
        <MessageTemplates communityId="community-1" />
      )}
    </div>
  );
}