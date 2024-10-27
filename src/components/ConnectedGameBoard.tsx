import React from 'react';
import { useAppSelector } from '../store/hooks';
import GameBoard from './GameBoard';

interface ConnectedGameBoardProps {
  onTileClick: (row: number, col: number) => void;
  onHintUsed: () => void;
  solution: [number, number][];
}

const ConnectedGameBoard: React.FC<ConnectedGameBoardProps> = ({
  onTileClick,
  onHintUsed,
  solution
}) => {
  const {
    grid,
    hintTile
  } = useAppSelector(state => state.game);
  const {
    colorPaletteIndex,
    highContrastMode,
    debugMode
  } = useAppSelector(state => state.settings);

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

  return (
    <GameBoard
      grid={grid}
      onTileClick={onTileClick}
      hintTile={hintTile}
      colorPalette={currentColorPalette}
      debugMode={debugMode}
      solution={solution}
      onHintUsed={onHintUsed}
    />
  );
};

export default ConnectedGameBoard;
