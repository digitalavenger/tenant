import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const configRef = doc(db, 'razorpay', 'config');

export const razorpayService = {
  async getKeys(): Promise<{ keyId: string; keySecret: string } | null> {
    const snap = await getDoc(configRef);
    if (!snap.exists()) return null;
    return snap.data() as { keyId: string; keySecret: string };
  },

  async saveKeys(keyId: string, keySecret: string) {
    await setDoc(configRef, { keyId, keySecret }, { merge: true });
  },

  async loadKey(): Promise<string | null> {
    const snap = await getDoc(configRef);
    if (!snap.exists()) return null;
    const data = snap.data();
    return data.keyId || null;
  }
};
