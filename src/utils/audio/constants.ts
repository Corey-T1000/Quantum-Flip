import { SoundAsset } from './types';

export const SOUND_ASSETS: Record<string, SoundAsset> = {
  tileInteraction: {
    audio: new Audio('/sounds/tile-interaction.mp3'),
    isLoaded: false,
    path: '/sounds/tile-interaction.mp3'
  },
  levelCompletion: {
    audio: new Audio('/sounds/level-completion.mp3'),
    isLoaded: false,
    path: '/sounds/level-completion.mp3'
  }
};
