import React from 'react';
import { css } from '@emotion/css';
import { getTerminalStyles } from './terminalStyles';
import { ColorPalette } from './types';

interface StatusBarProps {
  levelName: string;
  moveCount: number;
  tutorialMessage: string | null;
  debugMode: boolean;
  progress: number;
  dominantState: 'light' | 'dark';
  colorPalette: ColorPalette;
}

const StatusBar: React.FC<StatusBarProps> = ({
  levelName,
  moveCount,
  tutorialMessage,
  debugMode,
  progress,
  dominantState,
  colorPalette
}) => {
  const terminalStyles = getTerminalStyles(colorPalette);

  return (
    <div className={css`${terminalStyles} .terminal-window`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <span>{levelName}</span>
          <span>Moves: {moveCount}</span>
        </div>
        <div className="flex items-center space-x-4">
          {debugMode && (
            <span>
              Progress: {(progress * 100).toFixed(1)}%
            </span>
          )}
          <span>
            State: {dominantState}
          </span>
        </div>
      </div>
      {tutorialMessage && (
        <div className="mt-2">
          {tutorialMessage}
        </div>
      )}
    </div>
  );
};

export default StatusBar;
