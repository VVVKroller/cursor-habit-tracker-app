export interface Habit {
  id: number;
  name: string;
  daysCompleted: number;
  description: string;
  type: "good" | "bad";
  frequency: "daily" | "weekly";
  goal?: number;
}

export interface DayItem {
  fullDate: Date;
  label: string;
}
