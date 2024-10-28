import { useCallback, useEffect, useState } from 'react';
import type { AudioHook } from './types';
import { SOUND_ASSETS } from './constants';

const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;

const logAudioEvent = (message: string, error?: unknown) => {
  if (process.env.NODE_ENV === 'development') {
    const timestamp = new Date().toISOString();
    if (error) {
      console.error(`[Audio System ${timestamp}] ${message}`, error);
    } else {
      console.info(`[Audio System ${timestamp}] ${message}`);
    }
  }
};

const loadSound = async (url: string): Promise<AudioBuffer> => {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const audioContext = new AudioContextConstructor();
  await audioContext.resume(); // Resume context after user gesture
  return await audioContext.decodeAudioData(arrayBuffer);
};

export const useAudio = (): AudioHook => {
  const [tileInteractionSound, setTileInteractionSound] = useState<AudioBuffer | null>(null);
  const [levelCompletionSound, setLevelCompletionSound] = useState<AudioBuffer | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  useEffect(() => {
    const context = new AudioContextConstructor();
    setAudioContext(context);

    const loadSounds = async () => {
      try {
        const [tile, completion] = await Promise.all([
          loadSound(SOUND_ASSETS[0].path), // tile interaction
          loadSound(SOUND_ASSETS[1].path)  // level completion
        ]);
        setTileInteractionSound(tile);
        setLevelCompletionSound(completion);
        logAudioEvent('All sounds loaded successfully');
      } catch (error) {
        logAudioEvent('Failed to load sounds', error);
      }
    };

    // Only load sounds after a user interaction
    const handleFirstInteraction = () => {
      loadSounds();
      document.removeEventListener('click', handleFirstInteraction);
    };
    document.addEventListener('click', handleFirstInteraction);

    return () => {
      context.close();
      document.removeEventListener('click', handleFirstInteraction);
    };
  }, []);

  const playSound = useCallback(async (buffer: AudioBuffer | null) => {
    if (!audioContext || !buffer) return;

    try {
      await audioContext.resume(); // Resume context before playing
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.start();
    } catch (error) {
      logAudioEvent('Failed to play sound', error);
    }
  }, [audioContext]);

  const playTileInteractionSound = useCallback(() => {
    playSound(tileInteractionSound);
  }, [playSound, tileInteractionSound]);

  const playLevelCompletionSound = useCallback(() => {
    playSound(levelCompletionSound);
  }, [playSound, levelCompletionSound]);

  const isAudioLoaded = useCallback(() => {
    return !!tileInteractionSound && !!levelCompletionSound;
  }, [tileInteractionSound, levelCompletionSound]);

  return {
    playTileInteractionSound,
    playLevelCompletionSound,
    isAudioLoaded
  };
};
