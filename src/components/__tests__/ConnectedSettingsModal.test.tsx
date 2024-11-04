import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ConnectedSettingsModal from '../ConnectedSettingsModal';
import { settingsReducer } from '../../store/settingsSlice';
import { ColorPalette } from '../terminal/types';

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      settings: settingsReducer
    },
    preloadedState: initialState
  });
};

describe('ConnectedSettingsModal', () => {
  const mockColorPalettes: ColorPalette[] = [
    {
      light: '#e0e5ec',
      dark: '#a3b1c6',
      darkest: '#4a5568',
      lightHC: '#ffffff',
      darkHC: '#000000',
      text: '#ffffff'
    },
    {
      light: '#f0e6db',
      dark: '#8a7a66',
      darkest: '#4d3319',
      lightHC: '#fff5e6',
      darkHC: '#4d3319',
      text: '#ffffff'
    }
  ];

  const mockProps = {
    isOpen: true,
    onClose: jest.fn(),
    colorPalettes: mockColorPalettes,
    textColor: '#ffffff'
  };

  const renderWithStore = (store: ReturnType<typeof createTestStore>) => {
    return render(
      <Provider store={store}>
        <ConnectedSettingsModal {...mockProps} />
      </Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders when isOpen is true', () => {
    const store = createTestStore({
      settings: {
        highContrastMode: false,
        volume: 1,
        colorPaletteIndex: 0,
        debugMode: false
      }
    });

    renderWithStore(store);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    const store = createTestStore({
      settings: {
        highContrastMode: false,
        volume: 1,
        colorPaletteIndex: 0,
        debugMode: false
      }
    });

    render(
      <Provider store={store}>
        <ConnectedSettingsModal {...mockProps} isOpen={false} />
      </Provider>
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('toggles high contrast mode', () => {
    const store = createTestStore({
      settings: {
        highContrastMode: false,
        volume: 1,
        colorPaletteIndex: 0,
        debugMode: false
      }
    });

    renderWithStore(store);
    const toggleButton = screen.getByRole('switch', { name: /high contrast/i });
    fireEvent.click(toggleButton);

    expect(store.getState().settings.highContrastMode).toBe(true);
  });

  it('updates volume', () => {
    const store = createTestStore({
      settings: {
        highContrastMode: false,
        volume: 1,
        colorPaletteIndex: 0,
        debugMode: false
      }
    });

    renderWithStore(store);
    const volumeSlider = screen.getByRole('slider', { name: /volume/i });
    fireEvent.change(volumeSlider, { target: { value: '0.5' } });

    expect(store.getState().settings.volume).toBe(0.5);
  });

  it('calls onClose when close button is clicked', () => {
    const store = createTestStore({
      settings: {
        highContrastMode: false,
        volume: 1,
        colorPaletteIndex: 0,
        debugMode: false
      }
    });

    renderWithStore(store);
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(mockProps.onClose).toHaveBeenCalled();
  });

  it('displays current settings state', () => {
    const store = createTestStore({
      settings: {
        highContrastMode: true,
        volume: 0.5,
        colorPaletteIndex: 0,
        debugMode: false
      }
    });

    renderWithStore(store);
    
    const contrastToggle = screen.getByRole('switch', { name: /high contrast/i });
    expect(contrastToggle).toBeChecked();

    const volumeSlider = screen.getByRole('slider', { name: /volume/i });
    expect(volumeSlider).toHaveValue('0.5');
  });

  it('maintains settings after modal is closed and reopened', () => {
    const store = createTestStore({
      settings: {
        highContrastMode: true,
        volume: 0.7,
        colorPaletteIndex: 0,
        debugMode: false
      }
    });

    const { rerender } = renderWithStore(store);

    // Close modal
    rerender(
      <Provider store={store}>
        <ConnectedSettingsModal {...mockProps} isOpen={false} />
      </Provider>
    );

    // Reopen modal
    rerender(
      <Provider store={store}>
        <ConnectedSettingsModal {...mockProps} isOpen={true} />
      </Provider>
    );

    const contrastToggle = screen.getByRole('switch', { name: /high contrast/i });
    expect(contrastToggle).toBeChecked();

    const volumeSlider = screen.getByRole('slider', { name: /volume/i });
    expect(volumeSlider).toHaveValue('0.7');
  });

  it('applies text color to modal content', () => {
    const store = createTestStore({
      settings: {
        highContrastMode: false,
        volume: 1,
        colorPaletteIndex: 0,
        debugMode: false
      }
    });

    renderWithStore(store);
    const modalContent = screen.getByRole('dialog');
    expect(modalContent).toHaveStyle({ color: mockProps.textColor });
  });

  it('displays all color palettes', () => {
    const store = createTestStore({
      settings: {
        highContrastMode: false,
        volume: 1,
        colorPaletteIndex: 0,
        debugMode: false
      }
    });

    renderWithStore(store);
    mockColorPalettes.forEach((_: ColorPalette, index: number) => {
      const paletteElement = screen.getByTestId(`color-palette-${index}`);
      expect(paletteElement).toBeInTheDocument();
    });
  });
});
