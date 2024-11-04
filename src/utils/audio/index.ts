import { useCallback, useState, useEffect } from 'react';
import { AudioManagerHook } from '../../types';

export const useAudioManager = (): AudioManagerHook => {
  const [tileInteractionSound, setTileInteractionSound] = useState<HTMLAudioElement | null>(null);
  const [levelCompletionSound, setLevelCompletionSound] = useState<HTMLAudioElement | null>(null);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);

  useEffect(() => {
    const tileSound = new Audio('/sounds/tile-interaction.mp3');
    const levelSound = new Audio('/sounds/level-completion.mp3');

    Promise.all([
      tileSound.load(),
      levelSound.load()
    ]).then(() => {
      setTileInteractionSound(tileSound);
      setLevelCompletionSound(levelSound);
      setIsAudioLoaded(true);
    }).catch(error => {
      console.error('Failed to load audio:', error);
      setIsAudioLoaded(false);
    });

    return () => {
      if (tileSound) {
        tileSound.pause();
      }
      if (levelSound) {
        levelSound.pause();
      }
    };
  }, []);

  const playTileInteractionSound = useCallback(() => {
    if (tileInteractionSound) {
      tileInteractionSound.currentTime = 0;
      tileInteractionSound.play().catch(console.error);
    }
  }, [tileInteractionSound]);

  const playLevelCompletionSound = useCallback(() => {
    if (levelCompletionSound) {
      levelCompletionSound.currentTime = 0;
      levelCompletionSound.play().catch(console.error);
    }
  }, [levelCompletionSound]);

  return {
    playTileInteractionSound,
    playLevelCompletionSound,
    isAudioLoaded
  };
};
