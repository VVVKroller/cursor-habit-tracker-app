import { useState, useEffect } from "react";
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
import { Habit, WeekDay } from "../types";

// Create a new user document with initial data
export const createUserDocument = async (
  userId: string,
  userData: { email: string; name: string }
) => {
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error creating user document:", error);
    throw error;
  }
};

// Custom hook for database operations
export const useDatabase = (userId: string) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch habits
  const fetchHabits = async () => {
    try {
      setLoading(true);
      const habitsRef = collection(db, "users", userId, "habits");
      const habitsSnapshot = await getDocs(habitsRef);
      const habitsData = habitsSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          type: data.type as "good" | "bad",
          frequency: data.frequency as WeekDay[],
          icon: data.icon,
          color: data.color,
          isCompleted: data.isCompleted,
          streak: data.streak,
          totalCompletions: data.totalCompletions,
          totalSkips: data.totalSkips,
          lastCompleted: data.lastCompleted?.toDate(),
        } as Habit;
      });
      setHabits(habitsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch habits");
    } finally {
      setLoading(false);
    }
  };

  // Add a new habit
  const addHabit = async (habit: Omit<Habit, "id" | "lastCompleted">) => {
    try {
      const habitsRef = collection(db, "users", userId, "habits");
      const newHabitRef = doc(habitsRef);

      const habitData = {
        ...habit,
        id: newHabitRef.id,
        lastCompleted: null,
      };

      await setDoc(newHabitRef, habitData);
      await fetchHabits(); // Refresh the habits list
      return newHabitRef.id;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add habit");
      throw err;
    }
  };

  // Update a habit
  const updateHabit = async (habitId: string, updates: Partial<Habit>) => {
    try {
      const habitRef = doc(db, "users", userId, "habits", habitId);
      await updateDoc(habitRef, updates);
      await fetchHabits(); // Refresh the habits list
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update habit");
      throw err;
    }
  };

  // Delete a habit
  const deleteHabit = async (habitId: string) => {
    try {
      const habitRef = doc(db, "users", userId, "habits", habitId);
      await deleteDoc(habitRef);
      await fetchHabits(); // Refresh the habits list
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete habit");
      throw err;
    }
  };

  // Update habit completion status
  const updateHabitCompletion = async (habitId: string, completed: boolean) => {
    try {
      const habitRef = doc(db, "users", userId, "habits", habitId);
      const habitDoc = await getDoc(habitRef);

      if (!habitDoc.exists()) {
        throw new Error("Habit not found");
      }

      const habitData = habitDoc.data();
      const now = new Date();

      await updateDoc(habitRef, {
        isCompleted: completed,
        lastCompleted: completed ? now : null,
        streak: completed ? (habitData.streak || 0) + 1 : 0,
        totalCompletions: completed
          ? (habitData.totalCompletions || 0) + 1
          : habitData.totalCompletions || 0,
        totalSkips: !completed
          ? (habitData.totalSkips || 0) + 1
          : habitData.totalSkips || 0,
      });

      await fetchHabits(); // Refresh the habits list
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update habit completion"
      );
      throw err;
    }
  };

  // Get habit completion status
  const getHabitCompletionStatus = async (
    habitId: string
  ): Promise<boolean> => {
    try {
      const habitRef = doc(db, "users", userId, "habits", habitId);
      const habitDoc = await getDoc(habitRef);

      if (!habitDoc.exists()) {
        throw new Error("Habit not found");
      }

      const habitData = habitDoc.data();
      return habitData.isCompleted || false;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to get habit completion status"
      );
      throw err;
    }
  };

  // Fetch habits on mount
  useEffect(() => {
    if (userId) {
      fetchHabits();
    }
  }, [userId]);

  return {
    habits,
    loading,
    error,
    addHabit,
    updateHabit,
    deleteHabit,
    updateHabitCompletion,
    getHabitCompletionStatus,
    refreshHabits: fetchHabits,
  };
};
