import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDA9HyHBaH43MxnjbMh95zl3zu7BwvkCh4",
  authDomain: "facebookclone-49252.firebaseapp.com",
  projectId: "facebookclone-49252",
  storageBucket: "facebookclone-49252.firebasestorage.app",
  messagingSenderId: "262405708296",
  appId: "1:262405708296:web:76c2967b88a217cbeb0fbd"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);