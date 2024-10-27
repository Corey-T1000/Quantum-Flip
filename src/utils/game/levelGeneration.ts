import { BoardState, LevelData } from '../../types';
import { engageNode } from './nodeOperations';

const generateSolution = (size: number): [number, number][] => {
  const solution: [number, number][] = [];
  const numMoves = Math.floor(Math.random() * 3) + 3; // 3-5 moves
  
  for (let i = 0; i < numMoves; i++) {
    const row = Math.floor(Math.random() * size);
    const col = Math.floor(Math.random() * size);
    solution.push([row, col]);
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
  const size = Math.min(3 + Math.floor(level / 3), 8);
  const solution = generateSolution(size);
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
