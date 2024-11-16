import { useState, useCallback } from 'react';
import { aiNarrator } from '../utils/improvedAINarrator';
import { StoryProgress, StoryChoice, Relationship } from '../types/storyTypes';

const DEFAULT_RELATIONSHIP: Relationship = {
  trust: 0,
  understanding: 0,
  synergy: 0
};

const DEFAULT_PROGRESS: StoryProgress = {
  completedLevels: [],
  relationship: DEFAULT_RELATIONSHIP
};

interface GameState {
  disruptions: number;
  isNewSequence: boolean;
  currentSequence: number;
  isT9Mode?: boolean;
  gameWon?: boolean;
}

export function useAINarrator() {
  const [progress, setProgress] = useState<StoryProgress>(DEFAULT_PROGRESS);
  const [gameState, setGameState] = useState<GameState>({
    disruptions: 0,
    isNewSequence: true,
    currentSequence: 1
  });
  const [currentMessage, setCurrentMessage] = useState<{
    text: string;
    type: string;
    choices?: string[];
  } | null>(null);

  const getNextMessage = useCallback((
    state: 'start' | 'win' | 'choice',
    choice?: StoryChoice
  ) => {
    const result = aiNarrator.getNextMessage(progress, state, choice, gameState);
    setProgress(result.progress);
    setCurrentMessage({
      text: result.text,
      type: result.type,
      choices: result.choices
    });
    return result;
  }, [progress, gameState]);

  const updateGameState = useCallback((
    newDisruptions: number,
    newSequence?: number,
    isT9Mode?: boolean,
    gameWon?: boolean
  ) => {
    setGameState(prev => ({
      disruptions: newDisruptions,
      isNewSequence: newSequence !== undefined && newSequence !== prev.currentSequence,
      currentSequence: newSequence ?? prev.currentSequence,
      isT9Mode,
      gameWon
    }));
  }, []);

  const completeLevel = useCallback((levelId: string) => {
    setProgress(prev => ({
      ...prev,
      completedLevels: [...prev.completedLevels, levelId]
    }));
  }, []);

  const makeChoice = useCallback((choice: StoryChoice) => {
    return getNextMessage('choice', choice);
  }, [getNextMessage]);

  const onWin = useCallback(() => {
    return getNextMessage('win');
  }, [getNextMessage]);

  return {
    progress,
    gameState,
    currentMessage,
    getNextMessage,
    updateGameState,
    completeLevel,
    makeChoice,
    onWin
  };
}
