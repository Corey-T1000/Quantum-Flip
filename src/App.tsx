import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import ConnectedGameBoard from './components/ConnectedGameBoard';
import ConnectedSettingsModal from './components/ConnectedSettingsModal';
import ConnectedTerminal, { ConnectedTerminalHandle } from './components/terminal/ConnectedTerminal';
import Confetti from 'react-confetti';
import { engageNode } from './utils/game/nodeOperations';
import { scanAlignment, findNextMove } from './utils/game/boardAnalysis';
import { useAudio } from './utils/audio/index';
import { getTotalLevels, getLevelSolution, resetAllLevels, getLevel } from './utils/game/levelData';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { setLevel, updateGrid, setGameWon, setHintTile, resetLevel } from './store/gameSlice';
import { toggleDebugMode } from './store/settingsSlice';
import { colorPalettes, helpContent, getTutorialMessage } from './constants';
import { formatTimestamp } from './utils/time';

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
  const [confettiActive, setConfettiActive] = React.useState(false);
  const [solution, setSolution] = React.useState<[number, number][]>([]);
  const terminalRef = useRef<ConnectedTerminalHandle>(null);
  const initialMessageShownRef = useRef<boolean>(false);
  const progressionInProgressRef = useRef<boolean>(false);

  const { playTileInteractionSound, playLevelCompletionSound, isAudioLoaded } = useAudio();

  // Load initial level data
  useEffect(() => {
    try {
      const levelData = getLevel(currentLevel);
      dispatch(updateGrid(levelData));
      setSolution(debugMode ? getLevelSolution(currentLevel) : []);
      
      if (terminalRef.current) {
        terminalRef.current.addTerminalEntry({
          timestamp: formatTimestamp(),
          content: [`Level ${currentLevel + 1} initialized`]
        });
      }
    } catch (error) {
      if (terminalRef.current) {
        terminalRef.current.addTerminalEntry({
          timestamp: formatTimestamp(),
          content: [`Error loading level: ${error}`]
        });
      }
    }
  }, [currentLevel, debugMode, dispatch]);

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

  // Add initial tutorial message only once when component mounts
  useEffect(() => {
    if (!initialMessageShownRef.current && terminalRef.current && currentLevel <= 4) {
      const initialMessage = getTutorialMessage(currentLevel, 0);
      if (initialMessage) {
        terminalRef.current.addTerminalEntry({
          timestamp: formatTimestamp(),
          content: [initialMessage]
        });
        initialMessageShownRef.current = true;
      }
    }
  }, [currentLevel]);

  const handleResetLevel = useCallback(() => {
    const levelData = getLevel(currentLevel);
    dispatch(resetLevel());
    dispatch(updateGrid(levelData)); // Load the level data after reset
    setSolution(debugMode ? getLevelSolution(currentLevel) : []);
    initialMessageShownRef.current = false;
  }, [currentLevel, debugMode, dispatch]);

  const handleTileClick = useCallback((row: number, col: number) => {
    if (gameWon) return;
    if (isAudioLoaded()) {
      playTileInteractionSound();
    }
    const newGrid = engageNode(grid, row, col);
    dispatch(updateGrid(newGrid));
    
    // Clear hint tile after any move
    if (hintTile && hintTile[0] === row && hintTile[1] === col) {
      dispatch(setHintTile(null));
    }
  }, [gameWon, playTileInteractionSound, isAudioLoaded, grid, hintTile, dispatch]);

  const handleRequestHint = useCallback(() => {
    if (gameWon) return;
    
    // If there's already a hint showing, clear it
    if (hintTile !== null) {
      dispatch(setHintTile(null));
      return;
    }

    // For tutorial levels (0-4)
    if (currentLevel <= 4) {
      const solution = getLevelSolution(currentLevel);
      if (solution.length > 0) {
        // For level 1, only show hint after first move
        if (currentLevel === 1 && moveCount === 0) {
          if (terminalRef.current) {
            terminalRef.current.addTerminalEntry({
              timestamp: formatTimestamp(),
              content: ["Make your first move to unlock the Oracle's guidance."]
            });
          }
          return;
        }
        
        // Get the next move from solution based on current move count
        const nextMoveIndex = Math.min(moveCount, solution.length - 1);
        dispatch(setHintTile(solution[nextMoveIndex]));
      }
      return;
    }
    
    // For regular levels (5+)
    const nextMove = findNextMove(grid);
    if (nextMove) {
      dispatch(setHintTile(nextMove));
      if (terminalRef.current) {
        terminalRef.current.addTerminalEntry({
          timestamp: formatTimestamp(),
          content: ["The Oracle suggests a move..."]
        });
      }
    }
  }, [gameWon, grid, hintTile, currentLevel, moveCount, dispatch]);

  const handleHintUsed = useCallback(() => {
    // Clear hint tile after use for all levels
    dispatch(setHintTile(null));
  }, [dispatch]);

  const progressToNextLevel = useCallback(() => {
    try {
      const nextLevelIndex = currentLevel + 1;
      const totalLevels = getTotalLevels();

      if (terminalRef.current) {
        terminalRef.current.addTerminalEntry({
          timestamp: formatTimestamp(),
          content: [`Attempting to progress to level ${nextLevelIndex + 1}/${totalLevels}...`]
        });
      }

      if (nextLevelIndex < totalLevels) {
        dispatch(setLevel(nextLevelIndex));
        const nextLevelData = getLevel(nextLevelIndex);
        dispatch(updateGrid(nextLevelData));
        dispatch(setGameWon(false));
        setSolution(debugMode ? getLevelSolution(nextLevelIndex) : []);
        initialMessageShownRef.current = false;

        if (terminalRef.current) {
          terminalRef.current.addTerminalEntry({
            timestamp: formatTimestamp(),
            content: [`Successfully loaded level ${nextLevelIndex + 1}`]
          });
        }
      } else {
        if (terminalRef.current) {
          terminalRef.current.addTerminalEntry({
            timestamp: formatTimestamp(),
            content: ['Congratulations! You have completed all levels!']
          });
        }
      }
    } catch (error) {
      if (terminalRef.current) {
        terminalRef.current.addTerminalEntry({
          timestamp: formatTimestamp(),
          content: [`Error during level progression: ${error}`]
        });
      }
    } finally {
      progressionInProgressRef.current = false;
    }
  }, [currentLevel, debugMode, dispatch]);

  useEffect(() => {
    let confettiTimer: NodeJS.Timeout | null = null;

    const handleLevelWin = () => {
      if (progressionInProgressRef.current) return;
      progressionInProgressRef.current = true;

      if (terminalRef.current) {
        terminalRef.current.addTerminalEntry({
          timestamp: formatTimestamp(),
          content: [`Level ${currentLevel + 1} completed!`]
        });
      }

      dispatch(setGameWon(true));
      setShowConfetti(true);
      setConfettiActive(true);
      dispatch(setHintTile(null));
      
      if (isAudioLoaded()) {
        playLevelCompletionSound();
      }

      // Stop creating new confetti pieces after 1 second
      confettiTimer = setTimeout(() => {
        setConfettiActive(false);
        // Hide confetti container after pieces have fallen (3 seconds total)
        setTimeout(() => {
          setShowConfetti(false);
        }, 2000);
      }, 1000);

      // Progress to next level after 1.5 seconds
      setTimeout(() => {
        progressToNextLevel();
      }, 1500);
    };

    if (!gameWon) {
      const isAligned = scanAlignment(grid);
      if (isAligned) {
        handleLevelWin();
      }
    }

    return () => {
      if (confettiTimer) clearTimeout(confettiTimer);
    };
  }, [grid, gameWon, playLevelCompletionSound, isAudioLoaded, currentLevel, progressToNextLevel]);

  const handleNextLevel = useCallback(() => {
    const nextLevelIndex = currentLevel + 1;
    if (nextLevelIndex < getTotalLevels()) {
      dispatch(setLevel(nextLevelIndex));
      const nextLevelData = getLevel(nextLevelIndex);
      dispatch(updateGrid(nextLevelData));
      setSolution(debugMode ? getLevelSolution(nextLevelIndex) : []);
      initialMessageShownRef.current = false;
    }
  }, [currentLevel, debugMode, dispatch]);

  const handleToggleDebugMode = useCallback(() => {
    dispatch(toggleDebugMode());
    setSolution(debugMode ? [] : getLevelSolution(currentLevel));
  }, [currentLevel, debugMode, dispatch]);

  const handleShowHelp = useCallback(() => {
    if (terminalRef.current) {
      terminalRef.current.addTerminalEntry({
        timestamp: formatTimestamp(),
        content: helpContent,
        type: 'help'
      });
    }
  }, []);

  const handleResetAllLevels = useCallback(() => {
    if (window.confirm('This will regenerate all levels. Are you sure?')) {
      resetAllLevels();
      dispatch(setLevel(0));
      const levelData = getLevel(0);
      dispatch(updateGrid(levelData));
      setSolution(debugMode ? getLevelSolution(0) : []);
      initialMessageShownRef.current = false;
    }
  }, [debugMode, dispatch]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8" style={{ backgroundColor: currentColorPalette.light }}>
      {showConfetti && <Confetti 
        colors={[currentColorPalette.dark, currentColorPalette.darkest, currentColorPalette.light]}
        numberOfPieces={200}
        recycle={false}
        run={confettiActive}
        gravity={0.3}
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
          onReset={handleResetLevel}
          onRequestHint={handleRequestHint}
          onShowHelp={handleShowHelp}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onToggleDebug={handleToggleDebugMode}
          onNextLevel={handleNextLevel}
          onResetAllLevels={handleResetAllLevels}
          hintTile={hintTile}
        />
        <div className="my-6">
          <ConnectedGameBoard
            onTileClick={handleTileClick}
            onHintUsed={handleHintUsed}
            solution={solution}
          />
        </div>
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
