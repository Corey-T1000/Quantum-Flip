// Board Types
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

// Progress Types
export interface StoryProgress {
  completedLevels: number[];
  averageMovesPerLevel: { [key: number]: number };
  lastPlayedLevel: number;
  totalPlayTime: number;
  lastPlayed: string;
  oracleUses: number;
  relationship: CharacterRelationship;
  revelationsUnlocked: string[];
  pathChosen?: 'independent' | 'collaborative' | 'symbiotic' | 'dependent';
}

export interface CharacterRelationship {
  trust: number;
  understanding: number;
  synergy: number;
}

// Story Types
export type StoryBranch = 'independent' | 'collaborative' | 'symbiotic';
export type StoryPath = StoryBranch;

export interface DialogueNode {
  id: string;
  text: string;
  type?: string;
  choices?: string[];
  requirements?: {
    previousChoice?: string;
    minTrust?: number;
    revelations?: string[];
    pathProgress?: string;
    completedLevels?: number;
  };
  effects?: {
    trustDelta?: number;
    understanding?: number;
    synergy?: number;
    pathProgress?: string;
    addRevelation?: string;
  };
}

// UI Types
export interface Message {
  id: number;
  text: string;
  status: string;
  timestamp: string;
  type: 'story' | 'system' | 'mystery' | 'gameplay';
}

export interface ColorPalette {
  light: string;
  dark: string;
  lightHC: string;
  darkHC: string;
  text: string;
}

// Game Configuration Types
export interface LevelConfig {
  size: number;
  complexity: number;
}

// AI Narrator Types
export interface NarrativeContext {
  currentLevel: number;
  moveCount: number;
  relationship: CharacterRelationship;
  pathChosen?: string;
}
