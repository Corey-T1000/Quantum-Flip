import { BoardState } from '../../types';
import { engageNode, countMatchingNeighbors } from './nodeOperations';

/**
 * Checks if all nodes in the matrix are aligned (have the same state).
 */
export const scanAlignment = (matrix: BoardState): boolean => {
  const referenceState = matrix[0][0];
  return matrix.every(row => row.every(node => node === referenceState));
};

/**
 * Evaluates a move based on how it affects neighbor matches.
 */
export const evaluateMove = (matrix: BoardState, row: number, col: number): number => {
  // Try the move
  const newBoard = engageNode(matrix, row, col);
  
  // If this move leads to alignment, return highest score
  if (scanAlignment(newBoard)) {
    return Infinity;
  }

  const size = matrix.length;
  let score = 0;

  // Check each position in the board
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Compare matching neighbors before and after the move
      const beforeMatches = countMatchingNeighbors(matrix, r, c);
      const afterMatches = countMatchingNeighbors(newBoard, r, c);
      score += afterMatches - beforeMatches;
    }
  }

  return score;
};

/**
 * Finds the next best move that improves the board state.
 * Returns null if no improving move is found (potential monetization point).
 */
export const findNextMove = (matrix: BoardState): [number, number] | null => {
  if (scanAlignment(matrix)) {
    return null; // Board is already solved
  }

  const size = matrix.length;
  let bestMove: [number, number] | null = null;
  let bestScore = 0; // Only consider moves that improve the state (score > 0)

  // Try each possible move
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const score = evaluateMove(matrix, row, col);
      
      // If this is a winning move, return it immediately
      if (score === Infinity) {
        return [row, col];
      }

      // Update best move if this one improves the state more
      if (score > bestScore) {
        bestScore = score;
        bestMove = [row, col];
      }
    }
  }

  // Only return a move if it improves the board state
  return bestMove;
};
