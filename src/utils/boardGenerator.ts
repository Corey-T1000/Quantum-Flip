import { BoardState, GeneratedBoard } from './types';
import { engageNode, cloneBoard } from './boardOperations';

const createEmptyBoard = (size: number): BoardState => {
  return Array(size).fill(null).map(() => Array(size).fill(true));
};

const isValidMove = (board: BoardState, row: number, col: number): boolean => {
  const testBoard = cloneBoard(board);
  engageNode(testBoard, row, col);
  
  const size = board.length;
  let trueCount = 0;
  let falseCount = 0;
  
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (testBoard[i][j]) trueCount++;
      else falseCount++;
    }
  }
  
  const ratio = Math.abs(trueCount - falseCount) / (size * size);
  return ratio <= 0.6;
};

export const generateSolvableBoard = (size: number, moves: number = Math.floor(size * 1.5)): GeneratedBoard => {
  const board = createEmptyBoard(size);
  const solution: [number, number][] = [];
  let attempts = 0;
  const maxAttempts = 100;

  while (solution.length < moves && attempts < maxAttempts) {
    const row = Math.floor(Math.random() * size);
    const col = Math.floor(Math.random() * size);
    
    if (isValidMove(board, row, col)) {
      engageNode(board, row, col);
      solution.unshift([row, col]);
    }
    
    attempts++;
  }

  return { board, solution };
};