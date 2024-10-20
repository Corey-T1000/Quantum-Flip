import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Settings, HelpCircle, RotateCcw, Zap } from 'lucide-react';
import GameBoard from './components/GameBoard';
import GameControls from './components/GameControls';
import HelpModal from './components/HelpModal';
import SettingsModal from './components/SettingsModal';
import ScreenDisplay from './components/ScreenDisplay';
import Confetti from 'react-confetti';
import { engageNode, scanAlignment, consultOracle, getInitialBoardState } from './utils/gameLogic';
import { useAudio } from './utils/audio';
import { BoardState } from './types';
import { getLevelById, getNextLevelId } from './utils/levelData';

const INITIAL_LEVEL_ID = 'tutorial1';

const colorPalettes = [
  { light: '#e0e5ec', dark: '#a3b1c6', darkest: '#4a5568', lightHC: '#ffffff', darkHC: '#000000', text: '#ffffff' },
  { light: '#f0e6db', dark: '#8a7a66', darkest: '#4d3319', lightHC: '#fff5e6', darkHC: '#4d3319', text: '#ffffff' },
  { light: '#e6f0e8', dark: '#6b8e7b', darkest: '#1a332b', lightHC: '#f0fff5', darkHC: '#1a332b', text: '#ffffff' },
  { light: '#e8e6f0', dark: '#7b6b8e', darkest: '#2b1a33', lightHC: '#f5f0ff', darkHC: '#2b1a33', text: '#ffffff' },
];

const HINT_COOLDOWN = 10000; // 10 seconds cooldown

function App() {
  const [currentLevelId, setCurrentLevelId] = useState(INITIAL_LEVEL_ID);
  const [grid, setGrid] = useState<BoardState>(() => {
    const initialLevel = getLevelById(INITIAL_LEVEL_ID);
    return initialLevel ? getInitialBoardState(initialLevel) : [];
  });
  const [moveCount, setMoveCount] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [hintTile, setHintTile] = useState<[number, number] | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [colorPaletteIndex, setColorPaletteIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [volume, setVolume] = useState(1);
  const { playTileInteractionSound, playLevelCompletionSound } = useAudio();
  const [lastHintTime, setLastHintTime] = useState(0);

  const currentLevel = useMemo(() => getLevelById(currentLevelId), [currentLevelId]);

  const currentColorPalette = useMemo(() => {
    const palette = colorPalettes[colorPaletteIndex];
    return {
      ...palette,
      text: highContrastMode ? palette.lightHC : palette.text,
    };
  }, [colorPaletteIndex, highContrastMode]);

  const resetLevel = useCallback(() => {
    console.log("Resetting level");
    if (currentLevel) {
      setGrid(getInitialBoardState(currentLevel));
      setMoveCount(0);
      setGameWon(false);
      setHintTile(null);
    }
  }, [currentLevel]);

  const handleTileClick = useCallback((row: number, col: number) => {
    console.log(`Tile clicked: row ${row}, col ${col}`);
    if (gameWon) {
      console.log("Game already won, ignoring click");
      return;
    }

    console.log("Attempting to play tile interaction sound");
    playTileInteractionSound();

    setGrid(prevGrid => {
      const newGrid = engageNode(prevGrid, row, col);
      console.log("New grid state:", JSON.stringify(newGrid));
      return newGrid;
    });

    setMoveCount(prevCount => prevCount + 1);
    setHintTile(null); // Clear the hint when a tile is clicked
  }, [gameWon, playTileInteractionSound]);

  useEffect(() => {
    const isAligned = scanAlignment(grid);
    console.log(`Checking alignment. isAligned=${isAligned}, current gameWon=${gameWon}`);
    if (isAligned && !gameWon) {
      console.log("Alignment detected, setting gameWon to true");
      setGameWon(true);
      setShowConfetti(true);
      console.log("Attempting to play level completion sound");
      playLevelCompletionSound();
      setTimeout(() => setShowConfetti(false), 5000);
    } else if (!isAligned && gameWon) {
      console.log("Grid not aligned, but gameWon is true. Setting gameWon to false");
      setGameWon(false);
    }
  }, [grid, gameWon, playLevelCompletionSound]);

  const nextLevel = useCallback(() => {
    const nextLevelId = getNextLevelId(currentLevelId);
    if (nextLevelId) {
      setCurrentLevelId(nextLevelId);
      const nextLevel = getLevelById(nextLevelId);
      if (nextLevel) {
        setGrid(getInitialBoardState(nextLevel));
        setMoveCount(0);
        setGameWon(false);
        setHintTile(null);
      }
    }
  }, [currentLevelId]);

  const handleStuckClick = useCallback(() => {
    const currentTime = Date.now();
    if (currentTime - lastHintTime < HINT_COOLDOWN) {
      console.log("Hint on cooldown");
      return;
    }

    const [row, col] = consultOracle(grid);
    setHintTile([row, col]);
    setLastHintTime(currentTime);
  }, [grid, lastHintTime]);

  const handleColorChange = useCallback((index: number) => {
    setColorPaletteIndex(index);
  }, []);

  useEffect(() => {
    if (gameWon) {
      const timer = setTimeout(() => {
        nextLevel();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [gameWon, nextLevel]);

  const handleVolumeChange = useCallback((newVolume: number) => {
    setVolume(newVolume);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8" style={{ backgroundColor: currentColorPalette.light }}>
      {showConfetti && <Confetti />}
      <div className="rounded-2xl neumorphic-shadow p-4 sm:p-6 max-w-md w-full" style={{ backgroundColor: currentColorPalette.light }}>
        <ScreenDisplay
          levelName={currentLevel?.name || ''}
          moveCount={moveCount}
          gameWon={gameWon}
          colorPalette={currentColorPalette}
          tutorialMessage={currentLevel?.description || null}
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
          />
        </div>
        <GameControls
          onNextLevel={nextLevel}
          gameWon={gameWon}
          textColor={currentColorPalette.text}
        />
      </div>
      <div className="mt-4 flex space-x-4">
        <button className="neumorphic-button" onClick={() => setIsSettingsOpen(true)} title="Adjust Parameters" style={{ backgroundColor: currentColorPalette.light, color: currentColorPalette.darkest }}>
          <Settings size={24} />
        </button>
        <button className="neumorphic-button" onClick={() => setIsHelpOpen(true)} title="Access Knowledge" style={{ backgroundColor: currentColorPalette.light, color: currentColorPalette.darkest }}>
          <HelpCircle size={24} />
        </button>
        <button className="neumorphic-button" onClick={resetLevel} title="Reset Matrix" style={{ backgroundColor: currentColorPalette.light, color: currentColorPalette.darkest }}>
          <RotateCcw size={24} />
        </button>
        <button className="neumorphic-button" onClick={handleStuckClick} title="Consult Oracle" style={{ backgroundColor: currentColorPalette.light, color: currentColorPalette.darkest }}>
          <Zap size={24} />
        </button>
      </div>
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} textColor={currentColorPalette.darkest} />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        colorPalettes={colorPalettes}
        selectedPaletteIndex={colorPaletteIndex}
        onColorChange={handleColorChange}
        textColor={currentColorPalette.darkest}
        highContrastMode={highContrastMode}
        onHighContrastToggle={() => setHighContrastMode(prev => !prev)}
        volume={volume}
        onVolumeChange={handleVolumeChange}
      />
    </div>
  );
}

export default App;
