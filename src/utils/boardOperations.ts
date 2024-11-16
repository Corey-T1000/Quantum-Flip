import { BoardState } from './types';

export const engageNode = (matrix: BoardState, row: number, col: number): void => {
  const size = matrix.length;
  const directions = [
    [0, 0],    // Center
    [-1, 0],   // North
    [1, 0],    // South
    [0, -1],   // West
    [0, 1]     // East
  ];

  directions.forEach(([dx, dy]) => {
    const newRow = row + dx;
    const newCol = col + dy;
    if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size) {
      matrix[newRow][newCol] = !matrix[newRow][newCol];
    }
  });
};

export const cloneBoard = (matrix: BoardState): BoardState => {
  return matrix.map(row => [...row]);
};

export const getBoardState = (matrix: BoardState): string => {
  return matrix.map(row => 
    row.map(cell => cell ? '1' : '0').join('')
  ).join('|');
};