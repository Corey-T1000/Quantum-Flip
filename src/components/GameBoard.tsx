import React, { useMemo } from 'react';
import { BoardState } from '../types';

interface GameBoardProps {
  grid: BoardState;
  onTileClick: (row: number, col: number) => void;
  colorPalette: { light: string; dark: string; lightHC: string; darkHC: string };
  hintTile: [number, number] | null;
}

const GameBoard: React.FC<GameBoardProps> = ({
  grid,
  onTileClick,
  colorPalette,
  hintTile,
}) => {
  const gridStyle = useMemo(() => ({
    gridTemplateColumns: `repeat(${grid.length}, minmax(0, 1fr))`,
  }), [grid.length]);

  return (
    <div className="grid gap-4" style={gridStyle}>
      {grid.map((row, rowIndex) =>
        row.map((tile, colIndex) => {
          const isHintTile = hintTile && hintTile[0] === rowIndex && hintTile[1] === colIndex;
          const tileStyle = {
            backgroundColor: tile ? colorPalette.light : colorPalette.dark,
            boxShadow: tile
              ? '3px 3px 6px rgba(0, 0, 0, 0.1), -3px -3px 6px rgba(255, 255, 255, 0.1)'
              : 'inset 3px 3px 6px rgba(0, 0, 0, 0.1), inset -3px -3px 6px rgba(255, 255, 255, 0.1)',
          };

          return (
            <button
              key={`${rowIndex}-${colIndex}`}
              className={`w-full aspect-square rounded-lg transition-all duration-300 ease-in-out ${
                isHintTile ? 'ring-4 ring-yellow-400' : ''
              }`}
              onClick={() => onTileClick(rowIndex, colIndex)}
              style={tileStyle}
            />
          );
        })
      )}
    </div>
  );
};

export default React.memo(GameBoard);
