import { Mood, Habit } from "./types";

export const MOODS: Mood[] = [
  { emoji: "😞", label: "Słabo", score: 1, color: "#E53E3E" },
  { emoji: "😐", label: "Średnio", score: 2, color: "#DD6B20" },
  { emoji: "🙂", label: "Dobrze", score: 3, color: "#3182CE" },
  { emoji: "🤩", label: "Świetnie", score: 4, color: "#38A169" },
];

export const INITIAL_HABITS: Habit[] = [
  { id: "1", title: "🚰 Picie wody (2L)" },
  { id: "2", title: "🏃‍♂️ Trening / Spacer" },
  { id: "3", title: "📖 Czytanie książki" },
  { id: "4", title: "🧘‍♂️ Medytacja / Relaks" },
];
