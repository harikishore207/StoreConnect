import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQYmQM1GKxFdwsNSwYPZUIIPXKGEWznGs",
  authDomain: "storeconnect-27e4b.firebaseapp.com",
  projectId: "storeconnect-27e4b",
  storageBucket: "storeconnect-27e4b.appspot.com",
  messagingSenderId: "655261131202",
  appId: "1:655261131202:web:af23828df99b4c0f04365b",
};

// Ensure Firebase is only initialized once
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with persistence enabled
const db = getApps().length
  ? getFirestore(app)
  : initializeFirestore(app, {
      localCache: { tabManager: true }, // Enables persistence
    });

// Initialize Auth with AsyncStorage persistence (fix for React Native)
const auth = getApps().length
  ? getAuth(app)
  : initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });

export { app, auth, db };