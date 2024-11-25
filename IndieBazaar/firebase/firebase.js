// Import the functions you need from the Firebase Web SDK
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD4vyfCBm8TuWd8jULTbxpxzuV2jyadGoE",
  authDomain: "indiebazaar-c9a7f.firebaseapp.com",
  projectId: "indiebazaar-c9a7f",
  storageBucket: "indiebazaar-c9a7f.appspot.com",
  messagingSenderId: "818148572846",
  appId: "1:818148572846:web:fbd5a94e3103014018373f",
  measurementId: "G-SZ9H97BRXW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase services
const db = getFirestore(app);
const auth = getAuth(app);

// Export services
export { app, db, auth };
