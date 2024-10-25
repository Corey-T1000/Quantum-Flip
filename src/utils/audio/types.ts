export interface AudioManager {
  playTileInteractionSound: () => void;
  playLevelCompletionSound: () => void;
  isAudioLoaded: () => boolean;
}

export interface SoundAsset {
  audio: HTMLAudioElement;
  isLoaded: boolean;
  path: string;
}
