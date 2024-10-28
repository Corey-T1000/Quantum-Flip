declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

export interface AudioContextType extends AudioContext {
  webkitAudioContext?: typeof AudioContext;
}

export interface AudioManager {
  context: AudioContext;
  playTileInteraction: () => void;
  playLevelCompletion: () => void;
}

export interface SoundAsset {
  path: string;
  type: 'interaction' | 'completion';
  isLoaded: boolean;
}

export interface AudioHook {
  playTileInteractionSound: () => void;
  playLevelCompletionSound: () => void;
  isAudioLoaded: () => boolean;
}

export {};
