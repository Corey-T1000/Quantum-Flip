import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  colorPaletteIndex: number;
  highContrastMode: boolean;
  volume: number;
  debugMode: boolean;
}

const initialState: SettingsState = {
  colorPaletteIndex: 0,
  highContrastMode: false,
  volume: 1,
  debugMode: false
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setColorPalette: (state, action: PayloadAction<number>) => {
      state.colorPaletteIndex = action.payload;
    },
    toggleHighContrast: (state) => {
      state.highContrastMode = !state.highContrastMode;
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = action.payload;
    },
    toggleDebugMode: (state) => {
      state.debugMode = !state.debugMode;
    }
  }
});

export const { setColorPalette, toggleHighContrast, setVolume, toggleDebugMode } = settingsSlice.actions;
export const settingsReducer = settingsSlice.reducer;