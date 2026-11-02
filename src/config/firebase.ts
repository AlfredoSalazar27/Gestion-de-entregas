import { initializeApp, getApps, getApp } from 'firebase/app';
import * as firebaseAuth from 'firebase/auth';
import type { Auth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBldl6_pDDsW_H_MGevN8IPWteimC9IbQI',
  authDomain: 'mensajeria-entregas.firebaseapp.com',
  projectId: 'mensajeria-entregas',
  storageBucket: 'mensajeria-entregas.firebasestorage.app',
  messagingSenderId: '345648407422',
  appId: '1:345648407422:web:52ffaaf574df51e6d6492f',
  measurementId: 'G-339FMMHEPS',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const { initializeAuth, getAuth } = firebaseAuth;
// @ts-ignore
const getReactNativePersistence = firebaseAuth.getReactNativePersistence;

let auth: Auth;

try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  auth = getAuth(app);
}

export { auth };
export const db = getFirestore(app);
export const storage = getStorage(app);