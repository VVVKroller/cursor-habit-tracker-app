import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase";
import { Habit } from "../types";

// User habits collection structure
interface UserHabit {
  id: string;
  name: string;
  type: "good" | "bad";
  frequency: string;
  days: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Helper function to convert Firestore data to Habit type
const convertToHabit = (data: any, id: string): Habit => ({
  id,
  name: data.name,
  type: data.type,
  frequency: data.frequency,
  days: data.days || [],
  createdAt: data.createdAt?.toDate() || new Date(),
  updatedAt: data.updatedAt?.toDate() || new Date(),
});

// Get user's habits
export const getUserHabits = async (userId: string): Promise<Habit[]> => {
  try {
    const habitsRef = collection(db, "users", userId, "habits");
    const habitsSnapshot = await getDocs(habitsRef);
    return habitsSnapshot.docs.map((doc) => convertToHabit(doc.data(), doc.id));
  } catch (error) {
    console.error("Error getting user habits:", error);
    throw error;
  }
};

// Add a new habit
export const addHabit = async (
  userId: string,
  habit: Omit<Habit, "id" | "createdAt" | "updatedAt">
): Promise<string> => {
  try {
    const habitsRef = collection(db, "users", userId, "habits");
    const newHabitRef = doc(habitsRef);

    const habitData: UserHabit = {
      ...habit,
      id: newHabitRef.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(newHabitRef, habitData);
    return newHabitRef.id;
  } catch (error) {
    console.error("Error adding habit:", error);
    throw error;
  }
};

// Update a habit
export const updateHabit = async (
  userId: string,
  habitId: string,
  updates: Partial<Habit>
): Promise<void> => {
  try {
    const habitRef = doc(db, "users", userId, "habits", habitId);
    await updateDoc(habitRef, {
      ...updates,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error updating habit:", error);
    throw error;
  }
};

// Delete a habit
export const deleteHabit = async (
  userId: string,
  habitId: string
): Promise<void> => {
  try {
    const habitRef = doc(db, "users", userId, "habits", habitId);
    await deleteDoc(habitRef);
  } catch (error) {
    console.error("Error deleting habit:", error);
    throw error;
  }
};

// Update habit completion status
export const updateHabitCompletion = async (
  userId: string,
  habitId: string,
  date: string,
  completed: boolean
): Promise<void> => {
  try {
    const habitRef = doc(db, "users", userId, "habits", habitId);
    const habitDoc = await getDoc(habitRef);

    if (!habitDoc.exists()) {
      throw new Error("Habit not found");
    }

    const habitData = habitDoc.data();
    const days = habitData.days || [];

    if (completed) {
      if (!days.includes(date)) {
        days.push(date);
      }
    } else {
      const index = days.indexOf(date);
      if (index > -1) {
        days.splice(index, 1);
      }
    }

    await updateDoc(habitRef, {
      days,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error updating habit completion:", error);
    throw error;
  }
};

// Get habit completion status for a specific date
export const getHabitCompletionStatus = async (
  userId: string,
  habitId: string,
  date: string
): Promise<boolean> => {
  try {
    const habitRef = doc(db, "users", userId, "habits", habitId);
    const habitDoc = await getDoc(habitRef);

    if (!habitDoc.exists()) {
      throw new Error("Habit not found");
    }

    const habitData = habitDoc.data();
    return (habitData.days || []).includes(date);
  } catch (error) {
    console.error("Error getting habit completion status:", error);
    throw error;
  }
};
