import {
  doc,
  getDoc,
  setDoc
} from 'firebase/firestore';
import { db } from '../../firebase/config';

const docRef = doc(db, 'razorpay_config', 'live'); // or 'test'

export const razorpayService = {
  getKeys: async () => {
    const snap = await getDoc(docRef);
    return snap.exists() ? snap.data() : null;
  },

  saveKeys: async (keyId: string, keySecret: string) => {
    await setDoc(docRef, { keyId, keySecret });
  }
};
