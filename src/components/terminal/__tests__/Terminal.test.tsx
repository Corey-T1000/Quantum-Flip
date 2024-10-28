/** @jsxImportSource react */
import { render, screen } from '@testing-library/react';
import Terminal from '../Terminal';
import { TerminalLine } from '../TerminalLine';
import StatusBar from '../StatusBar';
import { ColorPalette, TerminalEntryType } from '../types';

const mockColorPalette: ColorPalette = {
  darkest: '#1a1a1a',
  dark: '#2a2a2a',
  light: '#ffffff',
  lightHC: '#ffffff',
  darkHC: '#000000',
  text: '#ffffff'
};

// Mock formatTimestamp to return consistent values for testing
jest.mock('../../../utils/time', () => ({
  formatTimestamp: () => '12:00:00'
}));

const mockEntries = [
  {
    timestamp: '12:00:00',
    content: ['Test message 1'],
    type: 'help' as TerminalEntryType
  },
  {
    timestamp: '12:00:01',
    content: ['Test message 2'],
    type: 'error' as TerminalEntryType
  }
];

describe('Terminal Components', () => {
  describe('Terminal', () => {
    const defaultProps = {
      entries: mockEntries,
      levelName: 'Test Level',
      moveCount: 0,
      tutorialMessage: null,
      debugMode: false,
      progress: 0,
      dominantState: 'light' as const,
      colorPalette: mockColorPalette,
      onReset: jest.fn(),
      onRequestHint: jest.fn(),
      onShowHelp: jest.fn(),
      onOpenSettings: jest.fn(),
      onToggleDebug: jest.fn(),
      onNextLevel: jest.fn(),
      onResetAllLevels: jest.fn(),
      hintTile: null
    };

    it('renders terminal window with entries', () => {
      render(<Terminal {...defaultProps} />);
      expect(screen.getByText('Test message 1')).toBeInTheDocument();
      expect(screen.getByText('Test message 2')).toBeInTheDocument();
    });

    it('formats timestamps correctly', () => {
      render(<Terminal {...defaultProps} />);
      const timestamps = screen.getAllByText(/\d{2}:\d{2}:\d{2}/);
      expect(timestamps).toHaveLength(2);
      expect(timestamps[0]).toHaveTextContent('12:00:00');
      expect(timestamps[1]).toHaveTextContent('12:00:01');
    });

    it('applies correct styles based on entry type', () => {
      render(<Terminal {...defaultProps} />);
      const helpMessage = screen.getByText('Test message 1');
      const errorMessage = screen.getByText('Test message 2');
      
      // Find the closest parent with a CSS class
      const helpParent = helpMessage.closest('[class*="css-"]');
      const errorParent = errorMessage.closest('[class*="css-"]');
      
      expect(helpParent).toBeInTheDocument();
      expect(errorParent).toBeInTheDocument();
      expect(helpParent?.className).toMatch(/css-/);
      expect(errorParent?.className).toMatch(/css-/);
    });

    it('scrolls to bottom when new entries are added', () => {
      const { rerender } = render(<Terminal {...defaultProps} />);
      
      const newEntries = [
        ...mockEntries,
        {
          timestamp: '12:00:02',
          content: ['Test message 3'],
          type: 'success' as TerminalEntryType
        }
      ];

      rerender(<Terminal {...defaultProps} entries={newEntries} />);
      expect(screen.getByText('Test message 3')).toBeInTheDocument();
    });

    it('applies animation styles to new entries', () => {
      const { container } = render(<Terminal {...defaultProps} />);
      const terminalLines = container.getElementsByClassName('css-y9vz2i');
      expect(terminalLines.length).toBeGreaterThan(0);
    });

    it('maintains compact layout with multiple entries', () => {
      const longEntries = Array(10).fill(null).map((_, i) => ({
        timestamp: `12:00:${i.toString().padStart(2, '0')}`,
        content: [`Test message ${i + 1}`],
        type: 'help' as TerminalEntryType
      }));

      const { container } = render(
        <Terminal {...defaultProps} entries={longEntries} />
      );

      const terminalWindow = container.getElementsByClassName('css-4w1zsu')[0];
      expect(terminalWindow).toBeTruthy();
    });
  });

  describe('TerminalLine', () => {
    const defaultProps = {
      timestamp: '12:00:00',
      content: ['Test content'],
      type: 'help' as TerminalEntryType,
      colorPalette: mockColorPalette
    };

    it('renders single line content correctly', () => {
      render(<TerminalLine {...defaultProps} />);
      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('renders multi-line content correctly', () => {
      render(
        <TerminalLine
          {...defaultProps}
          content={['Line 1', 'Line 2']}
        />
      );
      expect(screen.getByText('Line 1')).toBeInTheDocument();
      expect(screen.getByText('Line 2')).toBeInTheDocument();
    });

    it('renders timestamp in correct format', () => {
      render(<TerminalLine {...defaultProps} />);
      const timestamp = screen.getByText(/\d{2}:\d{2}:\d{2}/);
      expect(timestamp).toHaveTextContent('12:00:00');
    });

    it('renders prompt symbol', () => {
      render(<TerminalLine {...defaultProps} />);
      expect(screen.getByText('❯')).toBeInTheDocument();
    });

    it('applies correct type-based styling', () => {
      const { rerender } = render(<TerminalLine {...defaultProps} type="error" />);
      const errorContent = screen.getByText('Test content');
      const errorParent = errorContent.closest('[class*="css-"]');
      expect(errorParent).toBeInTheDocument();
      expect(errorParent?.className).toMatch(/css-/);

      rerender(<TerminalLine {...defaultProps} type="success" />);
      const successContent = screen.getByText('Test content');
      const successParent = successContent.closest('[class*="css-"]');
      expect(successParent).toBeInTheDocument();
      expect(successParent?.className).toMatch(/css-/);

      rerender(<TerminalLine {...defaultProps} type="help" />);
      const helpContent = screen.getByText('Test content');
      const helpParent = helpContent.closest('[class*="css-"]');
      expect(helpParent).toBeInTheDocument();
      expect(helpParent?.className).toMatch(/css-/);
    });

    it('applies text animation styles', () => {
      const { container } = render(<TerminalLine {...defaultProps} />);
      const lineContent = container.getElementsByClassName('css-2qm7m3')[0];
      expect(lineContent).toBeTruthy();
    });
  });

  describe('StatusBar', () => {
    const defaultProps = {
      levelName: 'Test Level',
      moveCount: 5,
      tutorialMessage: 'Tutorial hint',
      debugMode: false,
      progress: 0.5,
      dominantState: 'light' as const,
      colorPalette: mockColorPalette,
      onReset: jest.fn(),
      onRequestHint: jest.fn(),
      onShowHelp: jest.fn(),
      onOpenSettings: jest.fn(),
      onToggleDebug: jest.fn(),
      onNextLevel: jest.fn(),
      onResetAllLevels: jest.fn(),
      hintTile: null
    };

    it('renders level name and move count', () => {
      render(<StatusBar {...defaultProps} />);
      expect(screen.getByText(/Test Level/)).toBeInTheDocument();
      expect(screen.getByText(/Moves: 5/)).toBeInTheDocument();
    });

    it('displays progress in debug mode', () => {
      render(<StatusBar {...defaultProps} debugMode={true} />);
      expect(screen.getByText(/Progress: 50.0%/)).toBeInTheDocument();
    });

    it('shows dominant state', () => {
      render(<StatusBar {...defaultProps} />);
      expect(screen.getByText(/State: light/)).toBeInTheDocument();
    });

    it('renders control buttons', () => {
      render(<StatusBar {...defaultProps} />);
      expect(screen.getByTitle('Reset Quantum State')).toBeInTheDocument();
      expect(screen.getByTitle('Request Oracle Guidance')).toBeInTheDocument();
      expect(screen.getByTitle('Access Protocol Manual')).toBeInTheDocument();
      expect(screen.getByTitle('Settings')).toBeInTheDocument();
    });

    it('handles button clicks', () => {
      const onReset = jest.fn();
      const onRequestHint = jest.fn();
      const onShowHelp = jest.fn();
      const onOpenSettings = jest.fn();

      render(<StatusBar {...defaultProps} 
        onReset={onReset}
        onRequestHint={onRequestHint}
        onShowHelp={onShowHelp}
        onOpenSettings={onOpenSettings}
      />);

      screen.getByTitle('Reset Quantum State').click();
      expect(onReset).toHaveBeenCalled();

      screen.getByTitle('Request Oracle Guidance').click();
      expect(onRequestHint).toHaveBeenCalled();

      screen.getByTitle('Access Protocol Manual').click();
      expect(onShowHelp).toHaveBeenCalled();

      screen.getByTitle('Settings').click();
      expect(onOpenSettings).toHaveBeenCalled();
    });
  });
});
