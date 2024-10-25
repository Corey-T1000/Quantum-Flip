import React from 'react';
import { ColorPalette } from './types';
import { TerminalStyles } from './terminalStyles';

interface StatusBarProps {
  levelName: string;
  dominantState: 'light' | 'dark';
  currentLevelMoves: number;
  debugMode: boolean;
  progress: number;
  tutorialMessage: string | null;
  colorPalette: ColorPalette;
}

const StatusBar: React.FC<StatusBarProps> = ({
  levelName,
  dominantState,
  currentLevelMoves,
  debugMode,
  progress,
  tutorialMessage,
  colorPalette,
}) => {
  const styles = TerminalStyles(colorPalette);
  const progressChars = {
    empty: '·',
    filled: '•',
    separator: '·'
  };

  // Adjust progress width based on container width
  const progressWidth = window.innerWidth < 768 ? 48 : 96;
  const filledWidth = Math.floor(progress * progressWidth);

  return (
    <div className="terminal-status-bar font-mono text-base md:text-sm">
      <div className="flex flex-col gap-2 px-4 py-3 md:py-2" style={{ 
        borderTop: `1px solid ${colorPalette.darkest}CC`,
        background: `linear-gradient(180deg, ${colorPalette.darkest}CC 0%, ${colorPalette.darkest} 100%)`,
        boxShadow: `
          inset 3px 3px 6px ${colorPalette.darkest}40,
          inset -3px -3px 6px ${colorPalette.darkHC}10
        `
      }}>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <span style={{ color: colorPalette.text }} className="text-lg md:text-base">❯</span>
            <span style={{ color: colorPalette.text, fontWeight: 'bold' }}>
              {tutorialMessage ? "TUTORIAL" : `M${levelName}`}
            </span>
            <span style={{ color: `${colorPalette.text}44` }}>{progressChars.separator}</span>
            <span style={{ 
              color: dominantState === 'light' ? colorPalette.light : colorPalette.dark,
              textShadow: `0 0 10px ${dominantState === 'light' ? colorPalette.lightHC : colorPalette.darkHC}33`,
              fontWeight: 'bold'
            }}>
              {dominantState.toUpperCase()}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <span style={{ color: `${colorPalette.text}44` }}>{progressChars.separator}</span>
            <span style={{ color: `${colorPalette.text}CC` }}>{currentLevelMoves}ops</span>
            {debugMode && (
              <>
                <span style={{ color: `${colorPalette.text}44` }}>{progressChars.separator}</span>
                <span style={{ color: '#E0AF68', fontWeight: 'bold' }}>DEBUG</span>
              </>
            )}
          </div>
        </div>

        <div className="quantum-progress">
          <div className="progress-track">
            {Array(progressWidth).fill(null).map((_, i) => {
              const isFilled = i < filledWidth;
              return (
                <span
                  key={i}
                  style={{
                    color: isFilled ? 
                      (dominantState === 'light' ? colorPalette.light : colorPalette.dark) :
                      `${colorPalette.text}44`,
                    textShadow: isFilled ? 
                      `0 0 10px ${dominantState === 'light' ? colorPalette.lightHC : colorPalette.darkHC}33` : 
                      'none',
                    transition: 'all 0.3s ease-in-out'
                  }}
                >
                  {isFilled ? progressChars.filled : progressChars.empty}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
