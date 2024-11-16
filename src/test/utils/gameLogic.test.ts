import { describe, it, expect } from 'vitest';
import { getInitialBoardState, scanAlignment, getLevelInfo } from '../../utils/gameLogic';
import { BoardState } from '../../types';

describe('Game Logic', () => {
  describe('getInitialBoardState', () => {
    it('should return a valid board state for level 0', () => {
      const board = getInitialBoardState(0);
      expect(Array.isArray(board)).toBe(true);
      expect(board.length).toBeGreaterThan(0);
      expect(Array.isArray(board[0])).toBe(true);
    });

    it('should throw error for invalid level', () => {
      expect(() => getInitialBoardState(-1)).toThrow('Invalid level');
      expect(() => getInitialBoardState(100)).toThrow('Invalid level');
    });
  });

  describe('scanAlignment', () => {
    it('should return true for aligned board', () => {
      const board: BoardState = [
        [true, true],
        [true, true]
      ];
      expect(scanAlignment(board)).toBe(true);
    });

    it('should return false for unaligned board', () => {
      const board: BoardState = [
        [true, false],
        [true, true]
      ];
      expect(scanAlignment(board)).toBe(false);
    });
  });

  describe('getLevelInfo', () => {
    it('should return correct size and complexity for early levels', () => {
      const info = getLevelInfo(0);
      expect(info).toEqual({ size: 3, complexity: 1.0 });
    });

    it('should return correct size and complexity for later levels', () => {
      const info = getLevelInfo(15);
      expect(info).toEqual({ size: 5, complexity: 1.5 });
    });
  });
});
