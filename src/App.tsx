import React, { useState, useEffect } from 'react';
import { Settings, HelpCircle, RotateCcw, Zap, Sun, Moon } from 'lucide-react';
import GameBoard from './components/GameBoard';
import GameControls from './components/GameControls';
import LevelInfo from './components/LevelInfo';
import HelpModal from './components/HelpModal';
import { generateGrid, flipTiles, checkWinCondition, getNextMove, isSolvable } from './utils/gameLogic';

const INITIAL_GRID_SIZE = 3;

function App() {
  const [gridSize, setGridSize] = useState(INITIAL_GRID_SIZE);
  const [grid, setGrid] = useState(() => {
    let newGrid;
    do {
      newGrid = generateGrid(INITIAL_GRID_SIZE);
    } while (!isSolvable(newGrid));
    return newGrid;
  });
  const [moveCount, setMoveCount] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [hintTile, setHintTile] = useState<[number, number] | null>(null);
  const [highContrast, setHighContrast] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  useEffect(() => {
    checkWinCondition(grid) && setGameWon(true);
  }, [grid]);

  const handleTileClick = (row: number, col: number) => {
    if (gameWon) return;

    const newGrid = grid.map(row => [...row]);
    flipTiles(newGrid, row, col);

    setGrid(newGrid);
    setMoveCount(moveCount + 1);
    setHintTile(null);
  };

  const resetGame = () => {
    let newGrid;
    do {
      newGrid = generateGrid(gridSize);
    } while (!isSolvable(newGrid));
    setGrid(newGrid);
    setMoveCount(0);
    setGameWon(false);
    setHintTile(null);
  };

  const nextLevel = () => {
    const newGridSize = gridSize + 1;
    setGridSize(newGridSize);
    let newGrid;
    do {
      newGrid = generateGrid(newGridSize);
    } while (!isSolvable(newGrid));
    setGrid(newGrid);
    setMoveCount(0);
    setGameWon(false);
    setHintTile(null);
  };

  const handleStuckClick = () => {
    const [row, col] = getNextMove(grid);
    setHintTile([row, col]);
  };

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
  };

  return (
    <div className={`min-h-screen ${highContrast ? 'bg-[#d0d5dc]' : 'bg-[#e0e5ec]'} flex flex-col items-center justify-center p-4`}>
      <h1 className="text-4xl font-bold text-gray-700 mb-8">Quantum Flip</h1>
      <div className={`${highContrast ? 'bg-[#d0d5dc]' : 'bg-[#e0e5ec]'} rounded-2xl neumorphic-shadow p-6 max-w-md w-full`}>
        <LevelInfo
          gridSize={gridSize}
          moveCount={moveCount}
          gameWon={gameWon}
        />
        <div className="my-6">
          <GameBoard grid={grid} onTileClick={handleTileClick} hintTile={hintTile} highContrast={highContrast} />
        </div>
        <GameControls
          onNextLevel={nextLevel}
          gameWon={gameWon}
        />
      </div>
      <div className="mt-4 flex space-x-4">
        <button className="neumorphic-button" onClick={toggleHighContrast} title="Toggle high contrast mode">
          {highContrast ? <Moon size={24} /> : <Sun size={24} />}
        </button>
        <button className="neumorphic-button" title="Settings">
          <Settings size={24} />
        </button>
        <button className="neumorphic-button" onClick={() => setIsHelpOpen(true)} title="Help">
          <HelpCircle size={24} />
        </button>
        <button className="neumorphic-button" onClick={resetGame} title="Reset game">
          <RotateCcw size={24} />
        </button>
        <button className="neumorphic-button" onClick={handleStuckClick} title="Get a hint">
          <Zap size={24} />
        </button>
      </div>
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}

export default App;