import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TerminalEntry } from '../components/terminal/types';

interface TerminalState {
  entries: TerminalEntry[];
}

const initialState: TerminalState = {
  entries: []
};

export const terminalSlice = createSlice({
  name: 'terminal',
  initialState,
  reducers: {
    addEntry: (state, action: PayloadAction<TerminalEntry>) => {
      state.entries.push(action.payload);
    },
    clearEntries: (state) => {
      state.entries = [];
    }
  }
});

export const { addEntry, clearEntries } = terminalSlice.actions;
export const terminalReducer = terminalSlice.reducer;
