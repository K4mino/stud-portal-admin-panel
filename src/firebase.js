import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {getStorage} from 'firebase/storage';
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: 'chat-edb8d.firebaseapp.com',
  projectId: 'chat-edb8d',
  storageBucket: 'chat-edb8d.appspot.com',
  messagingSenderId: '846554297701',
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();