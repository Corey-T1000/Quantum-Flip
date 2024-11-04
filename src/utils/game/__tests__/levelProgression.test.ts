import { configureStore } from '@reduxjs/toolkit';
import { gameReducer, setLevel, updateGrid, setGameWon, HintLevel } from '../../../store/gameSlice';
import { getLevel, getLevelSolution } from '../levelData';
import { engageNode } from '../nodeOperations';
import { BoardState } from '../../../types';

const createTestStore = () => {
  return configureStore({
    reducer: {
      game: gameReducer
    }
  });
};

describe('Level Progression Integration', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
  });

  describe('Tutorial Level Sequence (0-4)', () => {
    it('starts at level 0 with correct initial state', () => {
      const state = store.getState();
      expect(state.game.currentLevel).toBe(0);
      expect(state.game.grid).toHaveLength(3);
      expect(state.game.moveCount).toBe(0);
      expect(state.game.gameWon).toBe(false);
      expect(state.game.hintLevel).toBe(HintLevel.NONE);
    });

    it('progresses through tutorial levels with correct patterns', () => {
      // Test each tutorial level
      for (let level = 0; level <= 4; level++) {
        store.dispatch(setLevel(level));
        const state = store.getState();
        
        // Verify board size
        expect(state.game.grid).toHaveLength(3);
        state.game.grid.forEach((row: boolean[]) => expect(row).toHaveLength(3));
        
        // Get and verify solution
        const solution = getLevelSolution(level);
        let testBoard = JSON.parse(JSON.stringify(state.game.grid)) as BoardState;
        
        // Apply solution moves
        solution.forEach(([row, col]) => {
          testBoard = engageNode(testBoard, row, col);
          store.dispatch(updateGrid(testBoard));
        });
        
        // Verify win condition
        const allFalse = testBoard.every((row: boolean[]) => row.every((cell: boolean) => !cell));
        expect(allFalse).toBe(true);
        store.dispatch(setGameWon(true));
        
        // Verify state after win
        const finalState = store.getState();
        expect(finalState.game.gameWon).toBe(true);
        expect(finalState.game.moveCount).toBe(solution.length);
      }
    });

    it('maintains hint charges through tutorial progression', () => {
      for (let level = 0; level <= 4; level++) {
        store.dispatch(setLevel(level));
        const state = store.getState();
        expect(state.game.hintCharges).toBe(3); // Initial hint charges
      }
    });
  });

  describe('Regular Level Progression (5+)', () => {
    it('increases board size at appropriate intervals', () => {
      const levelSizeMap: Record<number, number> = {
        5: 3,  // First regular level
        10: 4, // Size increase
        15: 5, // Size increase
        20: 6  // Maximum size
      };

      Object.entries(levelSizeMap).forEach(([level, expectedSize]) => {
        store.dispatch(setLevel(Number(level)));
        const state = store.getState();
        expect(state.game.grid).toHaveLength(expectedSize);
        state.game.grid.forEach((row: boolean[]) => expect(row).toHaveLength(expectedSize));
      });
    });

    it('maintains minimum solution length based on level progression', () => {
      const levels = [5, 10, 15, 20];
      
      levels.forEach(level => {
        const solution = getLevelSolution(level);
        const minMoves = Math.min(3 + Math.floor(level / 5), 6);
        const maxMoves = Math.min(minMoves + 2, 8);
        
        expect(solution.length).toBeGreaterThanOrEqual(minMoves);
        expect(solution.length).toBeLessThanOrEqual(maxMoves);
      });
    });

    it('replenishes hint charges on new level', () => {
      // Complete level 5
      store.dispatch(setLevel(5));
      let state = store.getState();
      expect(state.game.hintCharges).toBe(3);

      // Use all hints
      while (state.game.hintCharges > 0) {
        store.dispatch({ type: 'game/useHint' });
        state = store.getState();
      }
      expect(state.game.hintCharges).toBe(0);

      // Progress to next level
      store.dispatch(setLevel(6));
      state = store.getState();
      expect(state.game.hintCharges).toBe(3);
    });
  });

  describe('Game State Management', () => {
    it('tracks moves correctly during gameplay', () => {
      store.dispatch(setLevel(0));
      const solution = getLevelSolution(0);
      let board = getLevel(0);

      solution.forEach(([row, col], index) => {
        board = engageNode(board, row, col);
        store.dispatch(updateGrid(board));
        const state = store.getState();
        expect(state.game.moveCount).toBe(index + 1);
      });
    });

    it('resets state appropriately on level change', () => {
      // Complete level 0
      store.dispatch(setLevel(0));
      const solution = getLevelSolution(0);
      let board = getLevel(0);
      
      solution.forEach(([row, col]) => {
        board = engageNode(board, row, col);
        store.dispatch(updateGrid(board));
      });
      store.dispatch(setGameWon(true));

      // Change to level 1
      store.dispatch(setLevel(1));
      const state = store.getState();
      expect(state.game.currentLevel).toBe(1);
      expect(state.game.moveCount).toBe(0);
      expect(state.game.gameWon).toBe(false);
      expect(state.game.hintLevel).toBe(HintLevel.NONE);
      expect(state.game.hintCharges).toBe(3);
    });
  });
});
