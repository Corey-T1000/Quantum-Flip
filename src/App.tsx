import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { Settings, HelpCircle, RotateCcw, Zap, Bug, Target, RefreshCw } from 'lucide-react';
import ConnectedGameBoard from './components/ConnectedGameBoard';
import ConnectedSettingsModal from './components/ConnectedSettingsModal';
import ConnectedTerminal, { ConnectedTerminalHandle } from './components/terminal/ConnectedTerminal';
import Confetti from 'react-confetti';
import { engageNode } from './utils/game/nodeOperations';
import { scanAlignment, findNextMove } from './utils/game/boardAnalysis';
import { useAudio } from './utils/audio/index';
import { getTotalLevels, getLevelSolution, resetAllLevels } from './utils/game/levelData';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { setLevel, updateGrid, setGameWon, setHintTile, resetLevel } from './store/gameSlice';
import { toggleDebugMode } from './store/settingsSlice';
import { colorPalettes, helpContent, getTutorialMessage } from './constants';

function App() {
  const dispatch = useAppDispatch();
  const {
    currentLevel,
    grid,
    moveCount,
    gameWon,
    hintTile
  } = useAppSelector(state => state.game);
  const {
    colorPaletteIndex,
    highContrastMode,
    debugMode
  } = useAppSelector(state => state.settings);

  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [showConfetti, setShowConfetti] = React.useState(false);
  const [solution, setSolution] = React.useState<[number, number][]>([]);
  const terminalRef = useRef<ConnectedTerminalHandle>(null);

  const { playTileInteractionSound, playLevelCompletionSound, isAudioLoaded } = useAudio();

  const currentColorPalette = useMemo(() => ({
    ...colorPalettes[colorPaletteIndex],
    text: highContrastMode ? colorPalettes[colorPaletteIndex].lightHC : colorPalettes[colorPaletteIndex].text,
  }), [colorPaletteIndex, highContrastMode]);

  const boardState = useMemo(() => {
    const totalTiles = grid.length * grid.length;
    const lightTiles = grid.flat().filter((tile: boolean) => tile).length;
    const darkTiles = totalTiles - lightTiles;
    const lightRatio = lightTiles / totalTiles;
    const darkRatio = darkTiles / totalTiles;
    const dominantState: 'light' | 'dark' = lightRatio >= darkRatio ? 'light' : 'dark';
    const progress = Math.abs(lightRatio - 0.5) * 2;
    
    return {
      dominantState,
      progress
    } as const;
  }, [grid]);

  const tutorialMessage = useMemo(() => 
    getTutorialMessage(currentLevel, moveCount),
    [currentLevel, moveCount]
  );

  const handleResetLevel = useCallback(() => {
    dispatch(resetLevel());
    setSolution(debugMode ? getLevelSolution(currentLevel) : []);
  }, [currentLevel, debugMode, dispatch]);

  const handleTileClick = useCallback((row: number, col: number) => {
    if (gameWon) return;
    if (isAudioLoaded()) {
      playTileInteractionSound();
    }
    const newGrid = engageNode(grid, row, col);
    dispatch(updateGrid(newGrid));
    
    if (currentLevel > 4) {
      dispatch(setHintTile(null));
    }
  }, [gameWon, playTileInteractionSound, isAudioLoaded, currentLevel, grid, dispatch]);

  const handleRequestHint = useCallback(() => {
    if (gameWon) return;
    
    if (currentLevel <= 4) {
      if (currentLevel === 1 && moveCount >= 1) {
        if (hintTile !== null) {
          dispatch(setHintTile(null));
        } else {
          const solution = getLevelSolution(currentLevel);
          if (solution.length > 0) {
            dispatch(setHintTile(solution[0]));
          }
        }
      }
      return;
    }
    
    if (hintTile !== null) {
      dispatch(setHintTile(null));
    } else {
      const nextMove = findNextMove(grid);
      if (nextMove) {
        dispatch(setHintTile(nextMove));
      }
    }
  }, [gameWon, grid, hintTile, currentLevel, moveCount, dispatch]);

  const handleHintUsed = useCallback(() => {
    if (currentLevel > 4) {
      dispatch(setHintTile(null));
    }
  }, [currentLevel, dispatch]);

  useEffect(() => {
    let progressionTimer: NodeJS.Timeout | null = null;
    let confettiTimer: NodeJS.Timeout | null = null;

    const handleLevelWin = () => {
      dispatch(setGameWon(true));
      setShowConfetti(true);
      dispatch(setHintTile(null));
      if (isAudioLoaded()) {
        playLevelCompletionSound();
      }

      confettiTimer = setTimeout(() => {
        setShowConfetti(false);
      }, 1500);

      progressionTimer = setTimeout(() => {
        const nextLevelIndex = currentLevel + 1;
        if (nextLevelIndex < getTotalLevels()) {
          dispatch(setLevel(nextLevelIndex));
          setSolution(debugMode ? getLevelSolution(nextLevelIndex) : []);
        }
      }, 2000);
    };

    if (!gameWon) {
      const isAligned = scanAlignment(grid);
      if (isAligned) {
        handleLevelWin();
      }
    }

    return () => {
      if (confettiTimer) clearTimeout(confettiTimer);
      if (progressionTimer) clearTimeout(progressionTimer);
    };
  }, [grid, gameWon, playLevelCompletionSound, isAudioLoaded, currentLevel, debugMode, dispatch]);

  const handleNextLevel = useCallback(() => {
    const nextLevelIndex = currentLevel + 1;
    if (nextLevelIndex < getTotalLevels()) {
      dispatch(setLevel(nextLevelIndex));
      setSolution(debugMode ? getLevelSolution(nextLevelIndex) : []);
    }
  }, [currentLevel, debugMode, dispatch]);

  const handleToggleDebugMode = useCallback(() => {
    dispatch(toggleDebugMode());
    setSolution(debugMode ? [] : getLevelSolution(currentLevel));
  }, [currentLevel, debugMode, dispatch]);

  const handleShowHelp = useCallback(() => {
    if (terminalRef.current) {
      terminalRef.current.addTerminalEntry({
        timestamp: new Date().toLocaleTimeString('en-US', { 
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }),
        content: helpContent,
        type: 'help'
      });
    }
  }, []);

  const handleResetAllLevels = useCallback(() => {
    if (window.confirm('This will regenerate all levels. Are you sure?')) {
      resetAllLevels();
      dispatch(setLevel(0));
      setSolution(debugMode ? getLevelSolution(0) : []);
    }
  }, [debugMode, dispatch]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8" style={{ backgroundColor: currentColorPalette.light }}>
      {showConfetti && <Confetti 
        colors={[currentColorPalette.dark, currentColorPalette.darkest, currentColorPalette.light]}
        numberOfPieces={200}
      />}
      <div className="rounded-2xl neumorphic-shadow p-4 sm:p-6 max-w-md w-full" 
        style={{ 
          backgroundColor: currentColorPalette.light,
          boxShadow: `
            20px 20px 60px ${currentColorPalette.darkest}1A,
            -20px -20px 60px ${currentColorPalette.light}CC
          `
        }}>
        <ConnectedTerminal
          ref={terminalRef}
          levelName={`Level ${currentLevel + 1}`}
          moveCount={moveCount}
          tutorialMessage={tutorialMessage}
          debugMode={debugMode}
          progress={boardState.progress}
          dominantState={boardState.dominantState}
        />
        <div className="my-6">
          <ConnectedGameBoard
            onTileClick={handleTileClick}
            onHintUsed={handleHintUsed}
            solution={solution}
          />
        </div>
      </div>
      <div className="mt-4 flex justify-center items-center gap-8">
        <button
          className="control-button"
          onClick={handleResetLevel}
          title="Reset Quantum State"
          style={{
            backgroundColor: currentColorPalette.light,
            color: currentColorPalette.darkest,
            boxShadow: `
              5px 5px 10px ${currentColorPalette.darkest}40,
              -5px -5px 10px ${currentColorPalette.light}CC,
              inset 0 0 0 rgba(0,0,0,0)
            `
          }}
        >
          <RotateCcw size={24} />
        </button>
        <button
          className={`control-button ${hintTile !== null ? 'active' : ''}`}
          onClick={handleRequestHint}
          title="Request Oracle Guidance"
          style={{
            backgroundColor: currentColorPalette.light,
            color: currentColorPalette.darkest,
            boxShadow: hintTile !== null ? 
              `inset 3px 3px 6px rgba(0, 0, 0, 0.2),
               inset -3px -3px 6px rgba(255, 255, 255, 0.2),
               0px 0px 10px rgba(0, 0, 0, 0.1)` :
              `5px 5px 10px ${currentColorPalette.darkest}40,
               -5px -5px 10px ${currentColorPalette.light}CC`
          }}
        >
          <Zap size={24} />
        </button>
        <button
          className="control-button"
          onClick={handleShowHelp}
          title="Access Protocol Manual"
          style={{
            backgroundColor: currentColorPalette.light,
            color: currentColorPalette.darkest,
            boxShadow: `
              5px 5px 10px ${currentColorPalette.darkest}40,
              -5px -5px 10px ${currentColorPalette.light}CC
            `
          }}
        >
          <HelpCircle size={24} />
        </button>
        <button
          className="control-button"
          onClick={() => setIsSettingsOpen(true)}
          title="Settings"
          style={{
            backgroundColor: currentColorPalette.light,
            color: currentColorPalette.darkest,
            boxShadow: `
              5px 5px 10px ${currentColorPalette.darkest}40,
              -5px -5px 10px ${currentColorPalette.light}CC
            `
          }}
        >
          <Settings size={24} />
        </button>

        {process.env.NODE_ENV === 'development' && (
          <>
            <button
              className={`control-button ${debugMode ? 'active' : ''}`}
              onClick={handleToggleDebugMode}
              title="Toggle Debug Protocol"
              style={{
                backgroundColor: currentColorPalette.light,
                color: currentColorPalette.darkest,
                boxShadow: debugMode ?
                  `inset 3px 3px 6px rgba(0, 0, 0, 0.2),
                   inset -3px -3px 6px rgba(255, 255, 255, 0.2),
                   0px 0px 10px rgba(0, 0, 0, 0.1)` :
                  `5px 5px 10px ${currentColorPalette.darkest}40,
                   -5px -5px 10px ${currentColorPalette.light}CC`
              }}
            >
              <Bug size={24} />
            </button>

            {debugMode && (
              <>
                <button
                  className="control-button"
                  onClick={handleNextLevel}
                  title="Force Next Level"
                  style={{
                    backgroundColor: currentColorPalette.light,
                    color: currentColorPalette.darkest,
                    boxShadow: `
                      5px 5px 10px ${currentColorPalette.darkest}40,
                      -5px -5px 10px ${currentColorPalette.light}CC
                    `
                  }}
                >
                  <Target size={24} />
                </button>
                <button
                  className="control-button"
                  onClick={handleResetAllLevels}
                  title="Regenerate All Levels"
                  style={{
                    backgroundColor: currentColorPalette.light,
                    color: currentColorPalette.darkest,
                    boxShadow: `
                      5px 5px 10px ${currentColorPalette.darkest}40,
                      -5px -5px 10px ${currentColorPalette.light}CC
                    `
                  }}
                >
                  <RefreshCw size={24} />
                </button>
              </>
            )}
          </>
        )}
      </div>
      <ConnectedSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        colorPalettes={colorPalettes}
        textColor={currentColorPalette.darkest}
      />
    </div>
  );
}

export default App;
