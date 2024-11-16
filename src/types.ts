export type BoardState = boolean[][];

export interface SolutionStep {
  row: number;
  col: number;
  step: number;
}

export interface GeneratedBoard {
  board: BoardState;
  solution: [number, number][];
}

export interface StoryProgress {
  completedLevels: number[];
  averageMovesPerLevel: { [key: number]: number };
  lastPlayedLevel: number;
  totalPlayTime: number;
  lastPlayed: string;
  oracleUses?: number;
  relationship?: CharacterRelationship;
  revelationsUnlocked?: string[];
  pathChosen?: 'independent' | 'collaborative' | 'symbiotic' | 'dependent';
}

export interface CharacterRelationship {
  trust: number;
  understanding: number;
  synergy: number;
}

export interface Message {
  id: number;
  text: string;
  status: string;
  timestamp: string;
  type: 'story' | 'system' | 'mystery';
}