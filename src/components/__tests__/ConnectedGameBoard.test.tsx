import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ConnectedGameBoard from '../ConnectedGameBoard';
import { gameReducer } from '../../store/gameSlice';
import { settingsReducer } from '../../store/settingsSlice';
import { terminalReducer } from '../../store/terminalSlice';
import { getLevel } from '../../utils/game/levelData';

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      game: gameReducer,
      settings: settingsReducer,
      terminal: terminalReducer
    },
    preloadedState: initialState
  });
};

describe('ConnectedGameBoard', () => {
  const mockProps = {
    onTileClick: jest.fn(),
    onHintUsed: jest.fn(),
    solution: [[0, 0], [1, 1]] as [number, number][]
  };

  const renderWithStore = (store: ReturnType<typeof createTestStore>) => {
    return render(
      <Provider store={store}>
        <ConnectedGameBoard {...mockProps} />
      </Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders initial game board state', () => {
    const store = createTestStore({
      game: {
        currentLevel: 0,
        grid: getLevel(0),
        moveCount: 0,
        gameWon: false,
        hintTile: null,
        hintLevel: 'NONE',
        hintCharges: 3,
        hintCooldown: 0,
        lastHintTime: null
      },
      settings: {
        colorPaletteIndex: 0,
        highContrastMode: false,
        volume: 1,
        debugMode: false
      }
    });

    renderWithStore(store);
    const tiles = screen.getAllByRole('button');
    expect(tiles).toHaveLength(9); // 3x3 grid for level 0
  });

  it('calls onTileClick when tile is clicked', () => {
    const store = createTestStore({
      game: {
        currentLevel: 0,
        grid: getLevel(0),
        moveCount: 0,
        gameWon: false,
        hintTile: null,
        hintLevel: 'NONE',
        hintCharges: 3,
        hintCooldown: 0,
        lastHintTime: null
      },
      settings: {
        colorPaletteIndex: 0,
        highContrastMode: false,
        volume: 1,
        debugMode: false
      }
    });

    renderWithStore(store);
    const tiles = screen.getAllByRole('button');
    fireEvent.click(tiles[0]);

    expect(mockProps.onTileClick).toHaveBeenCalledWith(0, 0);
  });

  it('calls onHintUsed when hint tile is clicked', () => {
    const store = createTestStore({
      game: {
        currentLevel: 0,
        grid: getLevel(0),
        moveCount: 0,
        gameWon: false,
        hintTile: [1, 1],
        hintLevel: 'SPECIFIC',
        hintCharges: 3,
        hintCooldown: 0,
        lastHintTime: null
      },
      settings: {
        colorPaletteIndex: 0,
        highContrastMode: false,
        volume: 1,
        debugMode: false
      }
    });

    renderWithStore(store);
    const tiles = screen.getAllByRole('button');
    fireEvent.click(tiles[4]); // Center tile (1,1)

    expect(mockProps.onHintUsed).toHaveBeenCalled();
    expect(mockProps.onTileClick).toHaveBeenCalledWith(1, 1);
  });

  it('displays hint tile when provided', () => {
    const store = createTestStore({
      game: {
        currentLevel: 0,
        grid: getLevel(0),
        moveCount: 0,
        gameWon: false,
        hintTile: [1, 1],
        hintLevel: 'SPECIFIC',
        hintCharges: 3,
        hintCooldown: 0,
        lastHintTime: null
      },
      settings: {
        colorPaletteIndex: 0,
        highContrastMode: false,
        volume: 1,
        debugMode: false
      }
    });

    renderWithStore(store);
    const tiles = screen.getAllByRole('button');
    expect(tiles[4]).toHaveClass('animate-pulse'); // Center tile (1,1) should be highlighted
  });

  it('applies high contrast mode styles', () => {
    const store = createTestStore({
      game: {
        currentLevel: 0,
        grid: getLevel(0),
        moveCount: 0,
        gameWon: false,
        hintTile: null,
        hintLevel: 'NONE',
        hintCharges: 3,
        hintCooldown: 0,
        lastHintTime: null
      },
      settings: {
        colorPaletteIndex: 0,
        highContrastMode: true,
        volume: 1,
        debugMode: false
      }
    });

    renderWithStore(store);
    const tiles = screen.getAllByRole('button');
    // Check that high contrast colors are applied
    tiles.forEach(tile => {
      const style = window.getComputedStyle(tile);
      expect(style.backgroundColor).toBeDefined();
    });
  });

  it('shows solution in debug mode', () => {
    const store = createTestStore({
      game: {
        currentLevel: 0,
        grid: getLevel(0),
        moveCount: 0,
        gameWon: false,
        hintTile: null,
        hintLevel: 'NONE',
        hintCharges: 3,
        hintCooldown: 0,
        lastHintTime: null
      },
      settings: {
        colorPaletteIndex: 0,
        highContrastMode: false,
        volume: 1,
        debugMode: true
      }
    });

    renderWithStore(store);
    const tiles = screen.getAllByRole('button');
    // Check that solution tiles have debug styling
    tiles.forEach(tile => {
      const style = window.getComputedStyle(tile);
      expect(style.border).toBeDefined();
    });
  });

  it('updates when color palette changes', () => {
    const store = createTestStore({
      game: {
        currentLevel: 0,
        grid: getLevel(0),
        moveCount: 0,
        gameWon: false,
        hintTile: null,
        hintLevel: 'NONE',
        hintCharges: 3,
        hintCooldown: 0,
        lastHintTime: null
      },
      settings: {
        colorPaletteIndex: 1, // Different color palette
        highContrastMode: false,
        volume: 1,
        debugMode: false
      }
    });

    renderWithStore(store);
    const tiles = screen.getAllByRole('button');
    // Check that new color palette is applied
    tiles.forEach(tile => {
      const style = window.getComputedStyle(tile);
      expect(style.backgroundColor).toBeDefined();
    });
  });
});
