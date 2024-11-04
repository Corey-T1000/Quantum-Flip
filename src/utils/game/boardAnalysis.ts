import { BoardState, Coordinate } from '../../types';

export const scanAlignment = (grid: boolean[][]): boolean => {
  const firstTileState = grid[0][0];
  return grid.every(row => row.every((tile: boolean) => tile === firstTileState));
};

interface HintAnalysis {
  moveCount: number;
  affectedAreas: Coordinate[];
  bestMove: Coordinate | null;
}

export const analyzeBoard = (grid: BoardState): HintAnalysis => {
  const size = grid.length;
  const center = Math.floor(size / 2);
  
  // First, evaluate the current state
  const totalTiles = size * size;
  const lightTiles = grid.flat().filter((tile: boolean) => tile).length;
  const targetState = lightTiles > totalTiles / 2;
  
  // If grid is already aligned, return empty analysis
  if (scanAlignment(grid)) {
    return {
      moveCount: 0,
      affectedAreas: [],
      bestMove: null
    };
  }
  
  // Helper function to get affected positions for a move
  const getAffectedPositions = (row: number, col: number): Coordinate[] => {
    const positions: Coordinate[] = [[row, col]];
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    
    directions.forEach(([dx, dy]) => {
      const newRow = row + dx;
      const newCol = col + dy;
      if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size) {
        positions.push([newRow, newCol]);
      }
    });
    
    return positions;
  };
  
  // Helper function to evaluate move effectiveness
  const evaluateMove = (row: number, col: number): number => {
    const positions = getAffectedPositions(row, col);
    return positions.filter(([r, c]) => grid[r][c] !== targetState).length;
  };
  
  let bestMove: Coordinate | null = null;
  let bestScore = -1;
  let effectiveMoves: Coordinate[] = [];
  
  // Check center first
  const centerScore = evaluateMove(center, center);
  if (centerScore > 0) {
    bestScore = centerScore;
    bestMove = [center, center];
    effectiveMoves.push([center, center]);
  }
  
  // Then check corners
  const corners: Coordinate[] = [[0, 0], [0, size-1], [size-1, 0], [size-1, size-1]];
  for (const [row, col] of corners) {
    const score = evaluateMove(row, col);
    if (score > bestScore) {
      bestScore = score;
      bestMove = [row, col];
    }
    if (score > 0) {
      effectiveMoves.push([row, col]);
    }
  }
  
  // Finally check all other tiles
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if ((row === center && col === center) || 
          corners.some(([r, c]) => r === row && c === col)) {
        continue;
      }
      
      const score = evaluateMove(row, col);
      if (score > bestScore) {
        bestScore = score;
        bestMove = [row, col];
      }
      if (score > 0) {
        effectiveMoves.push([row, col]);
      }
    }
  }
  
  // If no effective moves found and grid is not aligned, use center
  if (effectiveMoves.length === 0 && !scanAlignment(grid)) {
    return {
      moveCount: 1,
      affectedAreas: getAffectedPositions(center, center),
      bestMove: [center, center]
    };
  }
  
  return {
    moveCount: effectiveMoves.length,
    affectedAreas: bestMove ? getAffectedPositions(bestMove[0], bestMove[1]) : [],
    bestMove: bestMove || [center, center]
  };
};

export const findNextMove = (grid: BoardState): Coordinate | null => {
  const size = grid.length;
  const center = Math.floor(size / 2);
  
  // For an empty grid, prefer center move
  if (grid.every((row: boolean[]) => row.every((tile: boolean) => !tile))) {
    return [center, center];
  }
  
  // If grid is already aligned, return null
  if (scanAlignment(grid)) {
    return null;
  }
  
  const analysis = analyzeBoard(grid);
  return analysis.bestMove || [center, center];
};
