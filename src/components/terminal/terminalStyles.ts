import { css } from '@emotion/css';
import { ColorPalette } from './types';

export const getTerminalStyles = (colorPalette: ColorPalette) => css`
  .terminal-window {
    padding: 1.5rem;
    min-height: min(250px, 40vh);
    max-height: min(350px, 60vh);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    background: linear-gradient(180deg, ${colorPalette.darkest}F0 0%, ${colorPalette.darkest} 100%);
    box-shadow: inset 0 0 20px ${colorPalette.darkest}80;
    overscroll-behavior: contain;
    scroll-behavior: smooth;
    touch-action: pan-y;
  }

  .terminal-line {
    margin-bottom: 0.5rem;
    color: ${colorPalette.text};
  }

  .timestamp {
    color: ${colorPalette.dark};
    margin-right: 0.5rem;
  }

  .prompt-symbol {
    color: ${colorPalette.text};
    margin-right: 0.5rem;
  }

  .typing-effect {
    animation: blink 1s step-end infinite;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  @media (min-width: 768px) {
    .terminal-window {
      padding: 1rem;
      min-height: 120px;
      max-height: 200px;
    }
  }

  @media (hover: none) and (pointer: coarse) {
    .terminal-window {
      scrollbar-width: none;
      -ms-overflow-style: none;
      -webkit-overflow-scrolling: touch;
    }
    .terminal-window::-webkit-scrollbar {
      display: none;
    }
  }
`;
