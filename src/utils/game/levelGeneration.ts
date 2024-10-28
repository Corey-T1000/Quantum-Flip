import { BoardState, LevelData } from '../../types';
import { engageNode } from './nodeOperations';

const generateTutorialLevel = (level: number): LevelData => {
  const size = 3; // Tutorial levels are always 3x3
  let solution: [number, number][] = [];
  let board = Array(size).fill(null).map(() => Array(size).fill(false));
  
  // Predefined solutions for tutorial levels
  switch (level) {
    case 0: // First level - center move only
      solution = [[1, 1]];
      break;
    case 1: // Second level - two moves
      solution = [[0, 0], [2, 2]];
      break;
    case 2: // Third level - triangle pattern
      solution = [[0, 0], [0, 2], [2, 1]];
      break;
    case 3: // Fourth level - diagonal pattern
      solution = [[0, 0], [1, 1], [2, 2]];
      break;
    case 4: // Fifth level - cross pattern
      solution = [[1, 1], [0, 1], [2, 1]];
      break;
    default:
      solution = [[1, 1]];
  }
  
  // Apply solution moves in reverse to create the initial state
  solution.reverse().forEach(([row, col]) => {
    board = engageNode(board, row, col);
  });
  
  return {
    board,
    solution: solution.reverse() // Reverse back to correct order
  };
};

const generateSolution = (size: number, level: number): [number, number][] => {
  const solution: [number, number][] = [];
  // Increase number of moves with level progression
  const minMoves = Math.min(3 + Math.floor(level / 5), 6);
  const maxMoves = Math.min(minMoves + 2, 8);
  const numMoves = Math.floor(Math.random() * (maxMoves - minMoves + 1)) + minMoves;
  
  const usedPositions = new Set<string>();
  
  for (let i = 0; i < numMoves; i++) {
    let attempts = 0;
    let row: number;
    let col: number;
    
    // Prevent duplicate positions and ensure good distribution
    do {
      row = Math.floor(Math.random() * size);
      col = Math.floor(Math.random() * size);
      attempts++;
      // If we can't find a new position after many attempts, break to avoid infinite loop
      if (attempts > 50) break;
    } while (usedPositions.has(`${row},${col}`));
    
    if (attempts <= 50) {
      usedPositions.add(`${row},${col}`);
      solution.push([row, col]);
    }
  }
  
  return solution;
};

const createInitialBoard = (size: number, solution: [number, number][]): BoardState => {
  let board = Array(size).fill(null).map(() => Array(size).fill(false));
  
  // Apply solution moves in reverse to create the initial state
  solution.reverse().forEach(([row, col]) => {
    board = engageNode(board, row, col);
  });
  
  return board;
};

export const generateLevel = (level: number): LevelData => {
  // Tutorial levels (0-4) have predefined patterns
  if (level <= 4) {
    return generateTutorialLevel(level);
  }
  
  // Regular levels
  const size = Math.min(3 + Math.floor((level - 5) / 5), 6);
  const solution = generateSolution(size, level);
  const board = createInitialBoard(size, solution);
  
  return {
    board,
    solution: solution.reverse() // Reverse back to correct order
  };
};

export const generateAllLevels = (): LevelData[] => {
  const levels: LevelData[] = [];
  const totalLevels = 30; // Total number of levels
  
  for (let i = 0; i < totalLevels; i++) {
    levels.push(generateLevel(i));
  }
  
  return levels;
};
