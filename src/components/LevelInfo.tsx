import React from 'react';

interface LevelInfoProps {
  gridSize: number;
  moveCount: number;
  gameWon: boolean;
}

const LevelInfo: React.FC<LevelInfoProps> = ({
  gridSize,
  moveCount,
  gameWon,
}) => {
  return (
    <div className="mb-4 text-center">
      <h2 className="text-2xl font-bold mb-2 text-gray-700">Level {gridSize - 2}</h2>
      <p className="text-gray-600">
        Moves: {moveCount}
      </p>
      {gameWon && (
        <p className="text-green-500 font-bold mt-2">Level Complete!</p>
      )}
    </div>
  );
};

export default LevelInfo;