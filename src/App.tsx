import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { setHintTile, setHintLevel, useHint, updateHintCooldown, HintLevel, setLevel, updateGrid, setGameWon, resetLevel } from './store/gameSlice';
import { toggleDebugMode } from './store/settingsSlice';
import { analyzeBoard, scanAlignment } from './utils/game/boardAnalysis';
import GameBoard from './components/GameBoard';
import ConnectedTerminal from './components/terminal/ConnectedTerminal';
import ConnectedSettingsModal from './components/ConnectedSettingsModal';
import { useAudioManager } from './utils/audio';
import { getLevel, resetAllLevels } from './utils/game/levelData';
import { toggleTileAndNeighbors } from './utils/game/nodeOperations';
import { ConnectedTerminalHandle } from './types';
import { addEntry } from './store/terminalSlice';
import { clearPersistedState } from './store';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    grid,
    currentLevel,
    moveCount,
    gameWon,
    hintTile,
    hintLevel,
    hintCharges,
    hintCooldown
  } = useAppSelector(state => state.game);
  
  const {
    colorPaletteIndex,
    highContrastMode,
    volume,
    debugMode
  } = useAppSelector(state => state.settings);

  const terminalRef = useRef<ConnectedTerminalHandle>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [solution, setSolution] = useState<[number, number][]>([]);
  const { playTileInteractionSound, playLevelCompletionSound, isAudioLoaded } = useAudioManager();

  // Enable debug mode by default in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      dispatch(toggleDebugMode());
    }
  }, []); // Remove debugMode from dependencies

  const handleToggleDebug = useCallback(() => {
    dispatch(toggleDebugMode());
  }, [dispatch]);

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

  // Add initial terminal entry
  useEffect(() => {
    dispatch(addEntry({
      timestamp: new Date().toLocaleTimeString(),
      content: [`Welcome to Level ${currentLevel + 1}!`],
      type: 'success'
    }));
  }, [currentLevel, dispatch]);

  // Update hint cooldown timer
  useEffect(() => {
    const timer = setInterval(() => {
      dispatch(updateHintCooldown());
    }, 1000);
    return () => clearInterval(timer);
  }, [dispatch]);

  // Check win condition and handle level progression
  useEffect(() => {
    if (!gameWon && grid.length > 0 && scanAlignment(grid)) {
      dispatch(setGameWon(true));
      if (isAudioLoaded) {
        playLevelCompletionSound();
      }
      dispatch(addEntry({
        timestamp: new Date().toLocaleTimeString(),
        content: ['Level completed! 🎉'],
        type: 'success'
      }));

      // Automatically progress to next level after a short delay
      setTimeout(() => {
        const nextLevel = currentLevel + 1;
        dispatch(setLevel(nextLevel));
        dispatch(addEntry({
          timestamp: new Date().toLocaleTimeString(),
          content: [`Moving to Level ${nextLevel + 1}`],
          type: 'success'
        }));
      }, 1500); // 1.5 second delay for celebration
    }
  }, [grid, gameWon, dispatch, playLevelCompletionSound, isAudioLoaded, currentLevel]);

  const handleTileClick = useCallback((row: number, col: number) => {
    if (gameWon) return;

    if (isAudioLoaded) {
      playTileInteractionSound();
    }

    const newGrid = grid.map(row => [...row]);
    toggleTileAndNeighbors(newGrid, row, col);
    dispatch(updateGrid(newGrid));

    // Add move to terminal
    dispatch(addEntry({
      timestamp: new Date().toLocaleTimeString(),
      content: [`Tile clicked at position (${row}, ${col})`],
    }));

    // Clear hint after any move
    if (hintTile || hintLevel !== HintLevel.NONE) {
      dispatch(setHintTile(null));
      dispatch(setHintLevel(HintLevel.NONE));
    }
  }, [gameWon, playTileInteractionSound, isAudioLoaded, grid, hintTile, hintLevel, dispatch]);

  const handleNextLevel = useCallback(() => {
    const nextLevel = currentLevel + 1;
    dispatch(setLevel(nextLevel));
    dispatch(addEntry({
      timestamp: new Date().toLocaleTimeString(),
      content: [`Moving to Level ${nextLevel + 1}`],
      type: 'success'
    }));
  }, [currentLevel, dispatch]);

  const handleResetLevel = useCallback(() => {
    dispatch(resetLevel());
    dispatch(addEntry({
      timestamp: new Date().toLocaleTimeString(),
      content: ['Level reset'],
      type: 'help'
    }));
  }, [dispatch]);

  const handleResetAllLevels = useCallback(() => {
    // Clear persisted state and reset levels
    clearPersistedState();
    resetAllLevels();
    
    // Reset game state
    dispatch(setLevel(0));
    
    // Update terminal
    dispatch(addEntry({
      timestamp: new Date().toLocaleTimeString(),
      content: ['Game reset to Level 1'],
      type: 'help'
    }));
  }, [dispatch]);

  const handleRequestHint = useCallback(() => {
    if (hintCharges === 0 || hintCooldown > 0) {
      dispatch(addEntry({
        timestamp: new Date().toLocaleTimeString(),
        content: ['No hints available'],
        type: 'error'
      }));
      return;
    }

    // If there's already a hint showing, clear it
    if (hintTile !== null || hintLevel !== HintLevel.NONE) {
      dispatch(setHintTile(null));
      dispatch(setHintLevel(HintLevel.NONE));
      return;
    }

    const analysis = analyzeBoard(grid);
    
    // Use hint and progress through hint levels
    dispatch(useHint());
    
    // Update hint visualization based on current level
    if (hintLevel === HintLevel.NONE) {
      dispatch(addEntry({
        timestamp: new Date().toLocaleTimeString(),
        content: ['Hint: Check the move count'],
        type: 'help'
      }));
    } else if (hintLevel === HintLevel.COUNT && analysis.bestMove) {
      dispatch(addEntry({
        timestamp: new Date().toLocaleTimeString(),
        content: ['Hint: Look at the highlighted area'],
        type: 'help'
      }));
    } else if (hintLevel === HintLevel.AREA && analysis.bestMove) {
      dispatch(setHintTile(analysis.bestMove));
      dispatch(addEntry({
        timestamp: new Date().toLocaleTimeString(),
        content: ['Hint: Try this specific tile'],
        type: 'help'
      }));
    }
  }, [grid, hintTile, hintLevel, hintCharges, hintCooldown, dispatch]);

  const handleHintUsed = useCallback(() => {
    dispatch(setHintTile(null));
    dispatch(setHintLevel(HintLevel.NONE));
  }, [dispatch]);

  const handleOpenSettings = useCallback(() => {
    setShowSettings(true);
    dispatch(addEntry({
      timestamp: new Date().toLocaleTimeString(),
      content: ['Opening settings'],
    }));
  }, [dispatch]);

  const handleCloseSettings = useCallback(() => {
    setShowSettings(false);
    dispatch(addEntry({
      timestamp: new Date().toLocaleTimeString(),
      content: ['Settings closed'],
    }));
  }, [dispatch]);

  useEffect(() => {
    // Reset solution when level changes
    setSolution([]);
  }, [currentLevel]);

  if (!currentColorPalette) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-8">
          <ConnectedTerminal
            ref={terminalRef}
            levelName={`Level ${currentLevel + 1}`}
            moveCount={moveCount}
            tutorialMessage={null}
            debugMode={debugMode}
            progress={0}
            dominantState="dark"
            onReset={handleResetLevel}
            onRequestHint={handleRequestHint}
            onShowHelp={() => {}}
            onOpenSettings={handleOpenSettings}
            onToggleDebug={handleToggleDebug}
            onNextLevel={handleNextLevel}
            onResetAllLevels={handleResetAllLevels}
            hintTile={hintTile}
          />
        </div>
        <div className="relative">
          {debugMode && (
            <div className="absolute -top-8 left-0 right-0 text-center text-sm">
              Current Level: {currentLevel} (Solution: {JSON.stringify(solution)})
            </div>
          )}
          <GameBoard
            grid={grid}
            onTileClick={handleTileClick}
            hintTile={hintTile}
            hintLevel={hintLevel}
            affectedAreas={hintLevel === HintLevel.AREA ? analyzeBoard(grid).affectedAreas : []}
            possibleMoveCount={hintLevel === HintLevel.COUNT ? analyzeBoard(grid).moveCount : 0}
            colorPalette={currentColorPalette}
            debugMode={debugMode}
            solution={solution}
            onHintUsed={handleHintUsed}
          />
        </div>
        {showSettings && (
          <ConnectedSettingsModal
            isOpen={showSettings}
            onClose={handleCloseSettings}
            colorPalettes={[currentColorPalette]}
            textColor="#ffffff"
          />
        )}
        {hintCooldown > 0 && (
          <div className="fixed bottom-4 right-4 text-sm">
            Hint Cooldown: {Math.ceil(hintCooldown / 1000)}s
          </div>
        )}
        <div className="fixed bottom-4 left-4 text-sm">
          Hints Remaining: {hintCharges}
        </div>
      </div>
    </div>
  );
};

export default App;
