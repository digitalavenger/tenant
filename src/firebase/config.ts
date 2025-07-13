// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  // Replace with your Firebase config
apiKey: "AIzaSyAqkGp0shvHAaZ5bEl-1C56rqL00FYRdu0",
  authDomain: "tenant-f74c7.firebaseapp.com",
  projectId: "tenant-f74c7",
  storageBucket: "tenant-f74c7.firebasestorage.app",
  messagingSenderId: "421202390803",
  appId: "1:421202390803:web:4611dd5f91fb718c2274e6"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

export default app;