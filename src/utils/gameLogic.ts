import { BoardState, Level } from '../types';

/**
 * Converts a readable string format to a boolean array representation of the board.
 * @param level - An array of strings representing the level layout.
 * @returns A 2D boolean array representing the board state.
 * @throws Error if the level data is invalid.
 */
export const convertToBooleanArray = (level: Level): BoardState => {
  return level.grid.map(row => row.split('').map(cell => cell === 'o'));
};

// Pregenerated board states for each level
// export const pregeneratedLevels: BoardState[] = [
//   // Tutorial levels
//   convertToBooleanArray([
//     'oxo',
//     'xxx',
//     'oxo'
//   ]),
//   convertToBooleanArray([
//     'xxo',
//     'xox',
//     'oxx'
//   ]),
//   convertToBooleanArray([
//     'oox',
//     'oxo',
//     'xoo'
//   ]),
//   // Regular levels
//   convertToBooleanArray([
//     'oooo',
//     'oooo',
//     'oooo',
//     'oooo'
//   ]),
//   // Add more levels as needed
// ];

// export const tutorialLevels = 3; // Number of tutorial levels

/**
 * Retrieves the initial board state for a given level.
 * @param level - The level number.
 * @returns A deep copy of the initial board state for the specified level.
 * @throws Error if the level number is invalid.
 */
export const getInitialBoardState = (level: Level): BoardState => {
  return convertToBooleanArray(level);
};

/**
 * Toggles the selected node and its adjacent nodes in the matrix.
 * @param matrix - The current board state.
 * @param row - The row index of the node to engage.
 * @param col - The column index of the node to engage.
 * @returns A new BoardState with the engaged nodes toggled.
 * @throws Error if the row or column is out of bounds.
 */
export const engageNode = (matrix: BoardState, row: number, col: number): BoardState => {
  const size = matrix.length;
  if (row < 0 || row >= size || col < 0 || col >= size) {
    throw new Error(`Invalid position: (${row}, ${col}). Valid range is 0 to ${size - 1}.`);
  }

  const newMatrix = matrix.map(r => [...r]);
  newMatrix[row][col] = !newMatrix[row][col];
  if (row > 0) newMatrix[row - 1][col] = !newMatrix[row - 1][col];
  if (row < size - 1) newMatrix[row + 1][col] = !newMatrix[row + 1][col];
  if (col > 0) newMatrix[row][col - 1] = !newMatrix[row][col - 1];
  if (col < size - 1) newMatrix[row][col + 1] = !newMatrix[row][col + 1];

  return newMatrix;
};

/**
 * Checks if all nodes in the matrix are aligned (have the same state).
 * @param matrix - The current board state.
 * @returns True if all nodes are aligned, false otherwise.
 */
export const scanAlignment = (matrix: BoardState): boolean => {
  const referenceState = matrix[0][0];
  return matrix.every(row => row.every(node => node === referenceState));
};

/**
 * Determines the optimal move to maximize alignment.
 * @param matrix - The current board state.
 * @returns An array with the row and column of the best move.
 */
export const consultOracle = (matrix: BoardState): [number, number] => {
  const size = matrix.length;
  let bestScore = -Infinity;
  let bestMove: [number, number] = [-1, -1];

  const currentAlignmentScore = calculateAlignmentScore(matrix);

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (shouldEvaluateMove(matrix, row, col)) {
        const score = evaluateMove(matrix, row, col, currentAlignmentScore);
        if (score > bestScore) {
          bestScore = score;
          bestMove = [row, col];
        }
      }
    }
  }

  return bestMove;
};

/**
 * Calculates the alignment score of the current board state.
 * @param matrix - The current board state.
 * @returns The alignment score.
 */
const calculateAlignmentScore = (matrix: BoardState): number => {
  const totalNodes = matrix.length * matrix[0].length;
  const activeNodes = matrix.flat().filter(node => node).length;
  return Math.max(activeNodes, totalNodes - activeNodes);
};

/**
 * Determines if a move should be evaluated based on its potential to change the board state.
 * @param matrix - The current board state.
 * @param row - The row index of the move.
 * @param col - The column index of the move.
 * @returns True if the move should be evaluated, false otherwise.
 */
const shouldEvaluateMove = (matrix: BoardState, row: number, col: number): boolean => {
  const size = matrix.length;
  const currentState = matrix[row][col];
  
  return (
    currentState !== matrix[row][col] ||
    (row > 0 && currentState !== matrix[row - 1][col]) ||
    (row < size - 1 && currentState !== matrix[row + 1][col]) ||
    (col > 0 && currentState !== matrix[row][col - 1]) ||
    (col < size - 1 && currentState !== matrix[row][col + 1])
  );
};

/**
 * Evaluates the impact of a move on the board's alignment.
 * @param matrix - The current board state.
 * @param row - The row index of the move.
 * @param col - The column index of the move.
 * @param currentAlignmentScore - The current alignment score of the board.
 * @returns A score representing the move's impact on alignment.
 */
const evaluateMove = (matrix: BoardState, row: number, col: number, currentAlignmentScore: number): number => {
  const newMatrix = engageNode(matrix, row, col);
  const newAlignmentScore = calculateAlignmentScore(newMatrix);
  const alignmentChange = newAlignmentScore - currentAlignmentScore;

  return alignmentChange * 1000 + newAlignmentScore;
};
