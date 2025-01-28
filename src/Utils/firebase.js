import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQYmQM1GKxFdwsNSwYPZUIIPXKGEWznGs",
  authDomain: "storeconnect-27e4b.firebaseapp.com",
  projectId: "storeconnect-27e4b",
  storageBucket: "storeconnect-27e4b.appspot.com",
  messagingSenderId: "655261131202",
  appId: "1:655261131202:web:af23828df99b4c0f04365b",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
