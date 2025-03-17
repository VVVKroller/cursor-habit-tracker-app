export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 - Monday, 6 - Sunday

export interface Habit {
  id: string | number;
  name: string;
  description?: string;
  type: "good" | "bad";
  frequency: WeekDay[];
  isCompleted: boolean;
  daysCompleted: number;
  completionHistory: {
    [date: string]: boolean; // Format: "YYYY-MM-DD"
  };
}

export interface DayItem {
  fullDate: Date;
  label: string;
}

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  AddHabit: {
    type: "good" | "bad";
  };
  settings: undefined;
  analytics: undefined;
};

export type SetHabitsType = React.Dispatch<React.SetStateAction<Habit[]>>;
