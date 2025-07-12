export interface User {
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

export interface Community {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  adminId: string;
  subscriptionId: string;
  isActive: boolean;
  totalTenants: number;
  totalBlocks: number;
  settings: CommunitySettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommunitySettings {
  paymentGateway: {
    razorpayKeyId: string;
    razorpayKeySecret: string;
  };
  whatsapp: {
    apiKey: string;
    phoneNumberId: string;
    templateId: string;
  };
  charges: {
    gstEnabled: boolean;
    gstPercentage: number;
    handlingCharges: number;
  };
}

export interface Subscription {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in months
  features: string[];
  maxTenants: number;
  isActive: boolean;
  createdAt: Date;
}

export interface Block {
  id: string;
  communityId: string;
  name: string;
  totalFlats: number;
  createdAt: Date;
}

export interface Flat {
  id: string;
  communityId: string;
  blockId: string;
  flatNumber: string;
  tenantId?: string;
  createdAt: Date;
}

export interface Tenant {
  id: string;
  communityId: string;
  blockId: string;
  flatId: string;
  name: string;
  email: string;
  phone: string;
  flatNumber: string;
  monthlyMaintenance: number;
  isActive: boolean;
  createdAt: Date;
}

export interface MaintenanceRecord {
  id: string;
  communityId: string;
  tenantId: string;
  month: string;
  year: number;
  amount: number;
  gstAmount: number;
  handlingCharges: number;
  totalAmount: number;
  status: 'pending' | 'paid' | 'overdue';
  dueDate: Date;
  paidDate?: Date;
  paymentId?: string;
  createdAt: Date;
}

export interface Payment {
  id: string;
  communityId: string;
  tenantId: string;
  maintenanceId: string;
  amount: number;
  razorpayPaymentId: string;
  status: 'success' | 'failed' | 'pending';
  method: string;
  createdAt: Date;
}

export interface DashboardStats {
  totalTenants: number;
  totalMonthlyMaintenance: number;
  totalPaid: number;
  totalDue: number;
  collectionRate: number;
}