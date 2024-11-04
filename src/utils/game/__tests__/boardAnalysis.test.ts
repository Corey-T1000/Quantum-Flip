import { scanAlignment, analyzeBoard, findNextMove } from '../boardAnalysis';
import { BoardState } from '../../../types';

describe('Board Analysis', () => {
  describe('scanAlignment', () => {
    it('returns true for all-true grid', () => {
      const grid: BoardState = [
        [true, true, true],
        [true, true, true],
        [true, true, true]
      ];
      expect(scanAlignment(grid)).toBe(true);
    });

    it('returns true for all-false grid', () => {
      const grid: BoardState = [
        [false, false, false],
        [false, false, false],
        [false, false, false]
      ];
      expect(scanAlignment(grid)).toBe(true);
    });

    it('returns false for mixed grid', () => {
      const grid: BoardState = [
        [true, false, true],
        [false, true, false],
        [true, false, true]
      ];
      expect(scanAlignment(grid)).toBe(false);
    });
  });

  describe('analyzeBoard', () => {
    it('finds optimal moves in simple cases', () => {
      const grid: BoardState = [
        [true, true, false],
        [true, true, true],
        [true, true, false]
      ];
      const analysis = analyzeBoard(grid);
      expect(analysis.bestMove).toBeTruthy();
      expect(analysis.affectedAreas.length).toBeGreaterThan(0);
      expect(analysis.moveCount).toBeGreaterThan(0);
    });

    it('returns null bestMove for aligned grid', () => {
      const grid: BoardState = [
        [true, true, true],
        [true, true, true],
        [true, true, true]
      ];
      const analysis = analyzeBoard(grid);
      expect(analysis.bestMove).toBeNull();
      expect(analysis.affectedAreas).toHaveLength(0);
      expect(analysis.moveCount).toBe(0);
    });

    it('prefers moves that affect more tiles', () => {
      const grid: BoardState = [
        [true, false, true],
        [false, true, false],
        [true, false, true]
      ];
      const analysis = analyzeBoard(grid);
      expect(analysis.bestMove).toEqual([1, 1]); // Center move affects most tiles
    });

    it('calculates correct move count', () => {
      const grid: BoardState = [
        [true, false, true],
        [false, true, false],
        [true, false, true]
      ];
      const analysis = analyzeBoard(grid);
      expect(analysis.moveCount).toBe(9); // All positions can improve alignment
    });
  });

  describe('findNextMove', () => {
    it('returns null for aligned grid', () => {
      const grid: BoardState = [
        [true, true, true],
        [true, true, true],
        [true, true, true]
      ];
      expect(findNextMove(grid)).toBeNull();
    });

    it('finds move to maximize aligned tiles', () => {
      const grid: BoardState = [
        [true, true, false],
        [true, true, true],
        [true, true, false]
      ];
      const move = findNextMove(grid);
      expect(move).toBeTruthy();
      // Either [0, 2] or [2, 2] is valid - both optimize alignment
      expect(move![1]).toBe(2); // Column should be 2
      expect(move![0]).toBeGreaterThanOrEqual(0);
      expect(move![0]).toBeLessThanOrEqual(2);
    });

    it('considers cross pattern effect', () => {
      const grid: BoardState = [
        [false, true, false],
        [true, false, true],
        [false, true, false]
      ];
      expect(findNextMove(grid)).toEqual([1, 1]); // Center move is optimal
    });

    it('prefers center moves when equally optimal', () => {
      const grid: BoardState = [
        [false, false, false],
        [false, false, false],
        [false, false, false]
      ];
      expect(findNextMove(grid)).toEqual([1, 1]); // Center move for empty grid
    });
  });
});
