import { StoryProgress } from '../types';

const PROGRESS_KEY = 'quantum_matrix_progress';

const getDefaultProgress = (): StoryProgress => ({
  completedLevels: [],
  averageMovesPerLevel: {},
  lastPlayedLevel: 0,
  totalPlayTime: 0,
  lastPlayed: new Date().toISOString()
});

export const loadProgress = (): StoryProgress => {
  try {
    const saved = localStorage.getItem(PROGRESS_KEY);
    if (!saved) {
      return getDefaultProgress();
    }
    const parsed = JSON.parse(saved);
    return {
      ...getDefaultProgress(),
      ...parsed
    };
  } catch (error) {
    console.error('Error loading progress:', error);
    return getDefaultProgress();
  }
};

export const saveProgress = (progress: StoryProgress): void => {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify({
      ...progress,
      lastPlayed: new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error saving progress:', error);
  }
};

export const updateLevelProgress = (
  level: number,
  moves: number,
  currentProgress: StoryProgress
): StoryProgress => {
  const progress = { ...currentProgress };
  
  // Ensure arrays and objects exist
  progress.completedLevels = progress.completedLevels || [];
  progress.averageMovesPerLevel = progress.averageMovesPerLevel || {};
  
  // Update completed levels
  if (!progress.completedLevels.includes(level)) {
    progress.completedLevels.push(level);
  }

  // Update average moves
  const currentAvg = progress.averageMovesPerLevel[level] || moves;
  progress.averageMovesPerLevel[level] = Math.round(
    (currentAvg + moves) / 2
  );

  // Update last played level
  progress.lastPlayedLevel = Math.max(level, progress.lastPlayedLevel || 0);
  
  // Update total play time
  progress.totalPlayTime = (progress.totalPlayTime || 0) + 1;

  saveProgress(progress);
  return progress;
};