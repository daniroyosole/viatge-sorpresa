import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDuLJxynRQZQuZakNJTlk0bO3qyK70YHsI",
  authDomain: "viatge-sorpresa.firebaseapp.com",
  projectId: "viatge-sorpresa",
  storageBucket: "viatge-sorpresa.firebasestorage.app",
  messagingSenderId: "804686979518",
  appId: "1:804686979518:web:bf83adcad0b49fae6219ef",
  databaseURL: "https://viatge-sorpresa-default-rtdb.europe-west1.firebasedatabase.app"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);

console.log('Firebase app initialized:', app);
console.log('Database initialized:', database);
