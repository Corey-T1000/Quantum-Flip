import { BoardState } from '../../types';

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
 * Gets the neighbors of a position.
 */
export const getNeighbors = (matrix: BoardState, row: number, col: number): [number, number][] => {
  const size = matrix.length;
  return [
    [row - 1, col],
    [row + 1, col],
    [row, col - 1],
    [row, col + 1]
  ].filter(([r, c]) => r >= 0 && r < size && c >= 0 && c < size) as [number, number][];
};

/**
 * Counts how many neighbors match a tile's state.
 */
export const countMatchingNeighbors = (matrix: BoardState, row: number, col: number): number => {
  const state = matrix[row][col];
  const neighbors = getNeighbors(matrix, row, col);
  return neighbors.filter(([r, c]) => matrix[r][c] === state).length;
};
