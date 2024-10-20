import { useState, useEffect } from 'react';

// These URLs should point to your sound files in the public folder
const TILE_INTERACTION_SOUND_URL = '/sounds/tile-interaction';
const LEVEL_COMPLETION_SOUND_URL = '/sounds/level-completion';

const audioFormats = ['.mp3', '.wav', '.ogg'];

export const useAudio = () => {
  const [tileInteractionSound, setTileInteractionSound] = useState<HTMLAudioElement | null>(null);
  const [levelCompletionSound, setLevelCompletionSound] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    const loadAudio = async (baseUrl: string) => {
      for (const format of audioFormats) {
        const audio = new Audio(baseUrl + format);
        try {
          await new Promise((resolve, reject) => {
            audio.onloadeddata = resolve;
            audio.onerror = (e) => {
              console.error(`Error loading ${baseUrl}${format}:`, e);
              reject(e);
            };
            audio.load();
          });
          console.log(`Successfully loaded audio: ${baseUrl}${format}`);
          return audio;
        } catch (error) {
          console.warn(`Failed to load audio from ${baseUrl}${format}:`, error);
        }
      }
      console.error(`Failed to load audio from ${baseUrl} with any supported format`);
      return null;
    };

    loadAudio(TILE_INTERACTION_SOUND_URL).then(audio => {
      console.log('Tile interaction sound loaded:', audio);
      setTileInteractionSound(audio);
    });
    loadAudio(LEVEL_COMPLETION_SOUND_URL).then(audio => {
      console.log('Level completion sound loaded:', audio);
      setLevelCompletionSound(audio);
    });
  }, []);

  const playSound = (sound: HTMLAudioElement | null, soundName: string) => {
    if (sound) {
      console.log(`Attempting to play ${soundName} sound`);
      sound.currentTime = 0;
      sound.play().then(() => {
        console.log(`${soundName} sound played successfully`);
      }).catch(error => {
        console.error(`Error playing ${soundName} sound:`, error);
      });
    } else {
      console.warn(`Attempted to play ${soundName} sound, but audio was not loaded. Make sure audio files are present in the public/sounds/ directory.`);
    }
  };

  const playTileInteractionSound = () => playSound(tileInteractionSound, 'tile interaction');
  const playLevelCompletionSound = () => playSound(levelCompletionSound, 'level completion');

  return {
    playTileInteractionSound,
    playLevelCompletionSound,
  };
};

export const setVolume = (volume: number) => {
  const sounds = document.querySelectorAll('audio');
  sounds.forEach(sound => {
    sound.volume = volume;
  });
  console.log('Volume set to:', volume);
};
