import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Settings, HelpCircle, RotateCcw, Zap, Bug, Target } from 'lucide-react';
import GameBoard from './components/GameBoard';
import SettingsModal from './components/SettingsModal';
import ScreenDisplay, { ScreenDisplayHandle } from './components/ScreenDisplay';
import Confetti from 'react-confetti';
import { engageNode, scanAlignment, findNextMove } from './utils/gameLogic';
import { useAudio } from './utils/audio';
import { BoardState } from './types';
import { getLevel, getTotalLevels } from './utils/levelData';
import { generateSolvableLevel } from './utils/levelGenerator';

const INITIAL_LEVEL = 0;

const colorPalettes = [
  { light: '#e0e5ec', dark: '#a3b1c6', darkest: '#4a5568', lightHC: '#ffffff', darkHC: '#000000', text: '#ffffff' },
  { light: '#f0e6db', dark: '#8a7a66', darkest: '#4d3319', lightHC: '#fff5e6', darkHC: '#4d3319', text: '#ffffff' },
  { light: '#e6f0e8', dark: '#6b8e7b', darkest: '#1a332b', lightHC: '#f0fff5', darkHC: '#1a332b', text: '#ffffff' },
  { light: '#e8e6f0', dark: '#7b6b8e', darkest: '#2b1a33', lightHC: '#f5f0ff', darkHC: '#2b1a33', text: '#ffffff' },
];

const helpContent = [
  'Operator. Access granted to Quantum Matrix. Proceed.',
  '',
  '1. Engage a tile. Neighbors react. Disrupt the lattice.',
  '2. Achieve uniformity. All tiles must align.',
  '3. Endure. Adapt. Synchronize.',
  '4. Consult the oracle if needed. Dependence weakens your skills.',
  '5. Complexity rises. Stabilize the chaotic matrices.',
  '6. Adjust chromatic resonance via parameter controls.',
  '7. Modify matrix dimensions to alter challenge intensity.',
  '',
  'Warnings:',
  '• Every action has consequences.',
  '• True mastery lies in minimal disruption.',
  '• Visual enhancement mode available for optimal node distinction.',
  '• Experiment with matrix sizes to find your optimal challenge threshold.'
];

function App() {
  const [currentLevel, setCurrentLevel] = useState(INITIAL_LEVEL);
  const [grid, setGrid] = useState<BoardState>(() => getLevel(INITIAL_LEVEL));
  const [moveCount, setMoveCount] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [hintTile, setHintTile] = useState<[number, number] | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [colorPaletteIndex, setColorPaletteIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [volume, setVolume] = useState(1);
  const [debugMode, setDebugMode] = useState(false);
  const [solution, setSolution] = useState<[number, number][]>([]);
  const screenDisplayRef = useRef<ScreenDisplayHandle>(null);

  const { playTileInteractionSound, playLevelCompletionSound, isAudioLoaded } = useAudio();

  const currentColorPalette = useMemo(() => ({
    ...colorPalettes[colorPaletteIndex],
    text: highContrastMode ? colorPalettes[colorPaletteIndex].lightHC : colorPalettes[colorPaletteIndex].text,
  }), [colorPaletteIndex, highContrastMode]);

  // Calculate board coverage progress
  const progress = useMemo(() => {
    const totalTiles = grid.length * grid.length;
    const activeTiles = grid.flat().filter(tile => tile).length;
    return activeTiles / totalTiles;
  }, [grid]);

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
    
    if (hintTile !== null) {
      setHintTile(null);
      return;
    }

    const nextMove = findNextMove(grid);
    
    if (nextMove) {
      setHintTile(nextMove);
    } else {
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

  const handleShowHelp = useCallback(() => {
    if (screenDisplayRef.current) {
      screenDisplayRef.current.addTerminalEntry({
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
        <ScreenDisplay
          ref={screenDisplayRef}
          levelName={`Level ${currentLevel + 1}`}
          moveCount={moveCount}
          gameWon={gameWon}
          colorPalette={currentColorPalette}
          tutorialMessage={null}
          debugMode={debugMode}
          progress={progress}
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
      <div className="mt-4 flex justify-center items-center gap-8">
        <style>
          {`
            .control-button {
              width: 50px;
              height: 50px;
              border-radius: 15px;
              display: flex;
              align-items: center;
              justify-content: center;
              transition: all 0.3s ease;
              position: relative;
              overflow: hidden;
            }

            .control-button::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%);
              border-radius: 15px;
              opacity: 0.5;
            }

            .control-button:active {
              transform: scale(0.95);
            }

            .control-button.active {
              transform: scale(0.95);
              box-shadow: 
                inset 3px 3px 6px rgba(0, 0, 0, 0.2),
                inset -3px -3px 6px rgba(255, 255, 255, 0.2),
                0px 0px 10px rgba(0, 0, 0, 0.1);
            }
          `}
        </style>
        <button
          className="control-button"
          onClick={resetLevel}
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
          <button
            className={`control-button ${debugMode ? 'active' : ''}`}
            onClick={toggleDebugMode}
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
        )}

        {debugMode && process.env.NODE_ENV === 'development' && (
          <button
            className="control-button"
            onClick={nextLevel}
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
        )}
      </div>
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
