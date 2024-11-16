import { BoardState } from '../types';
import { engageNode, cloneBoard } from './boardOperations';

const MAX_DEPTH = 5;

interface Position {
  x: number;
  y: number;
  score: number;
}

interface BoardAnalysis {
  trueCount: number;
  falseCount: number;
  clusters: { [key: string]: number };
  dominantState: boolean;
}

const analyzeBoardState = (board: BoardState): BoardAnalysis => {
  const size = board.length;
  let trueCount = 0;
  let falseCount = 0;
  const clusters: { [key: string]: number } = { 'true': 0, 'false': 0 };

  // Count states and find clusters
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      if (board[x][y]) {
        trueCount++;
        if (hasAdjacentSameState(board, x, y, true)) {
          clusters['true']++;
        }
      } else {
        falseCount++;
        if (hasAdjacentSameState(board, x, y, false)) {
          clusters['false']++;
        }
      }
    }
  }

  return {
    trueCount,
    falseCount,
    clusters,
    dominantState: trueCount >= falseCount
  };
};

const hasAdjacentSameState = (board: BoardState, x: number, y: number, state: boolean): boolean => {
  const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  return directions.some(([dx, dy]) => {
    const newX = x + dx;
    const newY = y + dy;
    return (
      newX >= 0 && newX < board.length &&
      newY >= 0 && newY < board.length &&
      board[newX][newY] === state
    );
  });
};

const evaluatePosition = (board: BoardState, x: number, y: number): number => {
  const size = board.length;
  const testBoard = cloneBoard(board);
  engageNode(testBoard, x, y);
  
  const beforeAnalysis = analyzeBoardState(board);
  const afterAnalysis = analyzeBoardState(testBoard);
  
  let score = 0;
  
  // Score based on state balance improvement
  const beforeDiff = Math.abs(beforeAnalysis.trueCount - beforeAnalysis.falseCount);
  const afterDiff = Math.abs(afterAnalysis.trueCount - afterAnalysis.falseCount);
  score += (beforeDiff - afterDiff) * 2;
  
  // Score based on cluster reduction
  const beforeClusters = beforeAnalysis.clusters[beforeAnalysis.dominantState ? 'true' : 'false'];
  const afterClusters = afterAnalysis.clusters[beforeAnalysis.dominantState ? 'true' : 'false'];
  score += (beforeClusters - afterClusters) * 3;
  
  // Bonus for center proximity
  const centerDist = Math.abs(x - (size - 1) / 2) + Math.abs(y - (size - 1) / 2);
  score += (size - centerDist) / 2;
  
  // Check if move leads to a winning state or closer to it
  if (isWinningMove(testBoard)) {
    score += 100;
  }
  
  return score;
};

const isWinningMove = (board: BoardState): boolean => {
  const firstState = board[0][0];
  let uniformCount = 0;
  const totalCells = board.length * board.length;
  
  for (let x = 0; x < board.length; x++) {
    for (let y = 0; y < board.length; y++) {
      if (board[x][y] === firstState) {
        uniformCount++;
      }
    }
  }
  
  // Consider it a winning move if it gets us closer to uniformity
  return uniformCount > totalCells * 0.75;
};

export const findOptimalMove = (board: BoardState): [number, number] => {
  const size = board.length;
  const moves: Position[] = [];
  
  // Evaluate all possible positions
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      moves.push({
        x,
        y,
        score: evaluatePosition(board, x, y)
      });
    }
  }
  
  // Sort by score and get the best move
  moves.sort((a, b) => b.score - a.score);
  const bestMove = moves[0];
  
  // Convert to board coordinates
  return [bestMove.x, bestMove.y];
};