export type Mood = {
  emoji: string;
  label: string;
  score: number;
  color: string;
};

export type Habit = {
  id: string;
  title: string;
  isCustom?: boolean;
};

export type LogEntry = {
  date: string;
  mood: number;
  habits: string[];
  note: string;
  waterMl?: number;
};
