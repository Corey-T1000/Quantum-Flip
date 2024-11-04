import { BoardState } from '../../types';

export const toggleTileAndNeighbors = (grid: boolean[][], row: number, col: number): void => {
  const size = grid.length;
  const togglePositions = [
    [row, col],
    [row - 1, col],
    [row + 1, col],
    [row, col - 1],
    [row, col + 1]
  ];

  togglePositions.forEach(([r, c]) => {
    if (r >= 0 && r < size && c >= 0 && c < size) {
      grid[r][c] = !grid[r][c];
    }
  });
};

export const toggleTile = (grid: boolean[][], row: number, col: number): void => {
  grid[row][col] = !grid[row][col];
};

export const engageNode = (grid: BoardState, row: number, col: number): BoardState => {
  if (row < 0 || col < 0 || row >= grid.length || col >= grid.length) {
    throw new Error('Invalid row or column index');
  }

  // Create a deep copy of the grid
  const newGrid = grid.map(row => [...row]);
  
  // Toggle the clicked tile
  newGrid[row][col] = !newGrid[row][col];
  
  // Toggle adjacent tiles if they exist
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  directions.forEach(([dx, dy]) => {
    const newRow = row + dx;
    const newCol = col + dy;
    if (newRow >= 0 && newRow < grid.length && newCol >= 0 && newCol < grid.length) {
      newGrid[newRow][newCol] = !newGrid[newRow][newCol];
    }
  });

  return newGrid;
};

export const getNeighbors = (grid: BoardState, row: number, col: number): [number, number][] => {
  const size = grid.length;
  const positions: [number, number][] = [
    [row - 1, col] as [number, number], // up
    [row + 1, col] as [number, number], // down
    [row, col - 1] as [number, number], // left
    [row, col + 1] as [number, number]  // right
  ];
  return positions.filter(([r, c]) => r >= 0 && r < size && c >= 0 && c < size);
};

export const countMatchingNeighbors = (grid: BoardState, row: number, col: number): number => {
  const state = grid[row][col];
  const neighbors = getNeighbors(grid, row, col);
  return neighbors.filter(([r, c]) => grid[r][c] === state).length;
};
