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
  limit,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Community, Tenant, MaintenanceRecord, Payment, Subscription, User } from '../types';

// Community Services
export const communityService = {
  async createCommunity(communityData: Omit<Community, 'id' | 'createdAt' | 'updatedAt'>) {
    const docRef = await addDoc(collection(db, 'communities'), {
      ...communityData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async getCommunities() {
    const querySnapshot = await getDocs(
      query(collection(db, 'communities'), orderBy('createdAt', 'desc'))
    );
    return querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    } as Community));
  },

  async getCommunity(id: string) {
    const docSnap = await getDoc(doc(db, 'communities', id));
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Community;
    }
    return null;
  },

  async updateCommunity(id: string, updates: Partial<Community>) {
    await updateDoc(doc(db, 'communities', id), {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  },

  async deleteCommunity(id: string) {
    await deleteDoc(doc(db, 'communities', id));
  },

  async toggleCommunityStatus(id: string) {
    const communityDoc = await getDoc(doc(db, 'communities', id));
    if (communityDoc.exists()) {
      const currentStatus = communityDoc.data().isActive;
      await updateDoc(doc(db, 'communities', id), {
        isActive: !currentStatus,
        updatedAt: serverTimestamp(),
      });
    }
  }
};

// User Services
export const userService = {
  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) {
    const docRef = await addDoc(collection(db, 'users'), {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async getUsers() {
    const querySnapshot = await getDocs(collection(db, 'users'));
    return querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    } as User));
  },

  async getUsersByCommunity(communityId: string) {
    const q = query(collection(db, 'users'), where('communityId', '==', communityId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    } as User));
  },

  async updateUser(id: string, updates: Partial<User>) {
    await updateDoc(doc(db, 'users', id), {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  }
};

// Tenant Services
export const tenantService = {
  async createTenant(tenantData: Omit<Tenant, 'id' | 'createdAt'>) {
    const docRef = await addDoc(collection(db, 'tenants'), {
      ...tenantData,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async getTenants(communityId: string) {
    const q = query(
      collection(db, 'tenants'), 
      where('communityId', '==', communityId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    } as Tenant));
  },

  async updateTenant(id: string, updates: Partial<Tenant>) {
    await updateDoc(doc(db, 'tenants', id), updates);
  },

  async deleteTenant(id: string) {
    await deleteDoc(doc(db, 'tenants', id));
  },

  async getTenantStats(communityId: string) {
    const tenants = await this.getTenants(communityId);
    const activeTenants = tenants.filter(t => t.isActive);
    const totalMonthlyMaintenance = activeTenants.reduce((sum, t) => sum + t.monthlyMaintenance, 0);
    
    return {
      totalTenants: activeTenants.length,
      totalMonthlyMaintenance,
    };
  }
};

// Maintenance Services
export const maintenanceService = {
  async createMaintenanceRecord(recordData: Omit<MaintenanceRecord, 'id' | 'createdAt'>) {
    const docRef = await addDoc(collection(db, 'maintenanceRecords'), {
      ...recordData,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async getMaintenanceRecords(communityId: string, filters?: { 
    status?: string; 
    month?: string; 
    year?: number;
    tenantId?: string;
  }) {
    let q = query(
      collection(db, 'maintenanceRecords'), 
      where('communityId', '==', communityId)
    );
    
    if (filters?.status) {
      q = query(q, where('status', '==', filters.status));
    }
    if (filters?.month) {
      q = query(q, where('month', '==', filters.month));
    }
    if (filters?.year) {
      q = query(q, where('year', '==', filters.year));
    }
    if (filters?.tenantId) {
      q = query(q, where('tenantId', '==', filters.tenantId));
    }
    
    q = query(q, orderBy('createdAt', 'desc'));
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      dueDate: doc.data().dueDate?.toDate() || new Date(),
      paidDate: doc.data().paidDate?.toDate() || null,
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    } as MaintenanceRecord));
  },

  async updateMaintenanceRecord(id: string, updates: Partial<MaintenanceRecord>) {
    await updateDoc(doc(db, 'maintenanceRecords', id), updates);
  },

  async generateMonthlyMaintenance(communityId: string, month: string, year: number) {
    const tenants = await tenantService.getTenants(communityId);
    const community = await communityService.getCommunity(communityId);
    
    if (!community) throw new Error('Community not found');
    
    const batch = writeBatch(db);
    const records = [];
    
    for (const tenant of tenants.filter(t => t.isActive)) {
      const gstAmount = community.settings.charges.gstEnabled 
        ? (tenant.monthlyMaintenance * community.settings.charges.gstPercentage) / 100 
        : 0;
      
      const totalAmount = tenant.monthlyMaintenance + gstAmount + community.settings.charges.handlingCharges;
      
      const recordData = {
        communityId,
        tenantId: tenant.id,
        month,
        year,
        amount: tenant.monthlyMaintenance,
        gstAmount,
        handlingCharges: community.settings.charges.handlingCharges,
        totalAmount,
        status: 'pending' as const,
        dueDate: new Date(year, new Date(`${month} 1, ${year}`).getMonth(), 10), // 10th of the month
        createdAt: serverTimestamp(),
      };
      
      const docRef = doc(collection(db, 'maintenanceRecords'));
      batch.set(docRef, recordData);
      records.push({ id: docRef.id, ...recordData });
    }
    
    await batch.commit();
    return records;
  },

  async getMaintenanceStats(communityId: string, month?: string, year?: number) {
    const currentMonth = month || new Date().toLocaleString('default', { month: 'long' });
    const currentYear = year || new Date().getFullYear();
    
    const records = await this.getMaintenanceRecords(communityId, { 
      month: currentMonth, 
      year: currentYear 
    });
    
    const totalPaid = records
      .filter(r => r.status === 'paid')
      .reduce((sum, r) => sum + r.totalAmount, 0);
    
    const totalDue = records
      .filter(r => r.status === 'pending' || r.status === 'overdue')
      .reduce((sum, r) => sum + r.totalAmount, 0);
    
    const totalAmount = records.reduce((sum, r) => sum + r.totalAmount, 0);
    const collectionRate = totalAmount > 0 ? (totalPaid / totalAmount) * 100 : 0;
    
    return {
      totalPaid,
      totalDue,
      totalAmount,
      collectionRate,
      recordsCount: records.length,
    };
  }
};

// Payment Services
export const paymentService = {
  async createPayment(paymentData: Omit<Payment, 'id' | 'createdAt'>) {
    const docRef = await addDoc(collection(db, 'payments'), {
      ...paymentData,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async getPayments(communityId: string, limit?: number) {
    let q = query(
      collection(db, 'payments'), 
      where('communityId', '==', communityId),
      orderBy('createdAt', 'desc')
    );
    
    if (limit) {
      q = query(q, limit(limit));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    } as Payment));
  },

  async updatePayment(id: string, updates: Partial<Payment>) {
    await updateDoc(doc(db, 'payments', id), updates);
  }
};

// Subscription Services
export const subscriptionService = {
  async createSubscription(subscriptionData: Omit<Subscription, 'id' | 'createdAt'>) {
    const docRef = await addDoc(collection(db, 'subscriptions'), {
      ...subscriptionData,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async getSubscriptions() {
    const querySnapshot = await getDocs(
      query(collection(db, 'subscriptions'), orderBy('price', 'asc'))
    );
    return querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    } as Subscription));
  },

  async getActiveSubscriptions() {
    const q = query(
      collection(db, 'subscriptions'), 
      where('isActive', '==', true),
      orderBy('price', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    } as Subscription));
  },

  async updateSubscription(id: string, updates: Partial<Subscription>) {
    await updateDoc(doc(db, 'subscriptions', id), updates);
  },

  async deleteSubscription(id: string) {
    await deleteDoc(doc(db, 'subscriptions', id));
  }
};

// Dashboard Services
export const dashboardService = {
  async getSuperAdminStats() {
    const [communities, subscriptions] = await Promise.all([
      communityService.getCommunities(),
      subscriptionService.getSubscriptions()
    ]);
    
    const totalCommunities = communities.length;
    const activeCommunities = communities.filter(c => c.isActive).length;
    const totalTenants = communities.reduce((sum, c) => sum + c.totalTenants, 0);
    const monthlyRevenue = activeCommunities * (subscriptions[0]?.price || 0); // Simplified calculation
    
    return {
      totalCommunities,
      activeCommunities,
      totalTenants,
      monthlyRevenue,
      collectionRate: 94.5, // This would be calculated from actual payment data
    };
  },

  async getCommunityAdminStats(communityId: string) {
    const [tenantStats, maintenanceStats] = await Promise.all([
      tenantService.getTenantStats(communityId),
      maintenanceService.getMaintenanceStats(communityId)
    ]);
    
    return {
      ...tenantStats,
      ...maintenanceStats,
    };
  }
};