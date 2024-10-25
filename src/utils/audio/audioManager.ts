import { AudioManager, SoundAsset } from './types';
import { SOUND_ASSETS } from './constants';

const initializeAudio = () => {
  Object.values(SOUND_ASSETS).forEach(asset => {
    asset.audio.addEventListener('canplaythrough', () => {
      console.log(`Sound loaded: ${asset.path}`);
      asset.isLoaded = true;
    });

    asset.audio.addEventListener('error', (e) => {
      console.error(`Error loading sound ${asset.path}:`, e);
      asset.isLoaded = false;
    });

    asset.audio.load();
  });
};

const playSound = async (asset: SoundAsset) => {
  if (!asset.isLoaded) {
    console.warn(`Sound not loaded yet: ${asset.path}`);
    return;
  }

  try {
    // Reset the audio to the beginning if it's already playing
    asset.audio.currentTime = 0;
    await asset.audio.play();
  } catch (error) {
    console.error(`Error playing sound ${asset.path}:`, error);
  }
};

export const useAudio = (): AudioManager => {
  // Initialize audio on first use
  initializeAudio();

  return {
    playTileInteractionSound: () => {
      playSound(SOUND_ASSETS.tileInteraction);
    },

    playLevelCompletionSound: () => {
      playSound(SOUND_ASSETS.levelCompletion);
    },

    isAudioLoaded: () => {
      return Object.values(SOUND_ASSETS).every(asset => asset.isLoaded);
    }
  };
};
