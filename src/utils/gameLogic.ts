import { BoardState } from './types';
import { generateSolvableBoard } from './boardGenerator';
import { engageNode } from './boardOperations';

const generateLevel = (size: number, complexity: number): BoardState[] => {
  // Generate three variations of each level with increasing complexity
  return Array(3).fill(null).map(() => 
    generateSolvableBoard(size, Math.floor(size * complexity)).board
  );
};

// Define level progression with increasing size and complexity
const levelConfigurations = [
  { size: 3, complexity: 1.0 },  // Levels 1-3
  { size: 3, complexity: 1.5 },  // Levels 4-6
  { size: 4, complexity: 1.0 },  // Levels 7-9
  { size: 4, complexity: 1.5 },  // Levels 10-12
  { size: 5, complexity: 1.0 },  // Levels 13-15
  { size: 5, complexity: 1.5 },  // Levels 16-18
  { size: 6, complexity: 1.0 },  // Level 19
  { size: 6, complexity: 1.5 }   // Level 20
];

// Generate all levels upfront
export const pregeneratedLevels: BoardState[][] = [];
for (const config of levelConfigurations) {
  // Generate 3 variations for each configuration
  const variations = generateLevel(config.size, config.complexity);
  variations.forEach(board => pregeneratedLevels.push([board]));
}

// Ensure we have exactly 20 levels
while (pregeneratedLevels.length > 20) {
  pregeneratedLevels.pop();
}

export const getInitialBoardState = (level: number): BoardState => {
  if (level < 0 || level >= pregeneratedLevels.length) {
    throw new Error('Invalid level');
  }
  return pregeneratedLevels[level][0];
};

export const scanAlignment = (matrix: BoardState): boolean => {
  const referenceState = matrix[0][0];
  return matrix.every(row => row.every(node => node === referenceState));
};

export const getLevelInfo = (level: number): { size: number; complexity: number } => {
  const configIndex = Math.floor(level / 3);
  return levelConfigurations[configIndex] || levelConfigurations[levelConfigurations.length - 1];
};

export { engageNode };