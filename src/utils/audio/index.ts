import { useCallback, useEffect, useState } from 'react';
import type { AudioHook } from './types';

const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;

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
          loadSound('/sounds/tile-interaction.mp3'),
          loadSound('/sounds/level-completion.mp3')
        ]);
        setTileInteractionSound(tile);
        setLevelCompletionSound(completion);
        console.log('Sound loaded: /sounds/tile-interaction.mp3');
        console.log('Sound loaded: /sounds/level-completion.mp3');
      } catch (error) {
        console.error('Failed to load sounds:', error);
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

    await audioContext.resume(); // Resume context before playing
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start();
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
