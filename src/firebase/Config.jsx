import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  // apiKey: "YOUR_API_KEY",
  // authDomain: "YOUR_AUTH_DOMAIN",
  // projectId: "YOUR_PROJECT_ID",
  // storageBucket: "YOUR_STORAGE_BUCKET",
  // messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  // appId: "YOUR_APP_ID"

  apiKey: "AIzaSyBSkDUdk0hQJuYRWjQ5ipbOcVaYbMffNi0",
  authDomain: "task-tracker-92991.firebaseapp.com",
  projectId: "task-tracker-92991",
  storageBucket: "task-tracker-92991.firebasestorage.app",
  messagingSenderId: "118674341168",
  appId: "1:118674341168:web:85fea8f8feae31596f9cf5",
  measurementId: "G-Z0D4P2HKX1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore services
export const db = getFirestore(app);
export const auth = getAuth(app);

// Debug log for connection status
db.INTERNAL && console.log('Firestore initialized');

export default app;