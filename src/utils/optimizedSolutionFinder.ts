import { BoardState, SolutionStep } from '../types';
import { engageNode, cloneBoard } from './boardOperations';

// LRU Cache implementation for memoization
class LRUCache<K, V> {
  private cache: Map<K, V>;
  private readonly capacity: number;

  constructor(capacity: number) {
    this.cache = new Map();
    this.capacity = capacity;
  }

  get(key: K): V | undefined {
    if (!this.cache.has(key)) return undefined;
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value!);
    return value;
  }

  put(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      this.cache.delete(this.cache.keys().next().value);
    }
    this.cache.set(key, value);
  }
}

// Create a board state hash for caching
const hashBoardState = (board: BoardState): string => {
  return board.map(row => row.map(cell => cell ? '1' : '0').join('')).join('');
};

// Cache for storing previously computed solutions
const solutionCache = new LRUCache<string, SolutionStep[]>(1000);

// Heuristic function to estimate moves to solution
const estimateMovesToSolution = (board: BoardState): number => {
  const size = board.length;
  const firstState = board[0][0];
  let differentStates = 0;

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (board[i][j] !== firstState) {
        differentStates++;
      }
    }
  }

  return Math.ceil(differentStates / 5); // Estimate based on average cells affected per move
};

// Check if board is in solved state
const isSolved = (board: BoardState): boolean => {
  const firstState = board[0][0];
  return board.every(row => row.every(cell => cell === firstState));
};

// Find optimal solution using A* algorithm with memoization
export const findOptimalSolution = (
  initialBoard: BoardState,
  maxDepth: number = 20
): SolutionStep[] | null => {
  const initialHash = hashBoardState(initialBoard);
  const cachedSolution = solutionCache.get(initialHash);
  if (cachedSolution) return cachedSolution;

  type SearchNode = {
    board: BoardState;
    steps: SolutionStep[];
    cost: number;
    estimate: number;
  };

  const visited = new Set<string>();
  const queue: SearchNode[] = [{
    board: cloneBoard(initialBoard),
    steps: [],
    cost: 0,
    estimate: estimateMovesToSolution(initialBoard)
  }];

  while (queue.length > 0) {
    queue.sort((a, b) => (a.cost + a.estimate) - (b.cost + b.estimate));
    const current = queue.shift()!;
    const boardHash = hashBoardState(current.board);

    if (visited.has(boardHash)) continue;
    visited.add(boardHash);

    if (isSolved(current.board)) {
      solutionCache.put(initialHash, current.steps);
      return current.steps;
    }

    if (current.steps.length >= maxDepth) continue;

    const size = current.board.length;
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const nextBoard = cloneBoard(current.board);
        engageNode(nextBoard, i, j);
        const nextHash = hashBoardState(nextBoard);

        if (!visited.has(nextHash)) {
          const nextSteps = [...current.steps, { row: i, col: j, step: current.steps.length }];
          queue.push({
            board: nextBoard,
            steps: nextSteps,
            cost: current.cost + 1,
            estimate: estimateMovesToSolution(nextBoard)
          });
        }
      }
    }
  }

  return null;
};

// Helper function to validate solution
export const validateSolution = (
  initialBoard: BoardState,
  solution: SolutionStep[]
): boolean => {
  const board = cloneBoard(initialBoard);
  
  for (const step of solution) {
    engageNode(board, step.row, step.col);
  }
  
  return isSolved(board);
};
