import React from 'react';
import { Building2, Users, DollarSign, TrendingUp } from 'lucide-react';
import StatCard from '../../components/Dashboard/StatCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const monthlyData = [
  { month: 'Jan', communities: 12, revenue: 45000 },
  { month: 'Feb', communities: 18, revenue: 52000 },
  { month: 'Mar', communities: 25, revenue: 68000 },
  { month: 'Apr', communities: 32, revenue: 75000 },
  { month: 'May', communities: 38, revenue: 85000 },
  { month: 'Jun', communities: 45, revenue: 95000 },
];

const recentCommunities = [
  { name: 'Green Valley Apartments', admin: 'Rajesh Kumar', tenants: 45, status: 'active' },
  { name: 'Sunrise Heights', admin: 'Priya Sharma', tenants: 32, status: 'active' },
  { name: 'Royal Gardens', admin: 'Amit Patel', tenants: 28, status: 'pending' },
  { name: 'Golden Towers', admin: 'Sunita Reddy', tenants: 56, status: 'active' },
];

export default function SuperAdminDashboard() {
  return (
    <div className="p-6 ml-64">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
        <p className="text-gray-600">Overview of all communities and platform performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Communities"
          value="156"
          icon={Building2}
          change="+12% from last month"
          changeType="positive"
        />
        <StatCard
          title="Active Tenants"
          value="3,247"
          icon={Users}
          change="+8% from last month"
          changeType="positive"
        />
        <StatCard
          title="Monthly Revenue"
          value="₹2,45,000"
          icon={DollarSign}
          change="+15% from last month"
          changeType="positive"
        />
        <StatCard
          title="Collection Rate"
          value="94.5%"
          icon={TrendingUp}
          change="+2% from last month"
          changeType="positive"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} />
              <Bar dataKey="revenue" fill="#309b47" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Community Growth */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Community Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="communities" stroke="#0e2625" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Communities */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Communities</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Community Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tenants
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentCommunities.map((community, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{community.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{community.admin}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{community.tenants}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      community.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {community.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-secondary hover:text-secondary/80">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}