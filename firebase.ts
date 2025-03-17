import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAPmYdB8X7GWOBh1GzHFAHKjBR-I1lsAKw",
  authDomain: "habitflow-a94af.firebaseapp.com",
  projectId: "habitflow-a94af",
  storageBucket: "habitflow-a94af.firebasestorage.app",
  messagingSenderId: "1088747143523",
  appId: "1:1088747143523:web:f7b58fe0c93e2b40901356",
  measurementId: "G-SNYS6WENWJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Analytics conditionally
export const analytics = isSupported().then((yes) =>
  yes ? getAnalytics(app) : null
);

export default app;
