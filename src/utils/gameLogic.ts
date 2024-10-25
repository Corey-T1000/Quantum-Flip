import { BoardState } from '../types';

type Move = [number, number];

/**
 * Toggles the selected node and its adjacent nodes in the matrix.
 */
export const engageNode = (matrix: BoardState, row: number, col: number): BoardState => {
  const size = matrix.length;
  if (row < 0 || row >= size || col < 0 || col >= size) {
    throw new Error(`Invalid position: (${row}, ${col}). Valid range is 0 to ${size - 1}.`);
  }

  const togglePositions = [
    [row, col],
    [row - 1, col],
    [row + 1, col],
    [row, col - 1],
    [row, col + 1]
  ].filter(([r, c]) => r >= 0 && r < size && c >= 0 && c < size);

  return matrix.map((r, i) =>
    r.map((cell, j) =>
      togglePositions.some(([tr, tc]) => tr === i && tc === j) ? !cell : cell
    )
  );
};

/**
 * Checks if all nodes in the matrix are aligned (have the same state).
 */
export const scanAlignment = (matrix: BoardState): boolean => {
  const referenceState = matrix[0][0];
  const isAligned = matrix.every(row => row.every(node => node === referenceState));
  return isAligned;
};

/**
 * Gets the neighbors of a position.
 */
const getNeighbors = (matrix: BoardState, row: number, col: number): Move[] => {
  const size = matrix.length;
  return [
    [row - 1, col],
    [row + 1, col],
    [row, col - 1],
    [row, col + 1]
  ].filter(([r, c]) => r >= 0 && r < size && c >= 0 && c < size) as Move[];
};

/**
 * Counts how many neighbors match a tile's state.
 */
const countMatchingNeighbors = (matrix: BoardState, row: number, col: number): number => {
  const state = matrix[row][col];
  const neighbors = getNeighbors(matrix, row, col);
  return neighbors.filter(([r, c]) => matrix[r][c] === state).length;
};

/**
 * Evaluates a move based on how it affects neighbor matches.
 */
const evaluateMove = (matrix: BoardState, row: number, col: number): number => {
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
export const findNextMove = (matrix: BoardState): Move | null => {
  if (scanAlignment(matrix)) {
    return null; // Board is already solved
  }

  const size = matrix.length;
  let bestMove: Move | null = null;
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
  // This allows for monetization when no improving moves are found
  return bestMove;
};
