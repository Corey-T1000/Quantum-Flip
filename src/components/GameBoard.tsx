import React from 'react';
import { SolutionStep } from '../utils/solutionFinder';
import { T9_KEYS } from '../utils/t9Keyboard';

interface GameBoardProps {
  grid: boolean[][];
  onTileClick: (row: number, col: number) => void;
  solutionPath: SolutionStep[] | null;
  highContrast: boolean;
  colorPalette: { light: string; dark: string; lightHC: string; darkHC: string };
  isT9Mode?: boolean;
  currentText?: string;
}

const GameBoard: React.FC<GameBoardProps> = ({
  grid,
  onTileClick,
  solutionPath,
  colorPalette,
  isT9Mode,
  currentText,
}) => {
  const getSolutionStep = (row: number, col: number): number | null => {
    if (!solutionPath) return null;
    const step = solutionPath.find(s => s.row === row && s.col === col);
    return step ? step.step : null;
  };

  const getT9Key = (row: number, col: number): string => {
    const index = row * 3 + col;
    if (index < T9_KEYS.length) {
      return T9_KEYS[index].letters;
    }
    if (row === 3) {
      if (col === 0) return 'del';
      if (col === 1) return 'space';
      if (col === 2) return 'send';
    }
    return '';
  };

  const getT9Number = (row: number, col: number): string => {
    const index = row * 3 + col;
    if (index < T9_KEYS.length) {
      return T9_KEYS[index].number;
    }
    if (row === 3) {
      if (col === 0) return '*';
      if (col === 1) return '0';
      if (col === 2) return '#';
    }
    return '';
  };

  return (
    <div className="vintage-terminal w-full h-full p-[3%] rounded-lg">
      {isT9Mode && (
        <div className="mb-4 p-2 border-2 border-[var(--amber-primary)] bg-[var(--crt-background)] min-h-[40px]">
          <span className="terminal-text">{currentText}<span className="terminal-cursor"></span></span>
        </div>
      )}
      <div 
        className="grid h-full w-full"
        style={{ 
          gap: '3%',
          gridTemplateColumns: `repeat(${grid[0].length}, 1fr)`,
          gridTemplateRows: `repeat(${isT9Mode ? 4 : grid.length}, 1fr)`,
        }}
      >
        {Array(isT9Mode ? 4 : grid.length).fill(null).map((_, rowIndex) =>
          Array(grid[0].length).fill(null).map((_, colIndex) => {
            const stepNumber = getSolutionStep(rowIndex, colIndex);
            const t9Key = isT9Mode ? getT9Key(rowIndex, colIndex) : null;
            const t9Number = isT9Mode ? getT9Number(rowIndex, colIndex) : null;
            const isActive = !isT9Mode && grid[rowIndex]?.[colIndex];
            
            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                className="relative w-full h-full transition-all duration-300 ease-in-out"
                onClick={() => onTileClick(rowIndex, colIndex)}
                style={{
                  backgroundColor: 'transparent',
                  border: `2px solid ${isActive ? 'var(--amber-primary)' : 'var(--amber-dim)'}`,
                  boxShadow: isActive
                    ? '0 0 10px var(--amber-glow), inset 0 0 5px var(--amber-glow)'
                    : 'none',
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundColor: isActive ? 'var(--amber-primary)' : 'transparent',
                    opacity: isActive ? 0.2 : 0,
                  }}
                />
                {stepNumber !== null && !isT9Mode && (
                  <div className="absolute inset-0 flex items-center justify-center font-bold text-2xl hint-number terminal-text">
                    {stepNumber}
                  </div>
                )}
                {isT9Mode && (
                  <div className="flex flex-col items-center justify-center h-full">
                    <span className="terminal-text text-xl">{t9Number}</span>
                    <span className="terminal-text text-xs opacity-70">{t9Key}</span>
                  </div>
                )}
                <div 
                  className="absolute inset-0"
                  style={{
                    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 176, 0, 0.03) 3px, transparent 3px)',
                    pointerEvents: 'none',
                  }}
                />
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default GameBoard;