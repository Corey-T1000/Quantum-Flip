import { BoardState, SolutionStep } from './types';
import { engageNode, cloneBoard, getBoardState } from './boardOperations';

const isSolved = (board: BoardState): boolean => {
  const firstState = board[0][0];
  return board.every(row => row.every(cell => cell === firstState));
};

const calculateStateDistance = (board1: BoardState, board2: BoardState): number => {
  let distance = 0;
  let trueCount1 = 0, trueCount2 = 0;
  const totalCells = board1.length * board1.length;

  // Count true states in both boards
  for (let i = 0; i < board1.length; i++) {
    for (let j = 0; j < board1[i].length; j++) {
      if (board1[i][j]) trueCount1++;
      if (board2[i][j]) trueCount2++;
    }
  }

  // If the boards have significantly different number of true states,
  // they're likely moving in the wrong direction
  if (Math.abs(trueCount1 - trueCount2) > totalCells / 2) {
    return totalCells;
  }

  // Calculate Hamming distance
  for (let i = 0; i < board1.length; i++) {
    for (let j = 0; j < board1[i].length; j++) {
      if (board1[i][j] !== board2[i][j]) {
        distance++;
      }
    }
  }

  return distance;
};

const createGoalState = (board: BoardState): BoardState => {
  const size = board.length;
  let trueCount = 0;
  let totalCells = size * size;

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (board[i][j]) trueCount++;
    }
  }

  const targetState = trueCount > totalCells / 2;
  return Array(size).fill(null).map(() => Array(size).fill(targetState));
};

const evaluateMove = (board: BoardState, row: number, col: number, goalState: BoardState): number => {
  const testBoard = cloneBoard(board);
  engageNode(testBoard, row, col);
  
  const distance = calculateStateDistance(testBoard, goalState);
  const size = board.length;
  
  // Add position-based heuristics
  const centerDistance = Math.abs(row - (size - 1) / 2) + Math.abs(col - (size - 1) / 2);
  const positionScore = (size - centerDistance) / size;
  
  // Check for pattern improvements
  let patternScore = 0;
  const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  
  for (const [dx, dy] of directions) {
    const newRow = row + dx;
    const newCol = col + dy;
    if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size) {
      if (testBoard[newRow][newCol] === testBoard[row][col]) {
        patternScore++;
      }
    }
  }
  
  return distance * 10 - positionScore - patternScore;
};

const generateOptimalMoves = (board: BoardState, goalState: BoardState): [number, number][] => {
  const size = board.length;
  const moves: Array<[number, number, number]> = [];

  // Evaluate all possible moves
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const score = evaluateMove(board, i, j, goalState);
      moves.push([i, j, score]);
    }
  }

  // Sort by score (lower is better)
  moves.sort((a, b) => a[2] - b[2]);
  
  // Return top moves based on board size
  const maxMoves = Math.min(Math.max(4, Math.floor(size * 1.5)), 8);
  return moves.slice(0, maxMoves).map(([row, col]) => [row, col]);
};

export const findSolution = (board: BoardState): SolutionStep[] | null => {
  const size = board.length;
  const goalState = createGoalState(board);
  const visited = new Set<string>();
  const maxDepth = Math.min(Math.max(8, size * 2), 12); // Adaptive depth based on board size
  const maxQueueSize = 15000;

  const queue: Array<{
    board: BoardState;
    path: SolutionStep[];
    priority: number;
  }> = [{
    board: cloneBoard(board),
    path: [],
    priority: calculateStateDistance(board, goalState)
  }];

  while (queue.length > 0 && queue.length < maxQueueSize) {
    // Sort by priority occasionally to prevent queue explosion
    if (queue.length % 100 === 0) {
      queue.sort((a, b) => a.priority - b.priority);
    }
    
    const current = queue.shift()!;
    const { board: currentBoard, path } = current;

    if (isSolved(currentBoard)) {
      return path;
    }

    if (path.length >= maxDepth) {
      continue;
    }

    const boardState = getBoardState(currentBoard);
    if (visited.has(boardState)) {
      continue;
    }
    visited.add(boardState);

    const moves = generateOptimalMoves(currentBoard, goalState);

    for (const [row, col] of moves) {
      const nextBoard = cloneBoard(currentBoard);
      engageNode(nextBoard, row, col);
      
      const nextPath = [...path, { row, col, step: path.length + 1 }];
      const distance = calculateStateDistance(nextBoard, goalState);
      const priority = nextPath.length + distance * 2;

      // Add promising moves to the front of the queue
      if (distance < current.priority) {
        queue.unshift({
          board: nextBoard,
          path: nextPath,
          priority: distance
        });
      } else {
        queue.push({
          board: nextBoard,
          path: nextPath,
          priority: priority
        });
      }
    }
  }

  // If no perfect solution found, return the best partial solution
  if (queue.length > 0) {
    return queue.sort((a, b) => 
      calculateStateDistance(a.board, goalState) - 
      calculateStateDistance(b.board, goalState)
    )[0].path;
  }

  return null;
};