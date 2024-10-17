import React from 'react';

interface GameBoardProps {
  grid: boolean[][];
  onTileClick: (row: number, col: number) => void;
  hintTile: [number, number] | null;
  highContrast: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({ grid, onTileClick, hintTile, highContrast }) => {
  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${grid.length}, minmax(0, 1fr))` }}>
      {grid.map((row, rowIndex) =>
        row.map((tile, colIndex) => (
          <button
            key={`${rowIndex}-${colIndex}`}
            className={`w-full aspect-square ${
              tile
                ? highContrast
                  ? 'neumorphic-tile-light-high-contrast'
                  : 'neumorphic-tile-light'
                : highContrast
                ? 'neumorphic-tile-dark-high-contrast'
                : 'neumorphic-tile-dark'
            } ${hintTile && hintTile[0] === rowIndex && hintTile[1] === colIndex ? 'ring-4 ring-yellow-400' : ''}`}
            onClick={() => onTileClick(rowIndex, colIndex)}
          />
        ))
      )}
    </div>
  );
};

export default GameBoard;