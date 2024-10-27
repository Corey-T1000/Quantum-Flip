declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

export interface AudioContextType extends AudioContext {
  webkitAudioContext?: typeof AudioContext;
}

export interface AudioHook {
  playTileInteractionSound: () => void;
  playLevelCompletionSound: () => void;
  isAudioLoaded: () => boolean;
}

export {};
