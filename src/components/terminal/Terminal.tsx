import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { ColorPalette, TerminalEntry } from './types';
import TerminalLine from './TerminalLine';
import StatusBar from './StatusBar';

interface TerminalProps {
  levelName: string;
  moveCount: number;
  colorPalette: ColorPalette;
  tutorialMessage: string | null;
  debugMode: boolean;
  progress: number;
  dominantState: 'light' | 'dark';
  currentLevelMoves: number;
  terminalHistory: TerminalEntry[];
  showTimestamps: boolean;
}

export interface TerminalHandle {
  addTerminalEntry: (entry: TerminalEntry) => void;
}

const Terminal = forwardRef<TerminalHandle, TerminalProps>(({
  levelName,
  colorPalette,
  tutorialMessage,
  debugMode,
  progress,
  dominantState,
  currentLevelMoves,
  terminalHistory,
  showTimestamps
}, ref) => {
  const terminalRef = useRef<HTMLDivElement>(null);

  const addTerminalEntry = (entry: TerminalEntry) => {
    if (terminalRef.current) {
      setTimeout(() => {
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
      }, 100);
    }
  };

  useImperativeHandle(ref, () => ({
    addTerminalEntry
  }));

  return (
    <div className="relative">
      <div ref={terminalRef} className="terminal-window">
        {terminalHistory.map((entry, index) => (
          <TerminalLine
            key={index}
            {...entry}
            showTimestamps={showTimestamps}
            colorPalette={colorPalette}
          />
        ))}
        <div className="terminal-line">
          <span className="prompt-symbol text-lg md:text-base">❯</span>
          <span className="typing-effect">█</span>
        </div>
      </div>
      <StatusBar
        levelName={levelName}
        dominantState={dominantState}
        currentLevelMoves={currentLevelMoves}
        debugMode={debugMode}
        progress={progress}
        tutorialMessage={tutorialMessage}
        colorPalette={colorPalette}
      />
      <style>
        {`
          .terminal-window {
            padding: 1.5rem;
            min-height: min(250px, 40vh);
            max-height: min(350px, 60vh);
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            background: linear-gradient(180deg, ${colorPalette.darkest}F0 0%, ${colorPalette.darkest} 100%);
            box-shadow: inset 0 0 20px ${colorPalette.darkest}80;
            overscroll-behavior: contain;
            scroll-behavior: smooth;
            touch-action: pan-y;
          }

          @media (min-width: 768px) {
            .terminal-window {
              padding: 1rem;
              min-height: 120px;
              max-height: 200px;
            }
          }

          /* Improve touch scrolling */
          @media (hover: none) and (pointer: coarse) {
            .terminal-window {
              scrollbar-width: none;
              -ms-overflow-style: none;
              -webkit-overflow-scrolling: touch;
            }
            .terminal-window::-webkit-scrollbar {
              display: none;
            }
          }
        `}
      </style>
    </div>
  );
});

Terminal.displayName = 'Terminal';

export default Terminal;
