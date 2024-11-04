import { renderHook, act } from '@testing-library/react';
import { useAudioManager } from '../index';

// Mock Audio API
const mockPlay = jest.fn().mockImplementation(() => Promise.resolve());
const mockPause = jest.fn();
const mockLoad = jest.fn().mockImplementation(() => Promise.resolve());

// Mock Audio constructor
(global as any).Audio = jest.fn().mockImplementation(() => ({
  load: mockLoad,
  play: mockPlay,
  pause: mockPause,
  currentTime: 0
}));

describe('Audio System', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes audio system', async () => {
    const { result } = renderHook(() => useAudioManager());
    
    // Initially not loaded
    expect(result.current.isAudioLoaded).toBe(false);

    // Wait for audio to load
    await act(async () => {
      await Promise.resolve(); // Wait for all promises to resolve
    });

    // Should be loaded after initialization
    expect(result.current.isAudioLoaded).toBe(true);
    expect(Audio).toHaveBeenCalledWith('/sounds/tile-interaction.mp3');
    expect(Audio).toHaveBeenCalledWith('/sounds/level-completion.mp3');
  });

  it('plays tile interaction sound', async () => {
    const { result } = renderHook(() => useAudioManager());

    // Wait for audio to load
    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      result.current.playTileInteractionSound();
      await Promise.resolve(); // Wait for play promise to resolve
    });

    expect(mockPlay).toHaveBeenCalled();
  });

  it('plays level completion sound', async () => {
    const { result } = renderHook(() => useAudioManager());

    // Wait for audio to load
    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      result.current.playLevelCompletionSound();
      await Promise.resolve(); // Wait for play promise to resolve
    });

    expect(mockPlay).toHaveBeenCalled();
  });

  it('handles audio load failure', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    const mockLoadFailure = jest.fn().mockImplementation(() => Promise.reject(new Error('Failed to load')));
    
    (global as any).Audio = jest.fn().mockImplementation(() => ({
      load: mockLoadFailure,
      play: mockPlay,
      pause: mockPause,
      currentTime: 0
    }));

    const { result } = renderHook(() => useAudioManager());

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.isAudioLoaded).toBe(false);
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it('handles play failure', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    const mockPlayFailure = jest.fn().mockImplementation(() => Promise.reject(new Error('Failed to play')));
    
    (global as any).Audio = jest.fn().mockImplementation(() => ({
      load: mockLoad,
      play: mockPlayFailure,
      pause: mockPause,
      currentTime: 0
    }));

    const { result } = renderHook(() => useAudioManager());

    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      result.current.playTileInteractionSound();
      await Promise.resolve(); // Wait for play promise to reject
    });

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  it('cleans up audio on unmount', async () => {
    const { unmount } = renderHook(() => useAudioManager());

    await act(async () => {
      await Promise.resolve();
    });

    unmount();
    expect(mockPause).toHaveBeenCalled();
  });
});
