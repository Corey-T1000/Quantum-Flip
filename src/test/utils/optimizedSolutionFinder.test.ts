import { describe, it, expect } from 'vitest';
import { findOptimalSolution, validateSolution } from '../../utils/optimizedSolutionFinder';
import { BoardState } from '../../types';

describe('Optimized Solution Finder', () => {
  describe('findOptimalSolution', () => {
    it('should find solution for simple 2x2 board', () => {
      const board: BoardState = [
        [true, false],
        [true, true]
      ];
      
      const solution = findOptimalSolution(board);
      expect(solution).not.toBeNull();
      expect(Array.isArray(solution)).toBe(true);
      
      if (solution) {
        expect(validateSolution(board, solution)).toBe(true);
      }
    });

    it('should find solution for 3x3 board', () => {
      const board: BoardState = [
        [true, false, true],
        [false, true, false],
        [true, false, true]
      ];
      
      const solution = findOptimalSolution(board);
      expect(solution).not.toBeNull();
      expect(Array.isArray(solution)).toBe(true);
      
      if (solution) {
        expect(validateSolution(board, solution)).toBe(true);
      }
    });

    it('should return null for unsolvable board', () => {
      const board: BoardState = [
        [true, false],
        [false, true]
      ];
      
      const solution = findOptimalSolution(board, 1); // Set max depth to 1 to make it unsolvable
      expect(solution).toBeNull();
    });

    it('should use cached solution for identical boards', () => {
      const board: BoardState = [
        [true, false],
        [true, true]
      ];
      
      const firstSolution = findOptimalSolution(board);
      const secondSolution = findOptimalSolution(board);
      
      expect(firstSolution).toEqual(secondSolution);
    });
  });

  describe('validateSolution', () => {
    it('should validate correct solution', () => {
      const board: BoardState = [
        [true, false],
        [true, true]
      ];
      
      const solution = findOptimalSolution(board);
      expect(solution).not.toBeNull();
      
      if (solution) {
        expect(validateSolution(board, solution)).toBe(true);
      }
    });

    it('should invalidate incorrect solution', () => {
      const board: BoardState = [
        [true, false],
        [true, true]
      ];
      
      const incorrectSolution = [
        { row: 0, col: 0, step: 0 },
        { row: 1, col: 1, step: 1 }
      ];
      
      expect(validateSolution(board, incorrectSolution)).toBe(false);
    });
  });
});
