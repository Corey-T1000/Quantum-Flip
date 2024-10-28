export const scanAlignment = (grid: boolean[][]): boolean => {
  const firstTileState = grid[0][0];
  return grid.every(row => row.every(tile => tile === firstTileState));
};

export const findNextMove = (grid: boolean[][]): [number, number] | null => {
  const size = grid.length;
  const center = Math.floor(size / 2);
  
  // First, evaluate the current state
  const totalTiles = size * size;
  const lightTiles = grid.flat().filter(tile => tile).length;
  const targetState = lightTiles > totalTiles / 2 ? true : false;
  
  // Helper function to count affected tiles that would match target state
  const evaluateMove = (row: number, col: number): number => {
    let score = 0;
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
      if (grid[r][c] !== targetState) score++;
    });
    
    return score;
  };
  
  // Store best move and its score
  let bestMove: [number, number] | null = null;
  let bestScore = -1;
  
  // Check center first
  const centerScore = evaluateMove(center, center);
  if (centerScore > bestScore) {
    bestScore = centerScore;
    bestMove = [center, center];
  }
  
  // Then check corners
  const corners = [[0, 0], [0, size-1], [size-1, 0], [size-1, size-1]];
  for (const [row, col] of corners) {
    const score = evaluateMove(row, col);
    if (score > bestScore) {
      bestScore = score;
      bestMove = [row, col];
    }
  }
  
  // Finally check all other tiles
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      // Skip center and corners as they've already been evaluated
      if ((row === center && col === center) || 
          corners.some(([r, c]) => r === row && c === col)) {
        continue;
      }
      
      const score = evaluateMove(row, col);
      if (score > bestScore) {
        bestScore = score;
        bestMove = [row, col];
      }
    }
  }
  
  return bestScore > 0 ? bestMove : null;
};
