import { BoardState } from '../../types';
import { generateAllLevels } from './levelGeneration';

// Generate levels only once at startup
export const pregeneratedLevels = generateAllLevels();

/**
 * Gets a specific level's board state.
 */
export const getLevel = (levelIndex: number): BoardState => {
  if (levelIndex < 0 || levelIndex >= pregeneratedLevels.length) {
    throw new Error(`Invalid level index: ${levelIndex}`);
  }
  return pregeneratedLevels[levelIndex].board;
};

/**
 * Gets the total number of available levels.
 */
export const getTotalLevels = (): number => pregeneratedLevels.length;

/**
 * Gets the solution for a specific level.
 */
export const getLevelSolution = (levelIndex: number): [number, number][] => {
  if (levelIndex < 0 || levelIndex >= pregeneratedLevels.length) {
    throw new Error(`Invalid level index: ${levelIndex}`);
  }
  return pregeneratedLevels[levelIndex].solution;
};
