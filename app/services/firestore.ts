import { firebase } from "../../firebase";
import { Habit } from "../types";

// const db = firebase.firestore();

// User habits collection structure
interface UserHabit {
  id: string;
  name: string;
  type: "good" | "bad";
  frequency: string;
  icon: string;
  color: string;
  createdAt: Date;
  lastCompleted?: Date;
  streak: number;
  totalCompletions: number;
  totalSkips: number;
}

// Habit completion history structure
interface HabitCompletion {
  date: Date;
  completed: boolean;
  skipped: boolean;
  note?: string;
}

// Create a new user document with initial data
export const createUserDocument = async (
  userId: string,
  userData: { email: string; name: string }
) => {
  try {
    // await db
    //   .collection("users")
    //   .doc(userId)
    //   .set({
    //     ...userData,
    //     createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    //     habits: [],
    //     totalHabits: 0,
    //     totalGoodHabits: 0,
    //     totalBadHabits: 0,
    //   });
    return true;
  } catch (error) {
    console.error("Error creating user document:", error);
    return false;
  }
};

// Add a new habit to user's collection
export const addUserHabit = async (userId: string, habit: Habit) => {
  try {
    const userHabit: UserHabit = {
      id: habit.id,
      name: habit.name,
      type: habit.type,
      frequency: habit.frequency,
      icon: habit.icon,
      color: habit.color,
      createdAt: new Date(),
      streak: 0,
      totalCompletions: 0,
      totalSkips: 0,
    };

    await db
      .collection("users")
      .doc(userId)
      .collection("habits")
      .doc(habit.id)
      .set(userHabit);

    // Update user's habit counts
    // await db
    //   .collection("users")
    //   .doc(userId)
    //   .update({
    //     totalHabits: firebase.firestore.FieldValue.increment(1),
    //     totalGoodHabits:
    //       habit.type === "good"
    //         ? firebase.firestore.FieldValue.increment(1)
    //         : firebase.firestore.FieldValue.increment(0),
    //     totalBadHabits:
    //       habit.type === "bad"
    //         ? firebase.firestore.FieldValue.increment(1)
    //         : firebase.firestore.FieldValue.increment(0),
    //   });

    return true;
  } catch (error) {
    console.error("Error adding user habit:", error);
    return false;
  }
};

// Record habit completion or skip
export const recordHabitCompletion = async (
  userId: string,
  habitId: string,
  date: Date,
  completed: boolean,
  skipped: boolean,
  note?: string
) => {
  try {
    const completion: HabitCompletion = {
      date,
      completed,
      skipped,
      note,
    };

    // Add to completion history
    // await db
    //   .collection("users")
    //   .doc(userId)
    //   .collection("habits")
    //   .doc(habitId)
    //   .collection("completions")
    //   .doc(date.toISOString().split("T")[0])
    //   .set(completion);

    // // Update habit stats
    // const updates: any = {};
    // if (completed) {
    //   updates.totalCompletions = firebase.firestore.FieldValue.increment(1);
    //   updates.lastCompleted = date;
    //   updates.streak = firebase.firestore.FieldValue.increment(1);
    // }
    // if (skipped) {
    //   updates.totalSkips = firebase.firestore.FieldValue.increment(1);
    //   updates.streak = 0;
    // }

    // await db
    //   .collection("users")
    //   .doc(userId)
    //   .collection("habits")
    //   .doc(habitId)
    //   .update(updates);

    return true;
  } catch (error) {
    console.error("Error recording habit completion:", error);
    return false;
  }
};

// Get user's habits
export const getUserHabits = async (userId: string) => {
  try {
    const snapshot = await db
      .collection("users")
      .doc(userId)
      .collection("habits")
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting user habits:", error);
    return [];
  }
};

// Get habit completion history
export const getHabitCompletionHistory = async (
  userId: string,
  habitId: string,
  startDate: Date,
  endDate: Date
) => {
//   try {
//     const snapshot = await db
//       .collection("users")
//       .doc(userId)
//       .collection("habits")
//       .doc(habitId)
//       .collection("completions")
//       .where("date", ">=", startDate)
//       .where("date", "<=", endDate)
//       .get();

//     return snapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));
//   } catch (error) {
//     console.error("Error getting habit completion history:", error);
//     return [];
//   }
};
