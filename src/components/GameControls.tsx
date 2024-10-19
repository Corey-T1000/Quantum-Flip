import React from 'react';

interface GameControlsProps {
  onNextLevel: () => void;
  gameWon: boolean;
  textColor: string;
}

const GameControls: React.FC<GameControlsProps> = ({
  onNextLevel,
  gameWon,
  textColor,
}) => {
  return (
    <div className="mt-4 flex justify-center">
      {gameWon && (
        <button
          className="neumorphic-button"
          onClick={onNextLevel}
          style={{ color: textColor }}
        >
          Advance to Next Matrix
        </button>
      )}
    </div>
  );
};

export default GameControls;