export interface ColorPalette {
  light: string;
  dark: string;
  darkest: string;
  lightHC: string;
  darkHC: string;
  text: string;
}

export type TerminalEntryType = 'help' | 'error' | 'success';

export interface TerminalEntry {
  timestamp: string;
  content: string[];
  type?: TerminalEntryType;
}

export interface StatusBarProps {
  levelName: string;
  moveCount: number;
  tutorialMessage: string | null;
  debugMode: boolean;
  progress: number;
  dominantState: 'light' | 'dark';
  colorPalette: ColorPalette;
}
