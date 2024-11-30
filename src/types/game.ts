export type Difficulty = "easy" | "medium" | "hard";

export interface HistoryItem {
  word: string;
  explanation: string;
  emoji: string;
  isError?: boolean;
}

export interface LeaderboardEntry {
  playerName: string;
  score: number;
  difficulty: Difficulty;
  date: string;
  words: string[];
  language: string;
}