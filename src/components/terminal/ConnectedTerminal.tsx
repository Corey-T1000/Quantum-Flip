import React, { forwardRef, useImperativeHandle, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import Terminal from './Terminal';
import { addEntry } from '../../store/terminalSlice';
import { TerminalEntry } from './types';

export interface ConnectedTerminalHandle {
  addTerminalEntry: (entry: {
    timestamp: string;
    content: string | string[];
    type?: 'help' | 'error' | 'success';
  }) => void;
}

interface ConnectedTerminalProps {
  levelName: string;
  moveCount: number;
  tutorialMessage: string | null;
  debugMode: boolean;
  progress: number;
  dominantState: 'light' | 'dark';
  onReset: () => void;
  onRequestHint: () => void;
  onShowHelp: () => void;
  onOpenSettings: () => void;
  onToggleDebug?: () => void;
  onNextLevel?: () => void;
  onResetAllLevels?: () => void;
  hintTile: [number, number] | null;
}

const ConnectedTerminal = forwardRef<ConnectedTerminalHandle, ConnectedTerminalProps>(({
  levelName,
  moveCount,
  tutorialMessage,
  debugMode,
  progress,
  dominantState,
  onReset,
  onRequestHint,
  onShowHelp,
  onOpenSettings,
  onToggleDebug,
  onNextLevel,
  onResetAllLevels,
  hintTile
}, ref) => {
  const dispatch = useAppDispatch();
  const {
    entries
  } = useAppSelector(state => state.terminal);
  const {
    colorPaletteIndex,
    highContrastMode
  } = useAppSelector(state => state.settings);

  const colorPalettes = [
    { light: '#e0e5ec', dark: '#a3b1c6', darkest: '#4a5568', lightHC: '#ffffff', darkHC: '#000000', text: '#ffffff' },
    { light: '#f0e6db', dark: '#8a7a66', darkest: '#4d3319', lightHC: '#fff5e6', darkHC: '#4d3319', text: '#ffffff' },
    { light: '#e6f0e8', dark: '#6b8e7b', darkest: '#1a332b', lightHC: '#f0fff5', darkHC: '#1a332b', text: '#ffffff' },
    { light: '#e8e6f0', dark: '#7b6b8e', darkest: '#2b1a33', lightHC: '#f5f0ff', darkHC: '#2b1a33', text: '#ffffff' },
  ];

  const currentColorPalette = {
    ...colorPalettes[colorPaletteIndex],
    text: highContrastMode ? colorPalettes[colorPaletteIndex].lightHC : colorPalettes[colorPaletteIndex].text,
  };

  const addTerminalEntry = useCallback((entry: {
    timestamp: string;
    content: string | string[];
    type?: 'help' | 'error' | 'success';
  }) => {
    const formattedEntry: TerminalEntry = {
      timestamp: entry.timestamp,
      content: Array.isArray(entry.content) ? entry.content : [entry.content],
      type: entry.type
    };
    dispatch(addEntry(formattedEntry));
  }, [dispatch]);

  useImperativeHandle(ref, () => ({
    addTerminalEntry
  }));

  return (
    <Terminal
      entries={entries}
      levelName={levelName}
      moveCount={moveCount}
      tutorialMessage={tutorialMessage}
      debugMode={debugMode}
      progress={progress}
      dominantState={dominantState}
      colorPalette={currentColorPalette}
      onReset={onReset}
      onRequestHint={onRequestHint}
      onShowHelp={onShowHelp}
      onOpenSettings={onOpenSettings}
      onToggleDebug={onToggleDebug}
      onNextLevel={onNextLevel}
      onResetAllLevels={onResetAllLevels}
      hintTile={hintTile}
    />
  );
});

ConnectedTerminal.displayName = 'ConnectedTerminal';

export default ConnectedTerminal;
