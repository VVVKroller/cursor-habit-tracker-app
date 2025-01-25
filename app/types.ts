export interface Habit {
  id: number;
  name: string;
  daysCompleted: number;
  description: string;
  type: "good" | "bad";
  frequency: "daily" | "weekly";
  isCompleted?: boolean;
  goal?: number;
}

export interface DayItem {
  fullDate: Date;
  label: string;
}

type RootStackParamList = {
  settings: undefined;
  Home: undefined;
  AddHabit: {
    type: "good" | "bad";
  };
  friends: undefined;
  // ... other screens
};
