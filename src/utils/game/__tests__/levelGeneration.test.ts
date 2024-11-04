import { generateLevel, generateAllLevels } from '../levelGeneration';
import { engageNode } from '../nodeOperations';
import { BoardState, Coordinate } from '../../../types';

describe('Level Generation', () => {
  describe('Tutorial Levels (0-4)', () => {
    it('generates level 0 with single center move', () => {
      const level = generateLevel(0);
      expect(level.solution).toHaveLength(1);
      expect(level.solution[0]).toEqual([1, 1]);
      expect(level.board).toHaveLength(3);
      expect(level.board[0]).toHaveLength(3);
    });

    it('generates level 1 with two diagonal moves', () => {
      const level = generateLevel(1);
      expect(level.solution).toHaveLength(2);
      expect(level.solution).toEqual([[0, 0], [2, 2]]);
    });

    it('generates level 2 with triangle pattern', () => {
      const level = generateLevel(2);
      expect(level.solution).toHaveLength(3);
      expect(level.solution).toEqual([[0, 0], [0, 2], [2, 1]]);
    });

    it('generates level 3 with diagonal pattern', () => {
      const level = generateLevel(3);
      expect(level.solution).toHaveLength(3);
      expect(level.solution).toEqual([[0, 0], [1, 1], [2, 2]]);
    });

    it('generates level 4 with cross pattern', () => {
      const level = generateLevel(4);
      expect(level.solution).toHaveLength(3);
      expect(level.solution).toEqual([[1, 1], [0, 1], [2, 1]]);
    });

    it('ensures tutorial levels are always 3x3', () => {
      for (let i = 0; i <= 4; i++) {
        const level = generateLevel(i);
        expect(level.board).toHaveLength(3);
        level.board.forEach((row: boolean[]) => {
          expect(row).toHaveLength(3);
        });
      }
    });
  });

  describe('Regular Levels (5+)', () => {
    it('increases board size with level progression', () => {
      const level5 = generateLevel(5);
      const level10 = generateLevel(10);
      const level20 = generateLevel(20);

      expect(level5.board).toHaveLength(3);
      expect(level10.board).toHaveLength(4);
      expect(level20.board).toHaveLength(6);
    });

    it('generates valid solutions within board boundaries', () => {
      for (let level = 5; level < 25; level++) {
        const { board, solution } = generateLevel(level);
        const size = board.length;

        solution.forEach(([row, col]: Coordinate) => {
          expect(row).toBeLessThan(size);
          expect(col).toBeLessThan(size);
          expect(row).toBeGreaterThanOrEqual(0);
          expect(col).toBeGreaterThanOrEqual(0);
        });
      }
    });

    it('increases minimum moves with level progression', () => {
      const level5 = generateLevel(5);
      const level15 = generateLevel(15);
      const level25 = generateLevel(25);

      expect(level5.solution.length).toBeGreaterThanOrEqual(3);
      expect(level15.solution.length).toBeGreaterThanOrEqual(4);
      expect(level25.solution.length).toBeGreaterThanOrEqual(5);
    });

    it('ensures solution moves are unique', () => {
      for (let level = 5; level < 15; level++) {
        const { solution } = generateLevel(level);
        const positions = new Set(solution.map(([row, col]: Coordinate) => `${row},${col}`));
        expect(positions.size).toBe(solution.length);
      }
    });
  });

  describe('Board Generation', () => {
    it('creates correct initial board state from solution', () => {
      const level = generateLevel(5);
      let testBoard = Array(level.board.length).fill(null)
        .map(() => Array(level.board.length).fill(false)) as BoardState;
      
      // Apply solution moves to empty board
      level.solution.forEach(([row, col]: Coordinate) => {
        testBoard = engageNode(testBoard, row, col);
      });

      // Board should match the generated level's board
      expect(testBoard).toEqual(level.board);
    });

    it('ensures board state is solvable', () => {
      for (let level = 0; level < 10; level++) {
        const { board, solution } = generateLevel(level);
        let testBoard = JSON.parse(JSON.stringify(board)) as BoardState;
        
        // Apply solution moves
        solution.forEach(([row, col]: Coordinate) => {
          testBoard = engageNode(testBoard, row, col);
        });

        // All tiles should be false (solved state)
        testBoard.forEach((row: boolean[]) => {
          row.forEach((tile: boolean) => {
            expect(tile).toBe(false);
          });
        });
      }
    });
  });

  describe('generateAllLevels', () => {
    it('generates correct number of levels', () => {
      const levels = generateAllLevels();
      expect(levels).toHaveLength(30);
    });

    it('maintains level progression characteristics', () => {
      const levels = generateAllLevels();
      
      // Check tutorial levels
      for (let i = 0; i <= 4; i++) {
        expect(levels[i].board).toHaveLength(3);
      }

      // Check size progression
      expect(levels[5].board).toHaveLength(3);
      expect(levels[10].board).toHaveLength(4);
      expect(levels[20].board).toHaveLength(6);

      // Check solution length progression
      expect(levels[5].solution.length).toBeGreaterThanOrEqual(3);
      expect(levels[15].solution.length).toBeGreaterThanOrEqual(4);
      expect(levels[25].solution.length).toBeGreaterThanOrEqual(5);
    });
  });
});
