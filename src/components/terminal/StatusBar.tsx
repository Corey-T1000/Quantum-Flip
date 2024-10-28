import React from 'react';
import { Settings, HelpCircle, RotateCcw, Zap, Bug, Target, RefreshCw } from 'lucide-react';
import { terminalStyles } from './terminalStyles';
import { StatusBarProps } from './types';

const StatusBar: React.FC<StatusBarProps> = ({
  levelName,
  moveCount,
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
  const styles = terminalStyles(colorPalette);

  return (
    <div className={styles.statusBar}>
      <div className={styles.statusContent}>
        <div className={styles.statusGroup}>
          <span className={styles.statusItem}>{levelName}</span>
          <span className={styles.statusItem}>Moves: {moveCount}</span>
        </div>
        <div className={styles.statusGroup}>
          {debugMode && (
            <span className={styles.statusItem}>
              Progress: {(progress * 100).toFixed(1)}%
            </span>
          )}
          <span className={styles.statusItem}>
            State: {dominantState}
          </span>
        </div>
      </div>

      <div className={styles.controlButtons}>
        <button
          className={styles.controlButton}
          onClick={onReset}
          title="Reset Quantum State"
        >
          <RotateCcw />
        </button>
        <button
          className={`${styles.controlButton} ${hintTile !== null ? 'active' : ''}`}
          onClick={onRequestHint}
          title="Request Oracle Guidance"
        >
          <Zap />
        </button>
        <button
          className={styles.controlButton}
          onClick={onShowHelp}
          title="Access Protocol Manual"
        >
          <HelpCircle />
        </button>
        <button
          className={styles.controlButton}
          onClick={onOpenSettings}
          title="Settings"
        >
          <Settings />
        </button>

        {process.env.NODE_ENV === 'development' && onToggleDebug && (
          <>
            <button
              className={`${styles.controlButton} ${debugMode ? 'active' : ''}`}
              onClick={onToggleDebug}
              title="Toggle Debug Protocol"
            >
              <Bug />
            </button>

            {debugMode && onNextLevel && onResetAllLevels && (
              <>
                <button
                  className={styles.controlButton}
                  onClick={onNextLevel}
                  title="Force Next Level"
                >
                  <Target />
                </button>
                <button
                  className={styles.controlButton}
                  onClick={onResetAllLevels}
                  title="Regenerate All Levels"
                >
                  <RefreshCw />
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StatusBar;
