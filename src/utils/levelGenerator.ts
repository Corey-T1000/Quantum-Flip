import { BoardState } from '../types';
import { engageNode } from './gameLogic';

// Function to generate a solvable level
export const generateSolvableLevel = (size: number, moves: number): { board: BoardState, solution: [number, number][] } => {
  let board: BoardState = Array.from({ length: size }, () => Array(size).fill(false));
  const solution: [number, number][] = [];

  // Apply random moves to create the level
  for (let i = 0; i < moves; i++) {
    const row = Math.floor(Math.random() * size);
    const col = Math.floor(Math.random() * size);
    board = engageNode(board, row, col);
    solution.unshift([row, col]); // Add to the beginning of the solution array
  }

  return { board, solution };
};

// Function to generate a specific level with a known solution
export const generateSpecificLevel = (size: number, solution: [number, number][]): { board: BoardState, solution: [number, number][] } => {
  let board: BoardState = Array.from({ length: size }, () => Array(size).fill(false));

  for (const [row, col] of solution) {
    board = engageNode(board, row, col);
  }

  return { board, solution: [...solution].reverse() };
};

// Function to generate a set of levels
const generateLevelSet = (boardSize: number, levelsInSet: number): { board: BoardState, solution: [number, number][] }[] => {
  const levelSet: { board: BoardState, solution: [number, number][] }[] = [];
  for (let i = 1; i <= levelsInSet; i++) {
    const moves = Math.max(2, i); // Ensure at least 2 moves, then increase progressively
    levelSet.push(generateSolvableLevel(boardSize, moves));
  }
  return levelSet;
};

// Generate all level sets
const levelsPerSet = 10;

export const generateAllLevels = (): { board: BoardState, solution: [number, number][] }[] => {
  const set1 = generateLevelSet(3, levelsPerSet); // Levels 1-10
  const set2 = generateLevelSet(4, levelsPerSet); // Levels 11-20
  const set3 = generateLevelSet(5, levelsPerSet); // Levels 21-30

  return [...set1, ...set2, ...set3];
};

// Function to verify if a level is solvable
export const verifyLevelSolvability = (board: BoardState, solution: [number, number][]): boolean => {
  let currentBoard = [...board.map(row => [...row])];
  
  for (const [row, col] of solution) {
    currentBoard = engageNode(currentBoard, row, col);
  }

  return currentBoard.every(row => row.every(cell => !cell));
};
