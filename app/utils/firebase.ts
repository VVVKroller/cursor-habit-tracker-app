import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, signInWithPopup, getAuth, User, onAuthStateChanged } from "firebase/auth";
import {
  getDatabase,
  ref,
  set,
} from 'firebase/database';
import { Habit } from "../types";

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  databaseURL: ''
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase();
const provider = new GoogleAuthProvider();
provider.addScope('profile');
provider.addScope('email');

export let user: null | User = null;

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, provider);
  user = result.user;
  return result.user;
}

export const getAuthorizedUser = (cb: (user: any) => void) => {
  if (!auth) {
    return;
  }

  onAuthStateChanged(auth, (authedUser) => {
    if (authedUser) {
      user = authedUser;
      cb(authedUser);
    };
  });
};

export const createHabit = async (habit: Habit) => {
  if (!user?.uid) {
    console.warn('Cannot upload habit to DB. You are not authenticated.');
    return;
  }

  try {
    await set(ref(db, `habits/${habit.id}`), {...habit, userId: user?.uid} );
  } catch (error) {
    console.error(error);
  }
};