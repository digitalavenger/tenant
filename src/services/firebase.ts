import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Community, Tenant, MaintenanceRecord, Payment, Subscription } from '../types';

// Community Services
export const communityService = {
  async createCommunity(communityData: Omit<Community, 'id'>) {
    const docRef = await addDoc(collection(db, 'communities'), {
      ...communityData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  },

  async getCommunities() {
    const querySnapshot = await getDocs(collection(db, 'communities'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Community));
  },

  async updateCommunity(id: string, updates: Partial<Community>) {
    await updateDoc(doc(db, 'communities', id), {
      ...updates,
      updatedAt: new Date(),
    });
  },

  async deleteCommunity(id: string) {
    await deleteDoc(doc(db, 'communities', id));
  },
};

// Tenant Services
export const tenantService = {
  async createTenant(tenantData: Omit<Tenant, 'id'>) {
    const docRef = await addDoc(collection(db, 'communities', tenantData.communityId, 'tenants'), {
      ...tenantData,
      createdAt: new Date(),
    });
    return docRef.id;
  },

  async getTenants(communityId: string) {
    const querySnapshot = await getDocs(collection(db, 'communities', communityId, 'tenants'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tenant));
  },

  async updateTenant(communityId: string, tenantId: string, updates: Partial<Tenant>) {
    await updateDoc(doc(db, 'communities', communityId, 'tenants', tenantId), updates);
  },

  async deleteTenant(communityId: string, tenantId: string) {
    await deleteDoc(doc(db, 'communities', communityId, 'tenants', tenantId));
  },
};

// Maintenance Services
export const maintenanceService = {
  async createMaintenanceRecord(recordData: Omit<MaintenanceRecord, 'id'>) {
    const docRef = await addDoc(collection(db, 'communities', recordData.communityId, 'maintenance'), {
      ...recordData,
      createdAt: new Date(),
    });
    return docRef.id;
  },

  async getMaintenanceRecords(communityId: string, filters?: { status?: string; month?: string; year?: number }) {
    let q = query(collection(db, 'communities', communityId, 'maintenance'));
    
    if (filters?.status) {
      q = query(q, where('status', '==', filters.status));
    }
    if (filters?.month) {
      q = query(q, where('month', '==', filters.month));
    }
    if (filters?.year) {
      q = query(q, where('year', '==', filters.year));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MaintenanceRecord));
  },

  async updateMaintenanceRecord(communityId: string, recordId: string, updates: Partial<MaintenanceRecord>) {
    await updateDoc(doc(db, 'communities', communityId, 'maintenance', recordId), updates);
  },
};

// Payment Services
export const paymentService = {
  async createPayment(paymentData: Omit<Payment, 'id'>) {
    const docRef = await addDoc(collection(db, 'communities', paymentData.communityId, 'payments'), {
      ...paymentData,
      createdAt: new Date(),
    });
    return docRef.id;
  },

  async getPayments(communityId: string) {
    const querySnapshot = await getDocs(
      query(collection(db, 'communities', communityId, 'payments'), orderBy('createdAt', 'desc'))
    );
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Payment));
  },
};

// Subscription Services
export const subscriptionService = {
  async createSubscription(subscriptionData: Omit<Subscription, 'id'>) {
    const docRef = await addDoc(collection(db, 'subscriptions'), {
      ...subscriptionData,
      createdAt: new Date(),
    });
    return docRef.id;
  },

  async getSubscriptions() {
    const querySnapshot = await getDocs(collection(db, 'subscriptions'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Subscription));
  },

  async updateSubscription(id: string, updates: Partial<Subscription>) {
    await updateDoc(doc(db, 'subscriptions', id), updates);
  },

  async deleteSubscription(id: string) {
    await deleteDoc(doc(db, 'subscriptions', id));
  },
};