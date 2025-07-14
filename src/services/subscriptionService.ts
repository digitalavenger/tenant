// src/services/subscriptionService.ts

import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  DocumentData
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Subscription } from '../../types';
import { Timestamp } from 'firebase/firestore';

const subscriptionsCollection = collection(db, 'subscriptions');

export const subscriptionService = {
  /**
   * Fetch all subscriptions (for admin panel)
   */
  getSubscriptions: async (): Promise<Subscription[]> => {
    try {
      const querySnapshot = await getDocs(subscriptionsCollection);
      return querySnapshot.docs.map(doc => formatSubscriptionDoc(doc.id, doc.data()));
    } catch (error) {
      console.error('Failed to get subscriptions:', error);
      throw new Error('Could not load subscription plans.');
    }
  },

  /**
   * Fetch only active subscriptions (for user-facing pages)
   */
  getActiveSubscriptions: async (): Promise<Subscription[]> => {
    try {
      const q = query(subscriptionsCollection, where('isActive', '==', true));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => formatSubscriptionDoc(doc.id, doc.data()));
    } catch (error) {
      console.error('Failed to get active subscriptions:', error);
      throw new Error('Could not load active subscription plans.');
    }
  },

  /**
   * Create a new subscription
   */
  createSubscription: async (data: Omit<Subscription, 'id' | 'createdAt'>) => {
    try {
      return await addDoc(subscriptionsCollection, {
        ...data,
        createdAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Failed to create subscription:', error);
      throw new Error('Could not create subscription.');
    }
  },

  /**
   * Update an existing subscription
   */
  updateSubscription: async (
    id: string,
    data: Partial<Omit<Subscription, 'id' | 'createdAt'>>
  ) => {
    try {
      const subscriptionDoc = doc(db, 'subscriptions', id);
      return await updateDoc(subscriptionDoc, data);
    } catch (error) {
      console.error('Failed to update subscription:', error);
      throw new Error('Could not update subscription.');
    }
  },

  /**
   * Delete a subscription
   */
  deleteSubscription: async (id: string) => {
    try {
      const subscriptionDoc = doc(db, 'subscriptions', id);
      return await deleteDoc(subscriptionDoc);
    } catch (error) {
      console.error('Failed to delete subscription:', error);
      throw new Error('Could not delete subscription.');
    }
  }
};

/**
 * Helper to safely format Firestore document into Subscription object
 */
function formatSubscriptionDoc(id: string, data: DocumentData): Subscription {
  return {
    id,
    name: data.name || '',
    description: data.description || '',
    price: typeof data.price === 'number' ? data.price : 0,
    duration: typeof data.duration === 'number' ? data.duration : 12,
    features: Array.isArray(data.features) ? data.features : [],
    maxTenants: typeof data.maxTenants === 'number' ? data.maxTenants : 0,
    isActive: !!data.isActive,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt : Timestamp.now(),
  };
}
