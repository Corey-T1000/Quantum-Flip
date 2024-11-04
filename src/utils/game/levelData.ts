import { BoardState } from '../../types';
import { generateAllLevels } from './levelGeneration';

// Key for storing levels in localStorage
const LEVELS_STORAGE_KEY = 'quantum_flip_levels';
const LEVELS_VERSION_KEY = 'quantum_flip_levels_version';
const CURRENT_VERSION = '1.1.0'; // Increment this when making changes to level generation

// Get or generate levels
const getLevelsFromStorage = (): { board: BoardState; solution: [number, number][] }[] => {
  const storedVersion = localStorage.getItem(LEVELS_VERSION_KEY);
  const storedLevels = localStorage.getItem(LEVELS_STORAGE_KEY);
  
  // If version doesn't match or levels don't exist, generate new ones
  if (!storedLevels || storedVersion !== CURRENT_VERSION) {
    const newLevels = generateAllLevels();
    localStorage.setItem(LEVELS_STORAGE_KEY, JSON.stringify(newLevels));
    localStorage.setItem(LEVELS_VERSION_KEY, CURRENT_VERSION);
    return newLevels;
  }
  
  return JSON.parse(storedLevels);
};

// Generate levels only once and store them
export let pregeneratedLevels = getLevelsFromStorage();

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

/**
 * Resets all levels by generating new ones.
 * Use this when you want to force new level generation.
 */
export const resetAllLevels = (): void => {
  localStorage.removeItem(LEVELS_STORAGE_KEY);
  localStorage.removeItem(LEVELS_VERSION_KEY);
  pregeneratedLevels = generateAllLevels();
};
