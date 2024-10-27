import React, { useRef, useEffect } from 'react';
import { css } from '@emotion/css';
import TerminalLine from './TerminalLine';
import StatusBar from './StatusBar';
import { getTerminalStyles } from './terminalStyles';
import { ColorPalette, TerminalEntry } from './types';

interface TerminalProps {
  entries: TerminalEntry[];
  levelName: string;
  moveCount: number;
  tutorialMessage: string | null;
  debugMode: boolean;
  progress: number;
  dominantState: 'light' | 'dark';
  colorPalette: ColorPalette;
}

const Terminal: React.FC<TerminalProps> = ({
  entries,
  levelName,
  moveCount,
  tutorialMessage,
  debugMode,
  progress,
  dominantState,
  colorPalette
}) => {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [entries]);

  const terminalStyles = getTerminalStyles(colorPalette);

  return (
    <div>
      <div ref={terminalRef} className={css`${terminalStyles} .terminal-window`}>
        {entries.map((entry, index) => (
          <TerminalLine
            key={index}
            timestamp={entry.timestamp}
            content={Array.isArray(entry.content) ? entry.content : [entry.content]}
            type={entry.type}
            colorPalette={colorPalette}
          />
        ))}
      </div>
      <StatusBar
        levelName={levelName}
        moveCount={moveCount}
        tutorialMessage={tutorialMessage}
        debugMode={debugMode}
        progress={progress}
        dominantState={dominantState}
        colorPalette={colorPalette}
      />
    </div>
  );
};

export default Terminal;
