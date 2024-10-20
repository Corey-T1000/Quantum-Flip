import { Level } from '../types';

export const levels: Level[] = [
  // Tutorial levels
  {
    id: 'tutorial1',
    name: 'Tutorial 1',
    description: 'Welcome to the Quantum Matrix. Engage the central node to begin.',
    grid: [
      'oxo',
      'xxx',
      'oxo'
    ]
  },
  {
    id: 'tutorial2',
    name: 'Tutorial 2',
    description: 'Excellent. Now, observe how engaging a node affects its neighbors.',
    grid: [
      'xxo',
      'xox',
      'oxx'
    ]
  },
  {
    id: 'tutorial3',
    name: 'Tutorial 3',
    description: 'Perfect. Your goal is to align all nodes. Try to solve this pattern.',
    grid: [
      'oox',
      'oxo',
      'xoo'
    ]
  },
  // Regular levels
  {
    id: 'level1',
    name: 'Level 1',
    description: 'Your first challenge. Align the matrix.',
    grid: [
      'oooo',
      'oooo',
      'oooo',
      'oooo'
    ]
  },
  // Add more levels here...
];

export const getLevelById = (id: string): Level | undefined => {
  return levels.find(level => level.id === id);
};

export const getNextLevelId = (currentId: string): string | undefined => {
  const currentIndex = levels.findIndex(level => level.id === currentId);
  if (currentIndex < levels.length - 1) {
    return levels[currentIndex + 1].id;
  }
  return undefined;
};
