export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 - Monday, 6 - Sunday

export interface Habit {
  id: string;
  name: string;
  type: "good" | "bad";
  frequency: WeekDay[];
  icon: string;
  color: string;
  isCompleted?: boolean;
  streak?: number;
  totalCompletions?: number;
  totalSkips?: number;
  lastCompleted?: Date;
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
