import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';
import styles from '../styles/components/ScreenDisplay.module.css';
import '../styles/themes/colors.css';
import '../styles/global.css';

interface TerminalEntry {
  timestamp: string;
  content: string | string[];
  type: 'command' | 'response' | 'status' | 'progress' | 'system' | 'help';
  count?: number;
  level?: string;
  state?: 'light' | 'dark';
}

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
}

export interface ScreenDisplayHandle {
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
  } = props;

  const [visible, setVisible] = useState(false);
  const [terminalHistory, setTerminalHistory] = useState<TerminalEntry[]>([]);
  const [showTimestamps, setShowTimestamps] = useState(false);
  const [currentLevelMoves, setCurrentLevelMoves] = useState(0);
  const terminalRef = useRef<HTMLDivElement>(null);
  const prevLevelRef = useRef(levelName);

  const dominantState = progress >= 0.5 ? 'light' : 'dark';

  useEffect(() => {
    // Update CSS variables when colorPalette changes
    document.documentElement.style.setProperty('--color-background', colorPalette.darkest);
    document.documentElement.style.setProperty('--color-foreground', colorPalette.text);
    document.documentElement.style.setProperty('--color-primary', colorPalette.light);
    document.documentElement.style.setProperty('--color-secondary', colorPalette.dark);
    document.documentElement.style.setProperty('--color-highlight', colorPalette.lightHC);
    document.documentElement.style.setProperty('--color-shadow', colorPalette.darkHC);
  }, [colorPalette]);

  const addTerminalEntry = (entry: TerminalEntry) => {
    setTerminalHistory(prev => [...prev, entry]);
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

  useEffect(() => {
    const initMessages: TerminalEntry[] = [
      {
        timestamp: getTimestamp(),
        content: '✨ Quantum Matrix Protocol initialized',
        type: 'system'
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
          content: `matrix.modifyState()`,
          type: 'command',
          count: currentLevelMoves,
          level: prevLevelRef.current,
          state: dominantState
        });
      }
      setCurrentLevelMoves(0);
      prevLevelRef.current = levelName;
    }
  }, [levelName, dominantState]);

  useEffect(() => {
    if (moveCount > 0) {
      setCurrentLevelMoves(prev => prev + 1);
      setTerminalHistory(prev => {
        const lastEntry = prev[prev.length - 1];
        if (lastEntry?.type === 'command' && lastEntry.level === levelName) {
          const updatedHistory = [...prev];
          updatedHistory[prev.length - 1] = {
            ...lastEntry,
            count: currentLevelMoves + 1,
            state: dominantState
          };
          return updatedHistory;
        } else {
          return [...prev, {
            timestamp: getTimestamp(),
            content: 'matrix.modifyState()',
            type: 'command',
            count: 1,
            level: levelName,
            state: dominantState
          }];
        }
      });
    }
  }, [moveCount, levelName, dominantState]);

  useEffect(() => {
    if (gameWon) {
      addTerminalEntry({
        timestamp: getTimestamp(),
        content: '✨ Matrix alignment achieved. Proceeding to next quantum state...',
        type: 'system'
      });
    }
  }, [gameWon]);

  const renderTerminalLine = (entry: TerminalEntry, index: number) => {
    const { timestamp, content, type, count, level, state } = entry;
    
    const renderContent = (content: string | string[]) => {
      if (Array.isArray(content)) {
        return content.map((line, i) => (
          <div key={i} className={styles['terminal-line-content']}>
            {line}
          </div>
        ));
      }
      return content;
    };

    return (
      <div key={index} className={`${styles['terminal-line']} typing-effect`}>
        {showTimestamps && (
          <span className="text-dim mr-4">
            {timestamp}
          </span>
        )}
        {type === 'command' && count ? (
          <div className={styles['command-line']}>
            <span className={styles['prompt-symbol']}>❯</span>
            <span className={`${styles['level-indicator']} state-${state}`}>
              M{level}
            </span>
            <span className="text-gray-200">{content}</span>
            <span className="text-dim ml-2">×{count}</span>
          </div>
        ) : type === 'help' ? (
          <div className={styles['help-line']}>
            <div className={styles['help-header']}>
              <span className={styles['prompt-symbol']}>❯</span>
              <span className="font-bold text-warning">help.display()</span>
            </div>
            <div className={styles['help-content']}>{renderContent(content)}</div>
          </div>
        ) : (
          <span className={type === 'system' ? 'text-success' : 'text-foreground'}>
            {renderContent(content)}
          </span>
        )}
      </div>
    );
  };

  const renderStatusBar = () => {
    const progressChars = {
      empty: '·',
      filled: '•',
      separator: '·'
    };

    const progressWidth = window.innerWidth < 768 ? 48 : 96;

    return (
      <div className={styles['terminal-status-bar']}>
        <div className={styles['status-bar-content']}>
          <div className={styles['status-row']}>
            <div className={styles['status-group']}>
              <span className={styles['prompt-symbol']}>❯</span>
              <span className={styles['status-text']}>
                {tutorialMessage ? "TUTORIAL" : `M${levelName}`}
              </span>
              <span className="text-gray-500">{progressChars.separator}</span>
              <span className={`${styles['state-indicator']} state-${dominantState}`}>
                {dominantState.toUpperCase()}
              </span>
            </div>
            
            <div className={styles['status-group']}>
              <span className="text-gray-500">{progressChars.separator}</span>
              <span className="text-gray-200">{currentLevelMoves}ops</span>
              {debugMode && (
                <>
                  <span className="text-gray-500">{progressChars.separator}</span>
                  <span className="text-warning font-bold">DEBUG</span>
                </>
              )}
            </div>
          </div>

          <div className={styles['quantum-progress']}>
            <div 
              className={styles['progress-track']}
              style={{ gridTemplateColumns: `repeat(${progressWidth}, 1fr)` }}
            >
              {Array(progressWidth).fill(null).map((_, i) => {
                const position = i / progressWidth;
                const isLight = progress >= 0.5;
                const isActive = isLight ? position <= progress : position <= (1 - progress);
                const stateClass = isLight ? 'light' : 'dark';
                
                return (
                  <span
                    key={i}
                    className={`${styles['progress-dot']} ${isActive ? styles[`progress-dot-${stateClass}`] : ''}`}
                  >
                    {isActive ? progressChars.filled : progressChars.empty}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      className={`${styles.container} ${visible ? styles.visible : ''} terminal-theme rounded-lg mb-4 font-mono relative overflow-hidden`}
      onTouchStart={() => setShowTimestamps(true)}
      onTouchEnd={() => setShowTimestamps(false)}
      onMouseDown={() => setShowTimestamps(true)}
      onMouseUp={() => setShowTimestamps(false)}
      onMouseLeave={() => setShowTimestamps(false)}
    >
      <div className="relative">
        <div ref={terminalRef} className={`${styles['terminal-window']} smooth-scroll`}>
          {terminalHistory.map((entry, index) => renderTerminalLine(entry, index))}
          <div className={styles['terminal-line']}>
            <span className={styles['prompt-symbol']}>❯</span>
            <span className="typing-effect">█</span>
          </div>
        </div>
        {renderStatusBar()}
      </div>
    </div>
  );
});

ScreenDisplay.displayName = 'ScreenDisplay';

export default ScreenDisplay;
