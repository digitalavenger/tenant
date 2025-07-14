import React, { useState } from 'react';
import { Settings as SettingsIcon, CreditCard, Bell, Shield, Database } from 'lucide-react';

export default function SuperAdminSettings() {
  const [activeTab, setActiveTab] = useState('platform');
  
  const [platformSettings, setPlatformSettings] = useState({
    platformName: 'SocietyPay',
    supportEmail: 'support@societypay.com',
    supportPhone: '+91 98765 43210',
    maintenanceMode: false,
    allowRegistrations: true,
    maxCommunitiesPerAdmin: 1,
  });

  const [paymentSettings, setPaymentSettings] = useState({
    razorpayKeyId: '',
    razorpayKeySecret: '',
    webhookSecret: '',
    commissionPercentage: 2.5,
    gstOnCommission: true,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    whatsappNotifications: true,
    adminAlerts: true,
    paymentAlerts: true,
  });

  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: 30,
    passwordMinLength: 8,
    requireTwoFactor: false,
    allowPasswordReset: true,
    maxLoginAttempts: 5,
  });

  const tabs = [
    { id: 'platform', label: 'Platform Settings', icon: SettingsIcon },
    { id: 'payment', label: 'Payment Gateway', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'database', label: 'Database', icon: Database },
  ];

  const handleSavePlatformSettings = () => {
    console.log('Saving platform settings:', platformSettings);
    // Save to Firebase
  };

  const handleSavePaymentSettings = () => {
    console.log('Saving payment settings:', paymentSettings);
    // Save to Firebase
  };

  const handleSaveNotificationSettings = () => {
    console.log('Saving notification settings:', notificationSettings);
    // Save to Firebase
  };

  const handleSaveSecuritySettings = () => {
    console.log('Saving security settings:', securitySettings);
    // Save to Firebase
  };

  return (
    <div className="p-6 ml-64">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
        <p className="text-gray-600">Manage global platform configuration and settings</p>
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

      {/* Platform Settings */}
      {activeTab === 'platform' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Platform Configuration</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Platform Name
              </label>
              <input
                type="text"
                value={platformSettings.platformName}
                onChange={(e) => setPlatformSettings({ ...platformSettings, platformName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Support Email
              </label>
              <input
                type="email"
                value={platformSettings.supportEmail}
                onChange={(e) => setPlatformSettings({ ...platformSettings, supportEmail: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Support Phone
              </label>
              <input
                type="tel"
                value={platformSettings.supportPhone}
                onChange={(e) => setPlatformSettings({ ...platformSettings, supportPhone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Communities per Admin
              </label>
              <input
                type="number"
                value={platformSettings.maxCommunitiesPerAdmin}
                onChange={(e) => setPlatformSettings({ ...platformSettings, maxCommunitiesPerAdmin: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={platformSettings.maintenanceMode}
                onChange={(e) => setPlatformSettings({ ...platformSettings, maintenanceMode: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Maintenance Mode</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={platformSettings.allowRegistrations}
                onChange={(e) => setPlatformSettings({ ...platformSettings, allowRegistrations: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Allow New Registrations</span>
            </label>
          </div>

          <div className="mt-6">
            <button
              onClick={handleSavePlatformSettings}
              className="bg-secondary text-white px-6 py-2 rounded-md hover:bg-secondary/90"
            >
              Save Platform Settings
            </button>
          </div>
        </div>
      )}

      {/* Payment Settings */}
      {activeTab === 'payment' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Payment Gateway Configuration</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Razorpay Key ID
              </label>
              <input
                type="text"
                value={paymentSettings.razorpayKeyId}
                onChange={(e) => setPaymentSettings({ ...paymentSettings, razorpayKeyId: e.target.value })}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Webhook Secret
              </label>
              <input
                type="password"
                value={paymentSettings.webhookSecret}
                onChange={(e) => setPaymentSettings({ ...paymentSettings, webhookSecret: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Commission Percentage (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={paymentSettings.commissionPercentage}
                onChange={(e) => setPaymentSettings({ ...paymentSettings, commissionPercentage: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={paymentSettings.gstOnCommission}
                onChange={(e) => setPaymentSettings({ ...paymentSettings, gstOnCommission: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Apply GST on Commission</span>
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

      {/* Notification Settings */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Notification Configuration</h3>
          
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={notificationSettings.emailNotifications}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, emailNotifications: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Email Notifications</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={notificationSettings.smsNotifications}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, smsNotifications: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">SMS Notifications</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={notificationSettings.whatsappNotifications}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, whatsappNotifications: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">WhatsApp Notifications</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={notificationSettings.adminAlerts}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, adminAlerts: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Admin Alerts</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={notificationSettings.paymentAlerts}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, paymentAlerts: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Payment Alerts</span>
            </label>
          </div>

          <div className="mt-6">
            <button
              onClick={handleSaveNotificationSettings}
              className="bg-secondary text-white px-6 py-2 rounded-md hover:bg-secondary/90"
            >
              Save Notification Settings
            </button>
          </div>
        </div>
      )}

      {/* Security Settings */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Security Configuration</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                value={securitySettings.sessionTimeout}
                onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password Minimum Length
              </label>
              <input
                type="number"
                value={securitySettings.passwordMinLength}
                onChange={(e) => setSecuritySettings({ ...securitySettings, passwordMinLength: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Login Attempts
              </label>
              <input
                type="number"
                value={securitySettings.maxLoginAttempts}
                onChange={(e) => setSecuritySettings({ ...securitySettings, maxLoginAttempts: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={securitySettings.requireTwoFactor}
                onChange={(e) => setSecuritySettings({ ...securitySettings, requireTwoFactor: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Require Two-Factor Authentication</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={securitySettings.allowPasswordReset}
                onChange={(e) => setSecuritySettings({ ...securitySettings, allowPasswordReset: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Allow Password Reset</span>
            </label>
          </div>

          <div className="mt-6">
            <button
              onClick={handleSaveSecuritySettings}
              className="bg-secondary text-white px-6 py-2 rounded-md hover:bg-secondary/90"
            >
              Save Security Settings
            </button>
          </div>
        </div>
      )}

      {/* Database Settings */}
      {activeTab === 'database' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Database Management</h3>
          
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <h4 className="text-sm font-medium text-yellow-800 mb-2">Backup & Restore</h4>
              <p className="text-sm text-yellow-700 mb-4">
                Regular backups are automatically created. You can also create manual backups or restore from previous backups.
              </p>
              <div className="flex space-x-3">
                <button className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 text-sm">
                  Create Backup
                </button>
                <button className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 text-sm">
                  View Backups
                </button>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <h4 className="text-sm font-medium text-red-800 mb-2">Data Cleanup</h4>
              <p className="text-sm text-red-700 mb-4">
                Remove old logs, expired sessions, and temporary data. This action cannot be undone.
              </p>
              <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm">
                Clean Old Data
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Database Statistics</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div>
                  <p className="text-sm text-blue-700">Total Communities</p>
                  <p className="text-lg font-semibold text-blue-900">45</p>
                </div>
                <div>
                  <p className="text-sm text-blue-700">Total Users</p>
                  <p className="text-lg font-semibold text-blue-900">1,250</p>
                </div>
                <div>
                  <p className="text-sm text-blue-700">Total Payments</p>
                  <p className="text-lg font-semibold text-blue-900">8,750</p>
                </div>
                <div>
                  <p className="text-sm text-blue-700">Database Size</p>
                  <p className="text-lg font-semibold text-blue-900">2.5 GB</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}