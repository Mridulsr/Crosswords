export type GameMode = "pvp" | "group" | "computer";
export type Position = "start" | "end";
export type Difficulty = "easy" | "medium" | "hard";

export interface LevelConfig {
  levelNumber: number;
  name: string;
  targetScore: number;
  timeLimitSec: number;
  obstaclesCount: number;
  aiDifficulty: Difficulty;
  description: string;
}

export interface Player {
  id: string;
  name: string;
  color: string;
  avatar: string;
  score: number;
  isComputer: boolean;
  totalTurnTime: number; // in milliseconds
  movesCount: number;
  wordsFormed: string[];
}

export interface MoveLog {
  id: string;
  player: { name: string; color: string; isComputer: boolean };
  letter: string;
  position?: Position;
  boxIdx?: number;
  resultingChain?: string[];
  boardState?: (string | null)[];
  formedWord?: string;
  pointsEarned: number;
  timeSpentSec: number;
  ruleTriggered?: string; // e.g. "S Suffix Rule Block"
}

export interface GameSettings {
  mode: GameMode;
  difficulty: Difficulty;
  timeLimitSec: number; // 0 for no limit
  playerCount: number;
}

export interface DictionaryResult {
  isValid: boolean;
  word: string;
  partOfSpeech?: string;
  definition: string;
  funFact?: string;
  reason?: string;
}

export interface HintSuggestion {
  suggestedWord: string;
  howToBuild: string;
  points: number;
}
