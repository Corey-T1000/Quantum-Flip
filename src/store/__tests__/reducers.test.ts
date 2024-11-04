import { configureStore } from '@reduxjs/toolkit';
import { terminalReducer, addEntry, clearEntries } from '../terminalSlice';
import { gameReducer, setLevel, updateGrid, setGameWon } from '../gameSlice';
import { settingsReducer, setColorPalette, toggleHighContrast, setVolume } from '../settingsSlice';
import { TerminalEntry } from '../../components/terminal/types';
import { getLevel } from '../../utils/game/levelData';

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
        grid: getLevel(0),
        moveCount: 0,
        gameWon: false,
        hintTile: null,
        hintLevel: 'NONE',
        hintCharges: 3,
        hintCooldown: 0,
        lastHintTime: null
      });
    });

    it('should handle setting level', () => {
      store.dispatch(setLevel(1));
      const state = store.getState();
      expect(state.game.currentLevel).toBe(1);
      expect(state.game.moveCount).toBe(0);
      expect(state.game.gameWon).toBe(false);
      expect(state.game.hintTile).toBeNull();
      // Don't test exact grid content as it may vary
      expect(state.game.grid).toBeDefined();
      expect(state.game.grid.length).toBe(3); // Level 1 should be 3x3
    });

    it('should handle updating grid', () => {
      const newGrid = [
        [true, true, true],
        [true, true, true],
        [true, true, true]
      ];
      store.dispatch(updateGrid(newGrid));
      const state = store.getState();
      expect(state.game.grid).toEqual(newGrid);
      expect(state.game.moveCount).toBe(1);
    });

    it('should handle setting game won', () => {
      store.dispatch(setGameWon(true));
      const state = store.getState();
      expect(state.game.gameWon).toBe(true);
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
      let state = store.getState();
      expect(state.settings.highContrastMode).toBe(true);

      store.dispatch(toggleHighContrast());
      state = store.getState();
      expect(state.settings.highContrastMode).toBe(false);
    });

    it('should handle setting volume', () => {
      store.dispatch(setVolume(0.5));
      const state = store.getState();
      expect(state.settings.volume).toBe(0.5);
    });

    it('should clamp volume between 0 and 1', () => {
      store.dispatch(setVolume(-0.5));
      let state = store.getState();
      expect(state.settings.volume).toBe(0);

      store.dispatch(setVolume(1.5));
      state = store.getState();
      expect(state.settings.volume).toBe(1);
    });
  });
});
