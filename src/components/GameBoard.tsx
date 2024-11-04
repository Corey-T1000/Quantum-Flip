import React from 'react';
import { ColorPalette } from './terminal/types';
import { HintLevel } from '../store/gameSlice';

interface GameBoardProps {
  grid: boolean[][];
  onTileClick: (row: number, col: number) => void;
  hintTile: [number, number] | null;
  hintLevel: HintLevel;
  affectedAreas: [number, number][];
  possibleMoveCount: number;
  colorPalette: ColorPalette;
  debugMode: boolean;
  solution: [number, number][];
  onHintUsed: () => void;
}

const GameBoard: React.FC<GameBoardProps> = ({
  grid,
  onTileClick,
  hintTile,
  hintLevel,
  affectedAreas,
  possibleMoveCount,
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

  const getHintStyles = (rowIndex: number, colIndex: number) => {
    const isHint = hintTile && hintTile[0] === rowIndex && hintTile[1] === colIndex;
    const isAffectedArea = affectedAreas.some(([r, c]) => r === rowIndex && c === colIndex);
    
    let hintStyle = {};
    let hintClass = 'aspect-square rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none relative';
    
    switch (hintLevel) {
      case HintLevel.COUNT:
        // No visual highlight for COUNT level
        break;
      case HintLevel.AREA:
        if (isAffectedArea) {
          hintStyle = {
            boxShadow: `0 0 10px ${colorPalette.darkest}`,
            border: `1px solid ${colorPalette.darkest}`,
            transform: 'scale(1.02)'
          };
        }
        break;
      case HintLevel.SPECIFIC:
        if (isHint) {
          hintStyle = {
            boxShadow: `0 0 15px ${colorPalette.darkest}, 
                       0 0 30px ${colorPalette.darkest}, 
                       inset 0 0 20px ${colorPalette.darkest}`,
            border: `2px solid ${colorPalette.darkest}`,
            transform: 'scale(1.05)'
          };
          hintClass += ' animate-pulse';
        }
        break;
      default:
        break;
    }
    
    return { hintStyle, hintClass };
  };

  return (
    <div className="relative">
      {hintLevel === HintLevel.COUNT && (
        <div className="absolute -top-8 left-0 right-0 text-center text-lg font-bold" 
             style={{ color: colorPalette.darkest }}>
          Possible Moves: {possibleMoveCount}
        </div>
      )}
      <div className="flex flex-col gap-2 max-w-[600px] mx-auto">
        {grid.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="flex gap-2">
            {row.map((tile, colIndex) => {
              const isSolution = debugMode && solution.some(([r, c]) => r === rowIndex && c === colIndex);
              const { hintStyle, hintClass } = getHintStyles(rowIndex, colIndex);

              return (
                <div key={`${rowIndex}-${colIndex}`} className="relative flex-1">
                  <button
                    className={hintClass}
                    onClick={() => handleTileClick(rowIndex, colIndex)}
                    style={{
                      backgroundColor: tile ? colorPalette.light : colorPalette.dark,
                      boxShadow: `inset 3px 3px 6px ${tile ? colorPalette.darkest + '1A' : colorPalette.darkest + '40'},
                                 inset -3px -3px 6px ${tile ? colorPalette.light + 'CC' : colorPalette.dark + 'CC'}`,
                      border: isSolution ? `2px solid ${colorPalette.darkest}` : 'none',
                      width: '100%',
                      height: '100%',
                      aspectRatio: '1',
                      ...hintStyle
                    }}
                  />
                  {debugMode && (
                    <div 
                      className="absolute inset-0 flex items-center justify-center text-sm font-bold pointer-events-none"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        color: '#000000',
                        borderRadius: '4px',
                        padding: '2px',
                        border: '1px solid rgba(0, 0, 0, 0.2)',
                        zIndex: 10
                      }}
                    >
                      {rowIndex},{colIndex}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
