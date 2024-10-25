import React, { useMemo } from 'react';
import { BoardState } from '../types';

interface GameBoardProps {
  grid: BoardState;
  onTileClick: (row: number, col: number) => void;
  colorPalette: { light: string; dark: string; lightHC: string; darkHC: string };
  hintTile: [number, number] | null;
  debugMode: boolean;
  solution?: [number, number][];
  onHintUsed: () => void;
}

const GameBoard: React.FC<GameBoardProps> = ({
  grid,
  onTileClick,
  colorPalette,
  hintTile,
  debugMode,
  solution,
  onHintUsed,
}) => {
  const gridStyle = useMemo(() => ({
    gridTemplateColumns: `repeat(${grid.length}, minmax(0, 1fr))`,
  }), [grid.length]);

  const handleTileClick = (row: number, col: number) => {
    onTileClick(row, col);
    if (hintTile && hintTile[0] === row && hintTile[1] === col) {
      onHintUsed();
    }
  };

  return (
    <div className="relative">
      <div className="grid gap-4" style={gridStyle}>
        {grid.map((row, rowIndex) =>
          row.map((tile, colIndex) => {
            const isHintTile = hintTile && hintTile[0] === rowIndex && hintTile[1] === colIndex;
            const isSolutionTile = debugMode && solution?.some(([r, c]) => r === rowIndex && c === colIndex);
            const tileStyle: React.CSSProperties = {
              backgroundColor: tile ? colorPalette.light : colorPalette.dark,
              boxShadow: tile
                ? '3px 3px 6px rgba(0, 0, 0, 0.1), -3px -3px 6px rgba(255, 255, 255, 0.1)'
                : 'inset 3px 3px 6px rgba(0, 0, 0, 0.1), inset -3px -3px 6px rgba(255, 255, 255, 0.1)',
              position: 'relative',
              cursor: 'pointer',
            };

            if (isHintTile) {
              tileStyle.backgroundColor = '#FFD700';
              tileStyle.boxShadow = `0 0 20px #FFD700`;
              tileStyle.animation = 'pulse-hint 1.5s infinite';
            }

            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                className={`w-full aspect-square rounded-lg transition-all duration-300 ease-in-out relative ${
                  isSolutionTile ? 'ring-4 ring-green-400' : ''
                }`}
                onClick={() => handleTileClick(rowIndex, colIndex)}
                style={tileStyle}
              >
                {debugMode && (
                  <span className="absolute top-1 left-1 text-xs font-bold text-white bg-black bg-opacity-50 px-1 rounded">
                    {`${rowIndex},${colIndex}`}
                  </span>
                )}
                {debugMode && isSolutionTile && (
                  <span className="absolute bottom-1 right-1 text-xs font-bold text-white bg-green-500 bg-opacity-50 px-1 rounded">
                    {solution!.findIndex(([r, c]) => r === rowIndex && c === colIndex) + 1}
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>
      {debugMode && (
        <div className="absolute top-0 left-0 bg-black bg-opacity-75 text-white p-2 rounded">
          <h3 className="font-bold">Debug Mode</h3>
          <p>Grid Size: {grid.length}x{grid.length}</p>
          <p>Solution Length: {solution?.length || 'N/A'}</p>
        </div>
      )}
      <style>
        {`
          @keyframes pulse-hint {
            0% {
              transform: scale(1);
              box-shadow: 0 0 20px #FFD700;
            }
            50% {
              transform: scale(1.05);
              box-shadow: 0 0 30px #FFD700;
            }
            100% {
              transform: scale(1);
              box-shadow: 0 0 20px #FFD700;
            }
          }
        `}
      </style>
    </div>
  );
};

export default React.memo(GameBoard);
