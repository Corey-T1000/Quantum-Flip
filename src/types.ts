import { ColorPalette } from './components/terminal/types';
import { HintLevel } from './store/gameSlice';

export interface GameBoardProps {
  grid: boolean[][];
  onTileClick: (row: number, col: number) => void;
  hintTile: [number, number] | null;
  hintLevel: HintLevel;
  affectedAreas: [number, number][];
  possibleMoveCount: number;
  colorPalette: ColorPalette;
  debugMode: boolean;
  solution: [number, number][];
  onHintUsed: () => void;
}

export interface HintState {
  level: HintLevel;
  tile: [number, number] | null;
  charges: number;
  cooldown: number;
}

export interface TerminalProps {
  currentLevel: number;
  moveCount: number;
  onNextLevel: () => void;
  onResetLevel: () => void;
  onOpenSettings: () => void;
  onRequestHint: () => void;
  gameWon: boolean;
  onResetAllLevels?: () => void;
  hintTile: [number, number] | null;
}

export interface Settings {
  colorPalette: ColorPalette;
  volume: number;
}

export interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  colorPalettes: ColorPalette[];
  textColor: string;
}

export interface AudioManagerHook {
  playTileInteractionSound: () => void;
  playLevelCompletionSound: () => void;
  isAudioLoaded: boolean;
}

export type Coordinate = [number, number];

export interface HintAnalysis {
  moveCount: number;
  affectedAreas: Coordinate[];
  bestMove: Coordinate | null;
}

export type BoardState = boolean[][];

export interface LevelData {
  board: BoardState;
  solution: Coordinate[];
}

export interface ConnectedTerminalHandle {
  addTerminalEntry: (entry: {
    timestamp: string;
    content: string | string[];
    type?: 'help' | 'error' | 'success';
  }) => void;
}

export interface TerminalState {
  debugMode: boolean;
  entries: string[];
}

export interface SettingsState {
  settings: {
    colorPalette: ColorPalette;
    volume: number;
  };
}
