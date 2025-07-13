// src/types/index.ts

// Import Timestamp from 'firebase/firestore' for Firebase v9+
import { Timestamp } from 'firebase/firestore'; 

export interface User {
  id: string; // Corresponds to Firebase Auth UID
  email: string;
  name: string;
  phone: string;
  // ⭐ CRITICAL: These roles MUST EXACTLY MATCH the strings in your Firestore documents.
  //   e.g., if Firestore has "super_admin", this must be 'super_admin', not 'SuperAdmin'.
  role: 'super_admin' | 'community_admin' | 'tenant'; 
  communityId?: string; // Optional: A user might not belong to a community immediately
  isActive: boolean;
  // ⭐ IMPORTANT: Use Timestamp type here as Firestore stores dates as Timestamps.
  //    We will convert them to JavaScript Date objects when reading.
  createdAt: Timestamp; 
  updatedAt: Timestamp;
  // If you have a lastLogin field in Firestore, it should also be Timestamp
  lastLogin?: Timestamp; 
}

// Other interfaces remain as you provided, but consider if they also use 'Date'
// where 'Timestamp' should be used for fields coming directly from Firestore.
// For example, if Community has createdAt/updatedAt, they should also be Timestamp.

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
  createdAt: Timestamp; // Changed to Timestamp
  updatedAt: Timestamp; // Changed to Timestamp
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
  createdAt: Timestamp; // Changed to Timestamp
}

export interface Block {
  id: string;
  communityId: string;
  name: string;
  totalFlats: number;
  createdAt: Timestamp; // Changed to Timestamp
}

export interface Flat {
  id: string;
  communityId: string;
  blockId: string;
  flatNumber: string;
  tenantId?: string;
  createdAt: Timestamp; // Changed to Timestamp
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
  createdAt: Timestamp; // Changed to Timestamp
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
  dueDate: Timestamp; // Changed to Timestamp
  paidDate?: Timestamp; // Changed to Timestamp
  paymentId?: string;
  createdAt: Timestamp; // Changed to Timestamp
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
  createdAt: Timestamp; // Changed to Timestamp
}

export interface DashboardStats {
  totalTenants: number;
  totalMonthlyMaintenance: number;
  totalPaid: number;
  totalDue: number;
  collectionRate: number;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  language: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  category: string;
  components: WhatsAppTemplateComponent[];
}

export interface WhatsAppTemplateComponent {
  type: 'HEADER' | 'BODY' | 'FOOTER' | 'BUTTONS';
  format?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT';
  text?: string;
  buttons?: WhatsAppButton[];
  example?: {
    header_text?: string[];
    body_text?: string[][];
  };
}

export interface WhatsAppButton {
  type: 'QUICK_REPLY' | 'URL' | 'PHONE_NUMBER';
  text: string;
  url?: string;
  phone_number?: string;
}

export interface WhatsAppConfig {
  wabaNumber: string;
  apiKey: string;
  baseUrl: string;
}

export interface WhatsAppMessage {
  to: string;
  type: 'text' | 'template' | 'image' | 'document';
  text?: {
    body: string;
  };
  template?: {
    name: string;
    language: {
      code: string;
      policy: 'deterministic';
    };
    components?: WhatsAppTemplateParameter[];
  };
}

export interface WhatsAppTemplateParameter {
  type: 'header' | 'body' | 'button';
  sub_type?: 'url';
  index?: string;
  parameters: {
    type: 'text' | 'image' | 'document';
    text?: string;
    image?: { link: string };
    document?: { link: string; filename: string };
  }[];
}