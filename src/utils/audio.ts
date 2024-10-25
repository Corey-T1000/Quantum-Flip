const tileInteractionSound = new Audio('/sounds/tile-interaction.mp3');
const levelCompletionSound = new Audio('/sounds/level-completion.mp3');

let isTileInteractionSoundLoaded = false;
let isLevelCompletionSoundLoaded = false;

tileInteractionSound.addEventListener('canplaythrough', () => {
  console.log('Tile interaction sound loaded:', tileInteractionSound);
  isTileInteractionSoundLoaded = true;
});

levelCompletionSound.addEventListener('canplaythrough', () => {
  console.log('Level completion sound loaded:', levelCompletionSound);
  isLevelCompletionSoundLoaded = true;
});

const loadAudio = () => {
  tileInteractionSound.load();
  levelCompletionSound.load();
};

loadAudio();

export const useAudio = () => {
  const playTileInteractionSound = () => {
    if (isTileInteractionSoundLoaded) {
      console.log('Playing tile interaction sound');
      tileInteractionSound.play().catch(error => {
        console.error('Error playing tile interaction sound:', error);
      });
    } else {
      console.warn('Tile interaction sound not loaded yet');
    }
  };

  const playLevelCompletionSound = () => {
    if (isLevelCompletionSoundLoaded) {
      console.log('Playing level completion sound');
      levelCompletionSound.play().catch(error => {
        console.error('Error playing level completion sound:', error);
      });
    } else {
      console.warn('Level completion sound not loaded yet');
    }
  };

  const isAudioLoaded = () => isTileInteractionSoundLoaded && isLevelCompletionSoundLoaded;

  return {
    playTileInteractionSound,
    playLevelCompletionSound,
    isAudioLoaded,
  };
};
