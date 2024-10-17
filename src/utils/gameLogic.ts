export const generateGrid = (size: number): boolean[][] => {
  // Start with a solved grid (all tiles are false)
  const grid = Array.from({ length: size }, () => Array(size).fill(false));
  
  // Perform random moves to scramble the grid
  const numMoves = size * size; // Number of random moves to make
  for (let i = 0; i < numMoves; i++) {
    const row = Math.floor(Math.random() * size);
    const col = Math.floor(Math.random() * size);
    flipTiles(grid, row, col);
  }
  
  return grid;
};

export const flipTiles = (grid: boolean[][], row: number, col: number): void => {
  const size = grid.length;
  const directions = [
    [0, 0],
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  directions.forEach(([dx, dy]) => {
    const newRow = row + dx;
    const newCol = col + dy;
    if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size) {
      grid[newRow][newCol] = !grid[newRow][newCol];
    }
  });
};

export const checkWinCondition = (grid: boolean[][]): boolean => {
  const firstTile = grid[0][0];
  return grid.every((row) => row.every((tile) => tile === firstTile));
};

export const getNextMove = (grid: boolean[][]): [number, number] => {
  const size = grid.length;
  let bestScore = -Infinity;
  let bestMove: [number, number] = [-1, -1];

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const score = evaluateMove(grid, row, col);
      if (score > bestScore) {
        bestScore = score;
        bestMove = [row, col];
      }
    }
  }

  return bestMove;
};

const evaluateMove = (grid: boolean[][], row: number, col: number): number => {
  const size = grid.length;
  let flippedGrid = grid.map(row => [...row]);
  flipTiles(flippedGrid, row, col);

  let trueCount = 0;
  let totalCount = 0;

  flippedGrid.forEach(row => {
    row.forEach(cell => {
      if (cell) trueCount++;
      totalCount++;
    });
  });

  // Calculate how close we are to either all true or all false
  return Math.max(trueCount, totalCount - trueCount);
};

export const isSolvable = (grid: boolean[][]): boolean => {
  const size = grid.length;
  let count = 0;
  
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (grid[row][col]) {
        count++;
      }
    }
  }
  
  // The puzzle is solvable if the number of true tiles is even
  return count % 2 === 0;
};