import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  signInWithPopup,
  getAuth,
  User,
  onAuthStateChanged,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { Habit } from "../types";

const firebaseConfig = {
  apiKey: "AIzaSyAPmYdB8X7GWOBh1GzHFAHKjBR-I1lsAKw",
  authDomain: "habitflow-a94af.firebaseapp.com",
  projectId: "habitflow-a94af",
  storageBucket: "habitflow-a94af.firebasestorage.app",
  messagingSenderId: "1088747143523",
  appId: "1:1088747143523:web:8c55be98e9731b53901356",
  measurementId: "G-TLGE5TCN6J",
  databaseURL:
    "https://habitflow-a94af-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase();
const provider = new GoogleAuthProvider();
provider.addScope("profile");
provider.addScope("email");

export let user: null | User = null;

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, provider);
  user = result.user;
  return result.user;
};

export const getAuthorizedUser = (cb: (user: any) => void) => {
  if (!auth) {
    return;
  }

  onAuthStateChanged(auth, (authedUser) => {
    if (authedUser) {
      user = authedUser;
      cb(authedUser);
    }
  });
};

export const createHabit = async (habit: Habit) => {
  if (!user?.uid) {
    console.warn("Cannot upload habit to DB. You are not authenticated.");
    return;
  }

  try {
    await set(ref(db, `habits/${habit.id}`), { ...habit, userId: user?.uid });
  } catch (error) {
    console.error(error);
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    user = null;
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};
//TODO Update in DB
