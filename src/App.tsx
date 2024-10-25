import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Settings, HelpCircle, RotateCcw, Zap, Bug, Target } from 'lucide-react';
import GameBoard from './components/GameBoard';
import HelpModal from './components/HelpModal';
import SettingsModal from './components/SettingsModal';
import ScreenDisplay from './components/ScreenDisplay';
import Confetti from 'react-confetti';
import { engageNode, scanAlignment, findNextMove } from './utils/gameLogic';
import { useAudio } from './utils/audio';
import { BoardState } from './types';
import { getLevel, getTotalLevels } from './utils/levelData';
import { generateSolvableLevel, generateSpecificLevel } from './utils/levelGenerator';

const INITIAL_LEVEL = 0;

const colorPalettes = [
  { light: '#e0e5ec', dark: '#a3b1c6', darkest: '#4a5568', lightHC: '#ffffff', darkHC: '#000000', text: '#ffffff' },
  { light: '#f0e6db', dark: '#8a7a66', darkest: '#4d3319', lightHC: '#fff5e6', darkHC: '#4d3319', text: '#ffffff' },
  { light: '#e6f0e8', dark: '#6b8e7b', darkest: '#1a332b', lightHC: '#f0fff5', darkHC: '#1a332b', text: '#ffffff' },
  { light: '#e8e6f0', dark: '#7b6b8e', darkest: '#2b1a33', lightHC: '#f5f0ff', darkHC: '#2b1a33', text: '#ffffff' },
];

function App() {
  const [currentLevel, setCurrentLevel] = useState(INITIAL_LEVEL);
  const [grid, setGrid] = useState<BoardState>(() => getLevel(INITIAL_LEVEL));
  const [moveCount, setMoveCount] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [hintTile, setHintTile] = useState<[number, number] | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [colorPaletteIndex, setColorPaletteIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [volume, setVolume] = useState(1);
  const [debugMode, setDebugMode] = useState(false);
  const [solution, setSolution] = useState<[number, number][]>([]);

  const { playTileInteractionSound, playLevelCompletionSound, isAudioLoaded } = useAudio();

  const currentColorPalette = useMemo(() => ({
    ...colorPalettes[colorPaletteIndex],
    text: highContrastMode ? colorPalettes[colorPaletteIndex].lightHC : colorPalettes[colorPaletteIndex].text,
  }), [colorPaletteIndex, highContrastMode]);

  const resetLevel = useCallback(() => {
    if (debugMode) {
      const { board, solution } = generateSolvableLevel(grid.length, Math.max(2, currentLevel + 1));
      setGrid(board);
      setSolution(solution);
    } else {
      setGrid(getLevel(currentLevel));
      setSolution([]);
    }
    setMoveCount(0);
    setGameWon(false);
    setHintTile(null);
  }, [currentLevel, debugMode, grid.length]);

  const handleTileClick = useCallback((row: number, col: number) => {
    if (gameWon) return;
    if (isAudioLoaded()) {
      playTileInteractionSound();
    }
    setGrid(prevGrid => {
      const newGrid = engageNode(prevGrid, row, col);
      return newGrid;
    });
    setMoveCount(prevCount => prevCount + 1);
    setHintTile(null);
  }, [gameWon, playTileInteractionSound, isAudioLoaded]);

  useEffect(() => {
    if (!gameWon) {
      const isAligned = scanAlignment(grid);
      if (isAligned) {
        setGameWon(true);
        setShowConfetti(true);
        setHintTile(null);
        if (isAudioLoaded()) {
          playLevelCompletionSound();
        }
        setTimeout(() => setShowConfetti(false), 5000);
      }
    }
  }, [grid, gameWon, playLevelCompletionSound, isAudioLoaded]);

  const nextLevel = useCallback(() => {
    const nextLevelIndex = currentLevel + 1;
    if (nextLevelIndex < getTotalLevels()) {
      setCurrentLevel(nextLevelIndex);
      if (debugMode) {
        const { board, solution } = generateSolvableLevel(grid.length, Math.max(2, nextLevelIndex + 1));
        setGrid(board);
        setSolution(solution);
      } else {
        setGrid(getLevel(nextLevelIndex));
        setSolution([]);
      }
      setMoveCount(0);
      setGameWon(false);
      setHintTile(null);
    }
  }, [currentLevel, debugMode, grid.length]);

  const handleRequestHint = useCallback(() => {
    if (gameWon) return;
    
    // Toggle hint off if it's already showing
    if (hintTile !== null) {
      setHintTile(null);
      return;
    }

    // Find the next best move that improves the board state
    const nextMove = findNextMove(grid);
    
    if (nextMove) {
      // Show the improving move
      setHintTile(nextMove);
    } else {
      // No improving move found - potential monetization point
      // In the future, this could trigger a premium hint purchase prompt
      console.log('No improving move found - premium hint opportunity');
      setHintTile(null);
    }
  }, [gameWon, grid, hintTile]);

  const handleHintUsed = useCallback(() => {
    setHintTile(null);
  }, []);

  useEffect(() => {
    if (gameWon) {
      const timer = setTimeout(nextLevel, 2000);
      return () => clearTimeout(timer);
    }
  }, [gameWon, nextLevel]);

  const toggleDebugMode = useCallback(() => {
    setDebugMode(prev => {
      const newDebugMode = !prev;
      if (newDebugMode) {
        const { board, solution } = generateSolvableLevel(grid.length, Math.max(2, currentLevel + 1));
        setGrid(board);
        setSolution(solution);
      } else {
        setGrid(getLevel(currentLevel));
        setSolution([]);
      }
      return newDebugMode;
    });
  }, [currentLevel, grid.length]);

  const generateSpecificDebugLevel = useCallback(() => {
    if (debugMode) {
      const specificSolution: [number, number][] = [[0, 0], [1, 1], [2, 2]];
      const { board, solution } = generateSpecificLevel(3, specificSolution);
      setGrid(board);
      setSolution(solution);
      setCurrentLevel(0);
      setMoveCount(0);
      setGameWon(false);
      setHintTile(null);
    }
  }, [debugMode]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8" style={{ backgroundColor: currentColorPalette.light }}>
      {showConfetti && <Confetti 
        colors={[currentColorPalette.dark, currentColorPalette.darkest, currentColorPalette.light]}
        numberOfPieces={200}
      />}
      <div className="rounded-2xl neumorphic-shadow p-4 sm:p-6 max-w-md w-full" style={{ backgroundColor: currentColorPalette.light }}>
        <ScreenDisplay
          levelName={`Level ${currentLevel + 1}`}
          moveCount={moveCount}
          gameWon={gameWon}
          colorPalette={currentColorPalette}
          tutorialMessage={null}
          debugMode={debugMode}
        />
        <div className="my-6">
          <GameBoard
            grid={grid}
            onTileClick={handleTileClick}
            hintTile={hintTile}
            colorPalette={highContrastMode ? {
              light: currentColorPalette.lightHC,
              dark: currentColorPalette.darkHC,
              lightHC: currentColorPalette.lightHC,
              darkHC: currentColorPalette.darkHC,
            } : {
              light: currentColorPalette.light,
              dark: currentColorPalette.dark,
              lightHC: currentColorPalette.lightHC,
              darkHC: currentColorPalette.darkHC,
            }}
            debugMode={debugMode}
            solution={solution}
            onHintUsed={handleHintUsed}
          />
        </div>
      </div>
      <div className="mt-4 flex space-x-4">
        {[
          { onClick: () => setIsSettingsOpen(true), title: "Adjust Parameters", icon: Settings },
          { onClick: () => setIsHelpOpen(true), title: "Access Knowledge", icon: HelpCircle },
          { onClick: resetLevel, title: "Reset Matrix", icon: RotateCcw },
          { onClick: handleRequestHint, title: "Consult Oracle", icon: Zap, active: hintTile !== null },
          { onClick: toggleDebugMode, title: "Toggle Debug Mode", icon: Bug },
          { onClick: nextLevel, title: "Next Level", icon: Target },
          ...(debugMode ? [{ onClick: generateSpecificDebugLevel, title: "Generate Specific Level", icon: Target }] : []),
        ].map(({ onClick, title, icon: Icon, active }) => (
          <button
            key={title}
            className={`neumorphic-button ${active ? 'active' : ''}`}
            onClick={onClick}
            title={title}
            style={{
              backgroundColor: currentColorPalette.light,
              color: currentColorPalette.darkest,
              ...(active && { boxShadow: 'inset 2px 2px 5px rgba(0, 0, 0, 0.2), inset -2px -2px 5px rgba(255, 255, 255, 0.2)' })
            }}
          >
            <Icon size={24} />
          </button>
        ))}
      </div>
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} textColor={currentColorPalette.darkest} />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        colorPalettes={colorPalettes}
        selectedPaletteIndex={colorPaletteIndex}
        onColorChange={setColorPaletteIndex}
        textColor={currentColorPalette.darkest}
        highContrastMode={highContrastMode}
        onHighContrastToggle={() => setHighContrastMode(prev => !prev)}
        volume={volume}
        onVolumeChange={setVolume}
      />
    </div>
  );
}

export default App;
