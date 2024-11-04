import { render, screen, fireEvent } from '@testing-library/react';
import GameBoard from '../GameBoard';
import { ColorPalette } from '../terminal/types';
import { HintLevel } from '../../store/gameSlice';

describe('GameBoard', () => {
  const mockColorPalette: ColorPalette = {
    dark: '#1a1a1a',
    darkest: '#000000',
    light: '#ffffff',
    lightHC: '#ffffff',
    darkHC: '#000000',
    text: '#ffffff'
  };

  const defaultProps = {
    grid: [
      [true, false],
      [false, true]
    ],
    onTileClick: jest.fn(),
    hintTile: null as [number, number] | null,
    hintLevel: HintLevel.NONE,
    affectedAreas: [] as [number, number][],
    possibleMoveCount: 0,
    colorPalette: mockColorPalette,
    debugMode: false,
    solution: [] as [number, number][],
    onHintUsed: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correct number of tiles based on grid', () => {
    render(<GameBoard {...defaultProps} />);
    const tiles = screen.getAllByRole('button');
    expect(tiles).toHaveLength(4); // 2x2 grid = 4 tiles
  });

  it('applies correct colors to tiles based on their state', () => {
    render(<GameBoard {...defaultProps} />);
    const tiles = screen.getAllByRole('button');
    
    // Check first tile (true state)
    expect(tiles[0]).toHaveStyle({
      backgroundColor: mockColorPalette.light
    });

    // Check second tile (false state)
    expect(tiles[1]).toHaveStyle({
      backgroundColor: mockColorPalette.dark
    });
  });

  it('calls onTileClick with correct coordinates when tile is clicked', () => {
    render(<GameBoard {...defaultProps} />);
    const tiles = screen.getAllByRole('button');
    
    fireEvent.click(tiles[0]); // Click first tile
    expect(defaultProps.onTileClick).toHaveBeenCalledWith(0, 0);

    fireEvent.click(tiles[3]); // Click last tile
    expect(defaultProps.onTileClick).toHaveBeenCalledWith(1, 1);
  });

  it('highlights hint tile when provided', () => {
    const propsWithHint = {
      ...defaultProps,
      hintTile: [0, 1] as [number, number],
      hintLevel: HintLevel.SPECIFIC
    };

    render(<GameBoard {...propsWithHint} />);
    const tiles = screen.getAllByRole('button');
    
    // Hint tile should have specific styling
    expect(tiles[1]).toHaveStyle({
      border: `2px solid ${mockColorPalette.darkest}`,
      transform: 'scale(1.05)'
    });
    expect(tiles[1]).toHaveClass('animate-pulse');
  });

  it('calls onHintUsed when hint tile is clicked', () => {
    const propsWithHint = {
      ...defaultProps,
      hintTile: [0, 1] as [number, number],
      hintLevel: HintLevel.SPECIFIC
    };

    render(<GameBoard {...propsWithHint} />);
    const tiles = screen.getAllByRole('button');
    
    fireEvent.click(tiles[1]); // Click hint tile
    expect(defaultProps.onHintUsed).toHaveBeenCalled();
    expect(defaultProps.onTileClick).toHaveBeenCalledWith(0, 1);
  });

  it('shows solution tiles in debug mode', () => {
    const propsWithDebug = {
      ...defaultProps,
      debugMode: true,
      solution: [[0, 0], [1, 1]] as [number, number][]
    };

    render(<GameBoard {...propsWithDebug} />);
    const tiles = screen.getAllByRole('button');
    
    // Solution tiles should have specific styling
    expect(tiles[0]).toHaveStyle({
      border: `2px solid ${mockColorPalette.darkest}`
    });
    expect(tiles[3]).toHaveStyle({
      border: `2px solid ${mockColorPalette.darkest}`
    });
  });

  it('renders with different grid sizes', () => {
    const propsWithLargerGrid = {
      ...defaultProps,
      grid: [
        [true, false, true],
        [false, true, false],
        [true, false, true]
      ]
    };

    render(<GameBoard {...propsWithLargerGrid} />);
    const tiles = screen.getAllByRole('button');
    expect(tiles).toHaveLength(9); // 3x3 grid = 9 tiles
  });

  it('applies hover styles to tiles', () => {
    render(<GameBoard {...defaultProps} />);
    const tiles = screen.getAllByRole('button');
    
    expect(tiles[0]).toHaveClass('hover:scale-105');
    expect(tiles[0]).toHaveClass('transition-all');
    expect(tiles[0]).toHaveClass('duration-300');
    expect(tiles[0]).toHaveClass('ease-in-out');
  });

  it('maintains aspect ratio for tiles', () => {
    render(<GameBoard {...defaultProps} />);
    const tiles = screen.getAllByRole('button');
    
    tiles.forEach(tile => {
      expect(tile).toHaveClass('aspect-square');
    });
  });

  it('displays possible move count when hint level is COUNT', () => {
    const propsWithCount = {
      ...defaultProps,
      hintLevel: HintLevel.COUNT,
      possibleMoveCount: 3
    };

    render(<GameBoard {...propsWithCount} />);
    expect(screen.getByText('Possible Moves: 3')).toBeInTheDocument();
  });

  it('highlights affected areas when hint level is AREA', () => {
    const propsWithArea = {
      ...defaultProps,
      hintLevel: HintLevel.AREA,
      affectedAreas: [[0, 0], [0, 1]] as [number, number][]
    };

    render(<GameBoard {...propsWithArea} />);
    const tiles = screen.getAllByRole('button');
    
    // Affected area tiles should have specific styling
    expect(tiles[0]).toHaveStyle({
      border: `1px solid ${mockColorPalette.darkest}`,
      transform: 'scale(1.02)'
    });
    expect(tiles[1]).toHaveStyle({
      border: `1px solid ${mockColorPalette.darkest}`,
      transform: 'scale(1.02)'
    });
  });
});
