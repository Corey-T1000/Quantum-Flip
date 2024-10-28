import React from 'react';
import { ColorPalette } from './terminal/types';

interface GameBoardProps {
  grid: boolean[][];
  onTileClick: (row: number, col: number) => void;
  hintTile: [number, number] | null;
  colorPalette: ColorPalette;
  debugMode: boolean;
  solution: [number, number][];
  onHintUsed: () => void;
}

const GameBoard: React.FC<GameBoardProps> = ({
  grid,
  onTileClick,
  hintTile,
  colorPalette,
  debugMode,
  solution,
  onHintUsed
}) => {
  const handleTileClick = (row: number, col: number) => {
    if (hintTile && hintTile[0] === row && hintTile[1] === col) {
      onHintUsed();
    }
    onTileClick(row, col);
  };

  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${grid.length}, minmax(0, 1fr))` }}>
      {grid.map((row, rowIndex) => (
        row.map((tile, colIndex) => {
          const isHint = hintTile && hintTile[0] === rowIndex && hintTile[1] === colIndex;
          const isSolution = debugMode && solution.some(([r, c]) => r === rowIndex && c === colIndex);

          return (
            <button
              key={`${rowIndex}-${colIndex}`}
              className={`aspect-square rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none ${isHint ? 'animate-pulse' : ''}`}
              onClick={() => handleTileClick(rowIndex, colIndex)}
              style={{
                backgroundColor: tile ? colorPalette.light : colorPalette.dark,
                boxShadow: isHint ? 
                  `0 0 15px ${colorPalette.darkest}, 
                   0 0 30px ${colorPalette.darkest}, 
                   inset 0 0 20px ${colorPalette.darkest}` : 
                  `inset 3px 3px 6px ${tile ? colorPalette.darkest + '1A' : colorPalette.darkest + '40'},
                   inset -3px -3px 6px ${tile ? colorPalette.light + 'CC' : colorPalette.dark + 'CC'}`,
                border: isHint ? `2px solid ${colorPalette.darkest}` : 
                        isSolution ? `2px solid ${colorPalette.darkest}` : 'none',
                transform: isHint ? 'scale(1.05)' : 'none'
              }}
            />
          );
        })
      ))}
    </div>
  );
};

export default GameBoard;
