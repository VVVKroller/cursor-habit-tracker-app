export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 - Monday, 6 - Sunday

export interface Habit {
  id: string;
  name: string;
  description?: string;
  type: "good" | "bad";
  daysCompleted: number;
  frequency: WeekDay[]; // Изменяем тип с "daily" на массив дней недели
  isCompleted: boolean;
  goal: number;
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
};
