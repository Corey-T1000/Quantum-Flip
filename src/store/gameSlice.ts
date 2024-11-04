import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getLevel } from '../utils/game/levelData';

export enum HintLevel {
  NONE = 'NONE',
  COUNT = 'COUNT',
  AREA = 'AREA',
  SPECIFIC = 'SPECIFIC'
}

interface GameState {
  currentLevel: number;
  grid: boolean[][];
  moveCount: number;
  gameWon: boolean;
  hintTile: [number, number] | null;
  hintLevel: HintLevel;
  hintCharges: number;
  hintCooldown: number;
  lastHintTime: number | null;
}

const INITIAL_HINT_CHARGES = 3;
const HINT_COOLDOWN_MS = 30000; // 30 seconds

const initialLevel = getLevel(0);
const initialState: GameState = {
  currentLevel: 0,
  grid: initialLevel,
  moveCount: 0,
  gameWon: false,
  hintTile: null,
  hintLevel: HintLevel.NONE,
  hintCharges: INITIAL_HINT_CHARGES,
  hintCooldown: 0,
  lastHintTime: null
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setLevel: (state, action: PayloadAction<number>) => {
      state.currentLevel = action.payload;
      state.grid = getLevel(action.payload);
      state.moveCount = 0;
      state.gameWon = false;
      state.hintTile = null;
      state.hintLevel = HintLevel.NONE;
      // Replenish hint charges on new level
      state.hintCharges = INITIAL_HINT_CHARGES;
    },
    updateGrid: (state, action: PayloadAction<boolean[][]>) => {
      state.grid = action.payload;
      state.moveCount += 1;
    },
    setGameWon: (state, action: PayloadAction<boolean>) => {
      state.gameWon = action.payload;
    },
    setHintTile: (state, action: PayloadAction<[number, number] | null>) => {
      state.hintTile = action.payload;
    },
    setHintLevel: (state, action: PayloadAction<HintLevel>) => {
      state.hintLevel = action.payload;
    },
    useHint: (state) => {
      if (state.hintCharges > 0 && state.lastHintTime === null || 
          (state.lastHintTime && Date.now() - state.lastHintTime >= HINT_COOLDOWN_MS)) {
        state.hintCharges--;
        state.lastHintTime = Date.now();
        // Progress to next hint level
        switch (state.hintLevel) {
          case HintLevel.NONE:
            state.hintLevel = HintLevel.COUNT;
            break;
          case HintLevel.COUNT:
            state.hintLevel = HintLevel.AREA;
            break;
          case HintLevel.AREA:
            state.hintLevel = HintLevel.SPECIFIC;
            break;
          default:
            break;
        }
      }
    },
    updateHintCooldown: (state) => {
      if (state.lastHintTime) {
        const elapsed = Date.now() - state.lastHintTime;
        state.hintCooldown = Math.max(0, HINT_COOLDOWN_MS - elapsed);
      }
    },
    resetLevel: (state) => {
      const levelData = getLevel(state.currentLevel);
      state.grid = levelData;
      state.moveCount = 0;
      state.gameWon = false;
      state.hintTile = null;
      state.hintLevel = HintLevel.NONE;
    }
  }
});

export const { 
  setLevel, 
  updateGrid, 
  setGameWon, 
  setHintTile, 
  setHintLevel,
  useHint,
  updateHintCooldown,
  resetLevel 
} = gameSlice.actions;

export const gameReducer = gameSlice.reducer;
