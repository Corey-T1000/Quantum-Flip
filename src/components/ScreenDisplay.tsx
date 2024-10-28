import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import Terminal from './terminal/Terminal';
import { TerminalEntry, TerminalProps } from './terminal/types';

interface ScreenDisplayProps {
  levelName: string;
  moveCount: number;
  gameWon: boolean;
  colorPalette: {
    light: string;
    dark: string;
    darkest: string;
    lightHC: string;
    darkHC: string;
    text: string;
  };
  tutorialMessage: string | null;
  debugMode: boolean;
  progress: number;
  dominantState: 'light' | 'dark';
}

export interface ScreenDisplayHandle {
  addTerminalEntry: (entry: TerminalEntry) => void;
}

interface TerminalRefHandle {
  addTerminalEntry: (entry: TerminalEntry) => void;
}

const ScreenDisplay = forwardRef<ScreenDisplayHandle, ScreenDisplayProps>((props, ref) => {
  const {
    levelName,
    moveCount,
    gameWon,
    colorPalette,
    tutorialMessage,
    debugMode,
    progress,
    dominantState,
  } = props;

  const [visible, setVisible] = useState(false);
  const [terminalHistory, setTerminalHistory] = useState<TerminalEntry[]>([]);
  const [currentLevelMoves, setCurrentLevelMoves] = useState(0);
  const prevLevelRef = useRef(levelName);
  const terminalRef = useRef<TerminalRefHandle>(null);

  const getTimestamp = () => {
    const now = new Date();
    const ms = now.getMilliseconds().toString().padStart(3, '0');
    return `${now.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })}.${ms}`;
  };

  const addTerminalEntry = (entry: TerminalEntry) => {
    setTerminalHistory(prev => [...prev, entry]);
    terminalRef.current?.addTerminalEntry(entry);
  };

  useImperativeHandle(ref, () => ({
    addTerminalEntry
  }));

  useEffect(() => {
    const initMessages: TerminalEntry[] = [
      {
        timestamp: getTimestamp(),
        content: ['✨ Quantum Matrix Protocol initialized'],
        type: 'help'
      }
    ];
    setTerminalHistory(initMessages);
    setVisible(true);
  }, []);

  useEffect(() => {
    if (levelName !== prevLevelRef.current) {
      if (prevLevelRef.current && currentLevelMoves > 0) {
        addTerminalEntry({
          timestamp: getTimestamp(),
          content: [`Matrix state modified (${currentLevelMoves} moves)`],
          type: 'help'
        });
      }
      setCurrentLevelMoves(0);
      prevLevelRef.current = levelName;
    }
  }, [levelName, currentLevelMoves]);

  useEffect(() => {
    if (moveCount > 0) {
      setCurrentLevelMoves(prev => prev + 1);
    }
  }, [moveCount]);

  useEffect(() => {
    if (gameWon) {
      addTerminalEntry({
        timestamp: getTimestamp(),
        content: ['✨ Matrix alignment achieved. Proceeding to next quantum state...'],
        type: 'success'
      });
    }
  }, [gameWon]);

  const terminalProps: TerminalProps = {
    entries: terminalHistory,
    levelName,
    moveCount,
    tutorialMessage,
    debugMode,
    progress,
    dominantState,
    colorPalette,
    onReset: () => {},
    onRequestHint: () => {},
    onShowHelp: () => {},
    onOpenSettings: () => {},
    hintTile: null
  };

  return (
    <div 
      className={`rounded-lg mb-4 font-mono relative overflow-hidden ${visible ? 'opacity-100' : 'opacity-0'}`}
      style={{ 
        backgroundColor: colorPalette.darkest,
        transition: 'opacity 0.3s ease-in-out',
        boxShadow: `
          5px 5px 10px ${colorPalette.darkest}40,
          -5px -5px 10px ${colorPalette.light}CC,
          inset 0 0 20px ${colorPalette.darkest}80
        `,
        border: `1px solid ${colorPalette.darkest}CC`,
      }}
    >
      <Terminal {...terminalProps} />
    </div>
  );
});

ScreenDisplay.displayName = 'ScreenDisplay';

export default ScreenDisplay;
