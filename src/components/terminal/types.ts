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

export interface TerminalLineProps {
  timestamp: string;
  content: string | string[];
  type?: TerminalEntryType;
  colorPalette: ColorPalette;
}

export interface TerminalProps {
  entries: TerminalEntry[];
  levelName: string;
  moveCount: number;
  tutorialMessage: string | null;
  debugMode: boolean;
  progress: number;
  dominantState: 'light' | 'dark';
  colorPalette: ColorPalette;
  onReset: () => void;
  onRequestHint: () => void;
  onShowHelp: () => void;
  onOpenSettings: () => void;
  onToggleDebug?: () => void;
  onNextLevel?: () => void;
  onResetAllLevels?: () => void;
  hintTile: [number, number] | null;
}

export interface StatusBarProps {
  levelName: string;
  moveCount: number;
  tutorialMessage: string | null;
  debugMode: boolean;
  progress: number;
  dominantState: 'light' | 'dark';
  colorPalette: ColorPalette;
  onReset: () => void;
  onRequestHint: () => void;
  onShowHelp: () => void;
  onOpenSettings: () => void;
  onToggleDebug?: () => void;
  onNextLevel?: () => void;
  onResetAllLevels?: () => void;
  hintTile: [number, number] | null;
}
