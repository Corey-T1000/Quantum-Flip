import { engageNode, getNeighbors, countMatchingNeighbors } from '../nodeOperations';
import { BoardState } from '../../../types';

describe('Node Operations', () => {
  describe('engageNode', () => {
    it('toggles center node and all adjacent nodes', () => {
      const initialGrid: BoardState = [
        [false, false, false],
        [false, false, false],
        [false, false, false]
      ];

      const expected: BoardState = [
        [false, true, false],
        [true, true, true],
        [false, true, false]
      ];

      expect(engageNode(initialGrid, 1, 1)).toEqual(expected);
    });

    it('toggles corner node and valid adjacent nodes', () => {
      const initialGrid: BoardState = [
        [false, false, false],
        [false, false, false],
        [false, false, false]
      ];

      const expected: BoardState = [
        [true, true, false],
        [true, false, false],
        [false, false, false]
      ];

      expect(engageNode(initialGrid, 0, 0)).toEqual(expected);
    });

    it('toggles edge node and valid adjacent nodes', () => {
      const initialGrid: BoardState = [
        [false, false, false],
        [false, false, false],
        [false, false, false]
      ];

      const expected: BoardState = [
        [false, true, false],
        [true, true, true],
        [false, true, false]
      ];

      expect(engageNode(initialGrid, 1, 1)).toEqual(expected);
    });

    it('works with different grid sizes', () => {
      const initialGrid: BoardState = [
        [false, false],
        [false, false]
      ];

      const expected: BoardState = [
        [true, true],
        [true, false]
      ];

      expect(engageNode(initialGrid, 0, 0)).toEqual(expected);
    });

    it('throws error for invalid indices', () => {
      const grid: BoardState = [
        [false, false],
        [false, false]
      ];

      expect(() => engageNode(grid, -1, 0)).toThrow('Invalid row or column index');
      expect(() => engageNode(grid, 0, -1)).toThrow('Invalid row or column index');
      expect(() => engageNode(grid, 2, 0)).toThrow('Invalid row or column index');
      expect(() => engageNode(grid, 0, 2)).toThrow('Invalid row or column index');
    });
  });

  describe('getNeighbors', () => {
    it('returns all valid neighbors for center node', () => {
      const grid: BoardState = [
        [false, false, false],
        [false, false, false],
        [false, false, false]
      ];

      const neighbors = getNeighbors(grid, 1, 1);
      expect(neighbors).toEqual([
        [0, 1],
        [2, 1],
        [1, 0],
        [1, 2]
      ]);
    });

    it('returns valid neighbors for corner node', () => {
      const grid: BoardState = [
        [false, false, false],
        [false, false, false],
        [false, false, false]
      ];

      const neighbors = getNeighbors(grid, 0, 0);
      expect(neighbors).toEqual([
        [1, 0],
        [0, 1]
      ]);
    });
  });

  describe('countMatchingNeighbors', () => {
    it('counts neighbors with matching state', () => {
      const grid: BoardState = [
        [true, true, false],
        [true, true, false],
        [false, false, false]
      ];

      expect(countMatchingNeighbors(grid, 0, 0)).toBe(2); // Two true neighbors
      expect(countMatchingNeighbors(grid, 2, 2)).toBe(2); // Two false neighbors
    });
  });
});
