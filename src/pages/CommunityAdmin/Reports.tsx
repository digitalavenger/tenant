import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Download, Calendar, TrendingUp, Users, DollarSign, Home } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { dashboardService, maintenanceService, tenantService } from '../../services/firebase';

export default function CommunityReports() {
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });

  const [reportData, setReportData] = useState({
    totalTenants: 0,
    totalMonthlyMaintenance: 0,
    totalPaid: 0,
    totalDue: 0,
    collectionRate: 0,
    occupancyRate: 0
  });

  // Mock data for charts - in real app, this would come from Firebase
  const monthlyCollectionData = [
    { month: 'Jan', collected: 85000, target: 90000, tenants: 28 },
    { month: 'Feb', collected: 88000, target: 90000, tenants: 29 },
    { month: 'Mar', collected: 92000, target: 90000, tenants: 30 },
    { month: 'Apr', collected: 87000, target: 90000, tenants: 30 },
    { month: 'May', collected: 95000, target: 90000, tenants: 31 },
    { month: 'Jun', collected: 98000, target: 90000, tenants: 32 },
  ];

  const paymentMethodData = [
    { name: 'UPI', value: 45, color: '#309b47' },
    { name: 'Net Banking', value: 30, color: '#0e2625' },
    { name: 'Credit Card', value: 15, color: '#f59e0b' },
    { name: 'Debit Card', value: 10, color: '#ef4444' },
  ];

  const blockWiseData = [
    { block: 'Block A', tenants: 12, collected: 36000, pending: 4000 },
    { block: 'Block B', tenants: 10, collected: 28000, pending: 7000 },
    { block: 'Block C', tenants: 8, collected: 24000, pending: 0 },
  ];

  useEffect(() => {
    if (userProfile?.communityId) {
      fetchReportData();
    }
  }, [userProfile, dateRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const stats = await dashboardService.getCommunityAdminStats(userProfile?.communityId || '');
      setReportData({
        totalTenants: stats.totalTenants,
        totalMonthlyMaintenance: stats.totalMonthlyMaintenance,
        totalPaid: stats.totalPaid,
        totalDue: stats.totalDue,
        collectionRate: stats.collectionRate,
        occupancyRate: 85.5 // This would be calculated from blocks/flats data
      });
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    const reportContent = [
      ['Metric', 'Value'],
      ['Total Tenants', reportData.totalTenants],
      ['Monthly Maintenance Target', `₹${reportData.totalMonthlyMaintenance.toLocaleString()}`],
      ['Amount Collected', `₹${reportData.totalPaid.toLocaleString()}`],
      ['Amount Due', `₹${reportData.totalDue.toLocaleString()}`],
      ['Collection Rate', `${reportData.collectionRate}%`],
      ['Occupancy Rate', `${reportData.occupancyRate}%`],
      [''],
      ['Monthly Collection Data'],
      ['Month', 'Collected', 'Target', 'Tenants'],
      ...monthlyCollectionData.map(item => [item.month, item.collected, item.target, item.tenants])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([reportContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `community-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="p-6 ml-64">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 ml-64">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Community Reports</h1>
            <p className="text-gray-600">Detailed analytics and performance insights</p>
          </div>
          <div className="flex space-x-4">
            <div className="flex space-x-2">
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
            </div>
            <button
              onClick={exportReport}
              className="bg-secondary text-white px-4 py-2 rounded-md hover:bg-secondary/90 flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tenants</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.totalTenants}</p>
              <p className="text-sm text-green-600">+3 from last month</p>
            </div>
            <Users className="h-8 w-8 text-primary" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Collection Rate</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.collectionRate.toFixed(1)}%</p>
              <p className="text-sm text-green-600">+2.5% from last month</p>
            </div>
            <TrendingUp className="h-8 w-8 text-secondary" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{reportData.totalPaid.toLocaleString()}</p>
              <p className="text-sm text-green-600">+8% from last month</p>
            </div>
            <DollarSign className="h-8 w-8 text-primary" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.occupancyRate}%</p>
              <p className="text-sm text-green-600">+1.2% from last month</p>
            </div>
            <Home className="h-8 w-8 text-secondary" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Collection Trend */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Collection vs Target</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyCollectionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, '']} />
              <Bar dataKey="collected" fill="#309b47" />
              <Bar dataKey="target" fill="#0e2625" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Methods */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentMethodData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
              >
                {paymentMethodData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center space-x-4 mt-4">
            {paymentMethodData.map((entry, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2`} style={{ backgroundColor: entry.color }}></div>
                <span className="text-sm text-gray-600">{entry.name} ({entry.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tenant Growth */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tenant Growth Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyCollectionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="tenants" stroke="#0e2625" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Block-wise Performance */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Block-wise Performance</h3>
          <div className="space-y-4">
            {blockWiseData.map((block, index) => {
              const collectionRate = ((block.collected / (block.collected + block.pending)) * 100).toFixed(1);
              return (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900">{block.block}</h4>
                    <span className="text-sm text-gray-500">{block.tenants} tenants</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Collected: ₹{block.collected.toLocaleString()}</span>
                    <span className="text-sm text-gray-600">Pending: ₹{block.pending.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Collection Rate</span>
                    <span className="text-sm font-medium text-gray-900">{collectionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-secondary h-2 rounded-full" 
                      style={{ width: `${collectionRate}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}