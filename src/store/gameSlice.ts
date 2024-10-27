import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GameState {
  currentLevel: number;
  grid: boolean[][];
  moveCount: number;
  gameWon: boolean;
  hintTile: [number, number] | null;
}

const initialState: GameState = {
  currentLevel: 0,
  grid: Array(3).fill(null).map(() => Array(3).fill(false)),
  moveCount: 0,
  gameWon: false,
  hintTile: null
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setLevel: (state, action: PayloadAction<number>) => {
      state.currentLevel = action.payload;
      state.moveCount = 0;
      state.gameWon = false;
      state.hintTile = null;
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
    resetLevel: (state) => {
      state.grid = Array(state.grid.length).fill(null).map(() => Array(state.grid[0].length).fill(false));
      state.moveCount = 0;
      state.gameWon = false;
      state.hintTile = null;
    }
  }
});

export const { setLevel, updateGrid, setGameWon, setHintTile, resetLevel } = gameSlice.actions;
export const gameReducer = gameSlice.reducer;
