export const scanAlignment = (grid: boolean[][]): boolean => {
  const firstTileState = grid[0][0];
  return grid.every(row => row.every(tile => tile === firstTileState));
};

export const findNextMove = (grid: boolean[][]): [number, number] | null => {
  const size = grid.length;
  const center = Math.floor(size / 2);
  
  // First, try the center tile as it often leads to good solutions
  if (shouldFlipTile(grid, center, center)) {
    return [center, center];
  }
  
  // Then try corners
  const corners = [[0, 0], [0, size-1], [size-1, 0], [size-1, size-1]];
  for (const [row, col] of corners) {
    if (shouldFlipTile(grid, row, col)) {
      return [row, col];
    }
  }
  
  // Finally, try all other tiles
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (shouldFlipTile(grid, row, col)) {
        return [row, col];
      }
    }
  }
  
  return null;
};

const shouldFlipTile = (grid: boolean[][], row: number, col: number): boolean => {
  const size = grid.length;
  let lightCount = 0;
  let totalCount = 0;
  
  // Check the tile and its neighbors
  const positions = [[row, col]];
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  directions.forEach(([dx, dy]) => {
    const newRow = row + dx;
    const newCol = col + dy;
    if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size) {
      positions.push([newRow, newCol]);
    }
  });
  
  positions.forEach(([r, c]) => {
    if (grid[r][c]) lightCount++;
    totalCount++;
  });
  
  // If more than half the tiles in the affected area are light,
  // suggest flipping to make them mostly dark, and vice versa
  return lightCount > totalCount / 2;
};
