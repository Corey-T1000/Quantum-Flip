import React, { useRef, useEffect } from 'react';
import { TerminalLine } from './TerminalLine';
import StatusBar from './StatusBar';
import { terminalStyles } from './terminalStyles';
import { TerminalProps, TerminalEntry } from './types';

const Terminal: React.FC<TerminalProps> = ({
  entries,
  levelName,
  moveCount,
  tutorialMessage,
  debugMode,
  progress,
  dominantState,
  colorPalette,
  onReset,
  onRequestHint,
  onShowHelp,
  onOpenSettings,
  onToggleDebug,
  onNextLevel,
  onResetAllLevels,
  hintTile
}) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const styles = terminalStyles(colorPalette);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [entries]);

  return (
    <div>
      <div ref={terminalRef} className={styles.terminalWindow}>
        {entries.map((entry: TerminalEntry, index: number) => (
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
        onReset={onReset}
        onRequestHint={onRequestHint}
        onShowHelp={onShowHelp}
        onOpenSettings={onOpenSettings}
        onToggleDebug={onToggleDebug}
        onNextLevel={onNextLevel}
        onResetAllLevels={onResetAllLevels}
        hintTile={hintTile}
      />
    </div>
  );
};

export default Terminal;
