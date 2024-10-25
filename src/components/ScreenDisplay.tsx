import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';

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

  const addTerminalEntry = (entry: TerminalEntry) => {
    setTerminalHistory(prev => [...prev, entry]);
    // Scroll to bottom
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

  // Convert progress to represent balance between light and dark states
  const normalizedProgress = progress >= 0.5 ? progress : 1 - progress;
  const dominantState = progress >= 0.5 ? 'light' : 'dark';

  // Charm-inspired styles using the provided colorPalette
  const charm = {
    background: colorPalette.darkest,
    foreground: colorPalette.text,
    primary: colorPalette.light,
    secondary: colorPalette.dark,
    highlight: colorPalette.lightHC,
    shadow: colorPalette.darkHC,
    success: '#9ECE6A',
    warning: '#E0AF68',
    error: '#F7768E',
    gray100: colorPalette.text,
    gray200: `${colorPalette.text}CC`,
    gray300: `${colorPalette.text}99`,
    gray400: `${colorPalette.text}66`,
    gray500: `${colorPalette.text}44`,
    gray600: `${colorPalette.darkest}CC`,
    gray700: colorPalette.darkest,
    gray800: `${colorPalette.darkHC}CC`,
    gray900: colorPalette.darkHC,
  };

  const styles = {
    text: {
      normal: { color: charm.gray100 },
      dim: { color: charm.gray300 },
      highlight: { color: charm.primary },
      success: { color: charm.success },
      warning: { color: charm.warning },
      error: { color: charm.error },
    },
    border: {
      normal: `1px solid ${charm.gray600}`,
      highlight: `1px solid ${charm.primary}`,
      glow: `0 0 10px ${charm.primary}33`,
    },
  };

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
          <div key={i} className="ml-4">
            {line}
          </div>
        ));
      }
      return content;
    };

    return (
      <div key={index} className="terminal-line typing-effect mb-2 text-base md:text-sm">
        {showTimestamps && (
          <span style={{ ...styles.text.dim, marginRight: '1rem' }}>
            {timestamp}
          </span>
        )}
        {type === 'command' && count ? (
          <div className="flex items-center space-x-3 py-1">
            <span className="prompt-symbol text-lg md:text-base">❯</span>
            <span style={{ 
              color: state === 'light' ? charm.primary : charm.secondary,
              textShadow: `0 0 10px ${state === 'light' ? charm.highlight : charm.shadow}33`,
              fontWeight: 'bold'
            }}>
              M{level}
            </span>
            <span style={{ color: charm.gray200 }}>{content}</span>
            <span style={{ ...styles.text.dim }} className="ml-2">×{count}</span>
          </div>
        ) : type === 'help' ? (
          <div className="py-1" style={{ color: charm.warning }}>
            <div className="flex items-center space-x-3">
              <span className="prompt-symbol text-lg md:text-base">❯</span>
              <span style={{ fontWeight: 'bold' }}>help.display()</span>
            </div>
            <div className="mt-2">{renderContent(content)}</div>
          </div>
        ) : (
          <span style={{ color: type === 'system' ? charm.success : charm.foreground }}>
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

    // Adjust progress width based on container width
    const progressWidth = window.innerWidth < 768 ? 48 : 96;
    const filledWidth = normalizedProgress * progressWidth;
    const filledComplete = Math.floor(filledWidth);

    const stateColor = dominantState === 'light' ? colorPalette.light : colorPalette.dark;
    const stateGlow = `0 0 10px ${dominantState === 'light' ? colorPalette.lightHC : colorPalette.darkHC}33`;

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
                color: stateColor,
                textShadow: stateGlow,
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
              {Array(progressWidth).fill(null).map((_, i) => (
                <span
                  key={i}
                  style={{
                    color: i < filledComplete ? stateColor : `${colorPalette.text}44`,
                    textShadow: i < filledComplete ? stateGlow : 'none',
                    transition: 'all 0.3s ease-in-out'
                  }}
                >
                  {i < filledComplete ? progressChars.filled : progressChars.empty}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
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
      onTouchStart={() => setShowTimestamps(true)}
      onTouchEnd={() => setShowTimestamps(false)}
      onMouseDown={() => setShowTimestamps(true)}
      onMouseUp={() => setShowTimestamps(false)}
      onMouseLeave={() => setShowTimestamps(false)}
    >
      <style>
        {`
          .quantum-progress {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 1.5rem;
            overflow: hidden;
            font-family: monospace;
            padding: 0;
            margin: 0;
            -webkit-tap-highlight-color: transparent;
          }

          .progress-track {
            width: 100%;
            display: grid;
            grid-template-columns: repeat(${window.innerWidth < 768 ? 48 : 96}, 1fr);
            gap: 0;
            margin: 0;
            padding: 0;
            line-height: 1;
          }

          .progress-track span {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            margin: 0;
            height: 28px;
            touch-action: manipulation;
          }

          @media (min-width: 768px) {
            .quantum-progress {
              font-size: 1rem;
            }
            .progress-track span {
              height: 16px;
            }
          }

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

          .terminal-line {
            padding: 0.75rem 0;
            line-height: 1.6;
            font-size: 1.125rem;
            word-break: break-word;
          }

          .prompt-symbol {
            font-size: 1.25rem;
            user-select: none;
          }

          @media (min-width: 768px) {
            .terminal-window {
              padding: 1rem;
              min-height: 120px;
              max-height: 200px;
            }
            .terminal-line {
              padding: 0.5rem 0;
              line-height: 1.5;
              font-size: 0.875rem;
            }
            .prompt-symbol {
              font-size: 1rem;
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
            .terminal-line {
              touch-action: pan-y;
            }
          }

          /* Active states for touch */
          @media (hover: none) {
            .terminal-status-bar:active {
              opacity: 0.8;
            }
            .progress-track span:active {
              transform: scale(1.2);
            }
          }
        `}
      </style>
      <div className="relative">
        <div ref={terminalRef} className="terminal-window">
          {terminalHistory.map((entry, index) => renderTerminalLine(entry, index))}
          <div className="terminal-line">
            <span className="prompt-symbol text-lg md:text-base">❯</span>
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
