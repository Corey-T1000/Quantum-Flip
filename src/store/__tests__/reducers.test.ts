import { configureStore } from '@reduxjs/toolkit';
import { terminalReducer, addEntry, clearEntries } from '../terminalSlice';
import { gameReducer, setLevel, updateGrid } from '../gameSlice';
import { settingsReducer, setColorPalette, toggleHighContrast } from '../settingsSlice';
import { TerminalEntry } from '../../components/terminal/types';

const createTestStore = () => {
  return configureStore({
    reducer: {
      terminal: terminalReducer,
      game: gameReducer,
      settings: settingsReducer
    }
  });
};

describe('Store', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
  });

  describe('Terminal Reducer', () => {
    it('should handle initial state', () => {
      const state = store.getState();
      expect(state.terminal).toEqual({
        entries: []
      });
    });

    it('should handle adding entries', () => {
      const entry: TerminalEntry = {
        timestamp: '12:00:00',
        content: ['Test message'],
        type: 'help'
      };

      store.dispatch(addEntry(entry));
      const state = store.getState();
      expect(state.terminal.entries).toEqual([entry]);
    });

    it('should handle clearing entries', () => {
      const entry: TerminalEntry = {
        timestamp: '12:00:00',
        content: ['Test message'],
        type: 'help'
      };

      store.dispatch(addEntry(entry));
      store.dispatch(clearEntries());
      const state = store.getState();
      expect(state.terminal.entries).toEqual([]);
    });
  });

  describe('Game Reducer', () => {
    it('should handle initial state', () => {
      const state = store.getState();
      expect(state.game).toEqual({
        currentLevel: 0,
        grid: Array(3).fill(null).map(() => Array(3).fill(false)),
        moveCount: 0,
        gameWon: false,
        hintTile: null
      });
    });

    it('should handle setting level', () => {
      store.dispatch(setLevel(1));
      const state = store.getState();
      expect(state.game.currentLevel).toBe(1);
    });

    it('should handle updating grid', () => {
      const newGrid = Array(3).fill(null).map(() => Array(3).fill(true));
      store.dispatch(updateGrid(newGrid));
      const state = store.getState();
      expect(state.game.grid).toEqual(newGrid);
    });
  });

  describe('Settings Reducer', () => {
    it('should handle initial state', () => {
      const state = store.getState();
      expect(state.settings).toEqual({
        colorPaletteIndex: 0,
        highContrastMode: false,
        volume: 1,
        debugMode: false
      });
    });

    it('should handle setting color palette', () => {
      store.dispatch(setColorPalette(1));
      const state = store.getState();
      expect(state.settings.colorPaletteIndex).toBe(1);
    });

    it('should handle toggling high contrast', () => {
      store.dispatch(toggleHighContrast());
      const state = store.getState();
      expect(state.settings.highContrastMode).toBe(true);
    });
  });
});
