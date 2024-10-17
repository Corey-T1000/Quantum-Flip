import React from 'react';

interface GameControlsProps {
  onNextLevel: () => void;
  gameWon: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({
  onNextLevel,
  gameWon,
}) => {
  return (
    <div className="mt-4 flex justify-center">
      {gameWon && (
        <button
          className="neumorphic-button bg-green-200"
          onClick={onNextLevel}
        >
          Next Level
        </button>
      )}
    </div>
  );
};

export default GameControls;