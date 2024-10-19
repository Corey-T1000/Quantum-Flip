import { useState, useEffect, useMemo, useCallback } from 'react';
import { Settings, HelpCircle, RotateCcw, Zap } from 'lucide-react';
import GameBoard from './components/GameBoard';
import GameControls from './components/GameControls';
import HelpModal from './components/HelpModal';
import SettingsModal from './components/SettingsModal';
import TerminalDisplay from './components/TerminalDisplay';
import Confetti from 'react-confetti';
import { engageNode, scanAlignment, consultOracle, getInitialBoardState, pregeneratedLevels } from './utils/gameLogic';
import { BoardState } from './types';

const INITIAL_LEVEL = 0;

const colorPalettes = [
  { light: '#e0e5ec', dark: '#a3b1c6', lightHC: '#ffffff', darkHC: '#000000', text: '#2d3748' },
  { light: '#f0e6db', dark: '#8a7a66', lightHC: '#fff5e6', darkHC: '#4d3319', text: '#744210' },
  { light: '#e6f0e8', dark: '#6b8e7b', lightHC: '#f0fff5', darkHC: '#1a332b', text: '#22543d' },
  { light: '#e8e6f0', dark: '#7b6b8e', lightHC: '#f5f0ff', darkHC: '#2b1a33', text: '#44337a' },
];

function App() {
  const [level, setLevel] = useState(INITIAL_LEVEL);
  const [grid, setGrid] = useState<BoardState>(() => getInitialBoardState(INITIAL_LEVEL));
  const [moveCount, setMoveCount] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [hintTile, setHintTile] = useState<[number, number] | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [colorPaletteIndex, setColorPaletteIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [isTutorialActive, setIsTutorialActive] = useState(true);
  const [highContrastMode, setHighContrastMode] = useState(false);

  const currentColorPalette = useMemo(() => colorPalettes[colorPaletteIndex], [colorPaletteIndex]);
  const textColor = currentColorPalette.text;

  const tutorialSteps = useMemo(() => [
    {
      step: 1,
      title: "Quantum Matrix Initialization",
      content: "Operator. Access granted. Prepare for protocol briefing.",
      action: () => {
        setGrid([
          [true, false, true],
          [false, false, false],
          [true, false, true]
        ]);
      },
      highlightTile: null as [number, number] | null,
    },
    {
      step: 2,
      title: "Node Engagement Protocol",
      content: "Engage the central node. Observe the ripple effect.",
      action: () => {},
      highlightTile: [1, 1] as [number, number],
    },
    {
      step: 3,
      title: "First Equilibrium Achieved",
      content: "Initial alignment complete. Prepare for advanced matrix.",
      action: () => {
        setGrid([
          [true, true, false],
          [true, false, true],
          [false, true, true]
        ]);
      },
      highlightTile: null as [number, number] | null,
    },
    {
      step: 4,
      title: "Advanced Matrix Stabilization",
      content: "Engage corner nodes. Seek perfect alignment.",
      action: () => {},
      highlightTile: null as [number, number] | null,
    },
    {
      step: 5,
      title: "Protocol Mastery Achieved",
      content: "You are now prepared. Enter the Quantum Matrix.",
      action: () => {
        setIsTutorialActive(false);
        resetLevel();
      },
      highlightTile: null as [number, number] | null,
    },
  ], []);

  useEffect(() => {
    if (isTutorialActive) {
      tutorialSteps[tutorialStep].action();
      if (tutorialStep === 4) {
        // End of tutorial
        setIsTutorialActive(false);
        resetLevel();
      }
    }
  }, [isTutorialActive, tutorialStep, tutorialSteps]);

  const handleTileClick = useCallback((row: number, col: number) => {
    if (gameWon) return;

    setGrid(prevGrid => {
      const newGrid = prevGrid.map(row => [...row]);
      engageNode(newGrid, row, col);
      
      if (isTutorialActive) {
        if (tutorialStep === 1 && row === 1 && col === 1) {
          setTutorialStep(prevStep => prevStep + 1);
        } else if (tutorialStep === 3 && scanAlignment(newGrid)) {
          setTutorialStep(prevStep => prevStep + 1);
        }
      } else if (scanAlignment(newGrid)) {
        setGameWon(true);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
      
      return newGrid;
    });

    setMoveCount(prevCount => prevCount + 1);
    setHintTile(null);
  }, [gameWon, isTutorialActive, tutorialStep]);

  // Add this effect to handle tutorial step changes
  useEffect(() => {
    if (isTutorialActive && tutorialStep === 2) {
      setGrid([
        [true, true, true],
        [true, false, true],
        [true, true, true]
      ]);
    } else if (isTutorialActive && tutorialStep === 4) {
      // End of tutorial
      setIsTutorialActive(false);
      resetLevel();
    }
  }, [isTutorialActive, tutorialStep]);

  const resetLevel = () => {
    setGrid(getInitialBoardState(level));
    setMoveCount(0);
    setGameWon(false);
    setHintTile(null);
  };

  const nextLevel = () => {
    const newLevel = level + 1;
    if (newLevel < pregeneratedLevels.length) {
      setLevel(newLevel);
      setGrid(getInitialBoardState(newLevel));
      setMoveCount(0);
      setGameWon(false);
      setHintTile(null);
    }
  };

  const handleStuckClick = () => {
    const [row, col] = consultOracle(grid);
    setHintTile([row, col]);
  };

  const handleColorChange = (index: number) => {
    setColorPaletteIndex(index);
  };

  const currentStep = isTutorialActive ? {
    step: tutorialStep + 1,
    title: tutorialSteps[tutorialStep].title,
    content: tutorialSteps[tutorialStep].content,
    highlightTile: tutorialSteps[tutorialStep].highlightTile,
  } : null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8" style={{ backgroundColor: currentColorPalette.light }}>
      {showConfetti && <Confetti />}
      <div className="rounded-2xl neumorphic-shadow p-4 sm:p-6 max-w-md w-full" style={{ backgroundColor: currentColorPalette.light }}>
        <TerminalDisplay
          level={isTutorialActive ? 0 : level}
          moveCount={moveCount}
          gameWon={gameWon}
          colorPalette={currentColorPalette}
          tutorialStep={currentStep}
        />
        <div className="my-6">
          <GameBoard
            grid={grid}
            onTileClick={handleTileClick}
            hintTile={isTutorialActive && currentStep ? currentStep.highlightTile : hintTile}
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
        {!isTutorialActive && (
          <GameControls
            onNextLevel={nextLevel}
            gameWon={gameWon}
            textColor={textColor}
          />
        )}
      </div>
      <div className="mt-4 flex space-x-4">
        <button className="neumorphic-button" onClick={() => setIsSettingsOpen(true)} title="Adjust Parameters" style={{ backgroundColor: currentColorPalette.light, color: textColor }}>
          <Settings size={24} />
        </button>
        <button className="neumorphic-button" onClick={() => setIsHelpOpen(true)} title="Access Knowledge" style={{ backgroundColor: currentColorPalette.light, color: textColor }}>
          <HelpCircle size={24} />
        </button>
        <button className="neumorphic-button" onClick={resetLevel} title="Reset Matrix" style={{ backgroundColor: currentColorPalette.light, color: textColor }}>
          <RotateCcw size={24} />
        </button>
        <button className="neumorphic-button" onClick={handleStuckClick} title="Consult Oracle" style={{ backgroundColor: currentColorPalette.light, color: textColor }}>
          <Zap size={24} />
        </button>
      </div>
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} textColor={textColor} />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        colorPalettes={colorPalettes}
        selectedPaletteIndex={colorPaletteIndex}
        onColorChange={handleColorChange}
        textColor={textColor}
        highContrastMode={highContrastMode}
        onHighContrastToggle={() => setHighContrastMode(prev => !prev)}
      />
    </div>
  );
}

export default App;
