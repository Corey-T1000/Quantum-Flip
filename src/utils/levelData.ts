import { BoardState } from '../types';
import { generateAllLevels } from './levelGenerator';

// Generate levels only once at startup
export const pregeneratedLevels = generateAllLevels();

// Function to get a specific level
export const getLevel = (levelIndex: number): BoardState => {
  if (levelIndex < 0 || levelIndex >= pregeneratedLevels.length) {
    throw new Error(`Invalid level index: ${levelIndex}`);
  }
  return pregeneratedLevels[levelIndex].board;
};

// Function to get the total number of levels
export const getTotalLevels = (): number => pregeneratedLevels.length;

// Function to get the solution for a specific level
export const getLevelSolution = (levelIndex: number): [number, number][] => {
  if (levelIndex < 0 || levelIndex >= pregeneratedLevels.length) {
    throw new Error(`Invalid level index: ${levelIndex}`);
  }
  return pregeneratedLevels[levelIndex].solution;
};
