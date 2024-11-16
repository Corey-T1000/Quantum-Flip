import React, { useState, useEffect, useCallback } from 'react';
import GameBoard from './components/GameBoard';
import TerminalDisplay from './components/TerminalDisplay';
import Confetti from 'react-confetti';
import { engageNode, scanAlignment, getInitialBoardState } from './utils/gameLogic';
import { findSolution } from './utils/solutionFinder';
import { BoardState } from './types';
import { loadProgress, updateLevelProgress } from './utils/progressManager';
import { useAINarrator } from './hooks/useAINarrator';
import { StoryChoice } from './types';

const colorPalettes = [
  { light: '#FFB000', dark: '#805800', lightHC: '#FFD700', darkHC: '#402C00', text: '#FFB000' }, // Amber
  { light: '#00FF00', dark: '#006400', lightHC: '#90EE90', darkHC: '#004B00', text: '#00FF00' }, // Matrix Green
  { light: '#00FFFF', dark: '#008B8B', lightHC: '#E0FFFF', darkHC: '#004D4D', text: '#00FFFF' }, // Cyan
  { light: '#FF69B4', dark: '#C71585', lightHC: '#FFB6C1', darkHC: '#8B0A50', text: '#FF69B4' }, // Pink
  { light: '#9370DB', dark: '#4B0082', lightHC: '#E6E6FA', darkHC: '#2A0047', text: '#9370DB' }  // Purple
];

function App() {
  const [level, setLevel] = useState(0);
  const [grid, setGrid] = useState<BoardState>(() => getInitialBoardState(0));
  const [moveCount, setMoveCount] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [solutionPath, setSolutionPath] = useState<any[] | null>(null);
  const [isHintCooldown, setIsHintCooldown] = useState(false);
  const [isProcessingHint, setIsProcessingHint] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [progress, setProgress] = useState(() => loadProgress());
  const [isT9Mode, setIsT9Mode] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [awaitingResponse, setAwaitingResponse] = useState(false);
  const [celebrationType, setCelebrationType] = useState<'impressive' | 'meh' | 'sarcastic' | null>(null);
  const [hasShownInitialMessage, setHasShownInitialMessage] = useState(false);
  const [selectedPalette, setSelectedPalette] = useState(0);

  const { 
    currentMessage, 
    getNextMessage, 
    updateGameState,
    makeChoice,
    onWin 
  } = useAINarrator();

  useEffect(() => {
    if (!hasShownInitialMessage) {
      getNextMessage('start');
      setHasShownInitialMessage(true);
    }
  }, [hasShownInitialMessage, getNextMessage]);

  const handleChoice = useCallback((choice: StoryChoice) => {
    setAwaitingResponse(true);
    const response = makeChoice(choice);
    if (response.isT9Mode) {
      setIsT9Mode(true);
    }
    setAwaitingResponse(false);
  }, [makeChoice]);

  const handleTileClick = useCallback((row: number, col: number) => {
    if (isT9Mode || gameWon) return;

    setGrid(currentGrid => {
      const newGrid = currentGrid.map(row => [...row]);
      engageNode(newGrid, row, col);
      return newGrid;
    });
    setMoveCount(prev => prev + 1);
    setSolutionPath(null);
  }, [gameWon, isT9Mode]);

  const handleHint = useCallback(async () => {
    if (isHintCooldown || gameWon || isProcessingHint) return;
    setIsProcessingHint(true);
    
    try {
      const solution = await findSolution(grid);
      setSolutionPath(solution);
      setIsHintCooldown(true);
      setProgress(prev => ({
        ...prev,
        oracleUses: (prev.oracleUses || 0) + 1
      }));
      
      setTimeout(() => {
        setSolutionPath(null);
        setIsHintCooldown(false);
      }, 5000);
    } catch (error) {
      console.error('Error finding solution:', error);
    } finally {
      setIsProcessingHint(false);
    }
  }, [isHintCooldown, gameWon, isProcessingHint, grid]);

  const handleT9Input = useCallback((input: string) => {
    if (!isT9Mode) return;
    setCurrentText(input);
    if (input.length >= 4) {
      handleChoice({ type: 'T9_INPUT', value: input });
      setCurrentText('');
    }
  }, [isT9Mode, handleChoice]);

  const resetLevel = useCallback(() => {
    setGrid(getInitialBoardState(level));
    setMoveCount(0);
    setGameWon(false);
    setSolutionPath(null);
  }, [level]);

  const nextLevel = useCallback(() => {
    const newLevel = level + 1;
    if (gameWon) {
      setProgress(prev => updateLevelProgress(level, moveCount, prev));
    }
    setLevel(newLevel);
    setGrid(getInitialBoardState(newLevel));
    setMoveCount(0);
    setGameWon(false);
    setSolutionPath(null);
    setCelebrationType(null);
  }, [level, gameWon, moveCount]);

  useEffect(() => {
    if (scanAlignment(grid) && !gameWon) {
      setGameWon(true);
      setSolutionPath(null);
      setShowConfetti(true);
      
      const celebration = Math.random() < 0.2 ? null : 
        moveCount <= 5 ? 'impressive' :
        moveCount <= 8 ? 'meh' : 'sarcastic';
      
      setCelebrationType(celebration);
      onWin();

      setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
    }
  }, [grid, gameWon, moveCount, onWin]);

  const handlePaletteChange = (index: number) => {
    setSelectedPalette(index);
    document.documentElement.style.setProperty('--amber-primary', colorPalettes[index].light);
    document.documentElement.style.setProperty('--amber-dim', colorPalettes[index].dark);
    document.documentElement.style.setProperty('--amber-bright', colorPalettes[index].lightHC);
    document.documentElement.style.setProperty('--amber-glow', `${colorPalettes[index].light}66`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--crt-background)]">
      {showConfetti && (
        <Confetti
          colors={[colorPalettes[selectedPalette].light, colorPalettes[selectedPalette].dark]}
          gravity={0.3}
          numberOfPieces={150}
          recycle={false}
          opacity={0.8}
        />
      )}
      <div className="w-full max-w-[min(80vh,600px)] p-4">
        <div className="w-full">
          <TerminalDisplay
            level={level}
            moveCount={moveCount}
            gameWon={gameWon}
            colorPalette={colorPalettes[selectedPalette]}
            onReset={resetLevel}
            onHint={handleHint}
            onNextLevel={nextLevel}
            isHintCooldown={isHintCooldown}
            isProcessingHint={isProcessingHint}
            progress={progress}
            celebrationType={celebrationType}
            isT9Mode={isT9Mode}
            currentMessage={currentMessage}
            onChoice={handleChoice}
            awaitingResponse={awaitingResponse}
            hasShownInitialMessage={hasShownInitialMessage}
            onColorChange={handlePaletteChange}
            colorPalettes={colorPalettes}
            selectedPalette={selectedPalette}
          />
        </div>
        <div className="w-full aspect-square">
          <GameBoard
            grid={grid}
            onTileClick={handleTileClick}
            solutionPath={solutionPath}
            highContrast={false}
            colorPalette={colorPalettes[selectedPalette]}
            isT9Mode={isT9Mode}
            currentText={currentText}
            onT9Input={handleT9Input}
          />
        </div>
      </div>
    </div>
  );
}

export default App;