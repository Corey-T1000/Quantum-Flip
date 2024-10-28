import { css } from '@emotion/css';
import { ColorPalette } from './types';

export const terminalStyles = (colorPalette: ColorPalette) => ({
  terminalWindow: css`
    padding: 1rem;
    min-height: min(250px, 40vh);
    max-height: min(350px, 60vh);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    background: ${colorPalette.darkest};
    box-shadow: 
      inset 0 0 20px ${colorPalette.darkest},
      0 1px 4px ${colorPalette.darkest}40;
    overscroll-behavior: contain;
    scroll-behavior: smooth;
    touch-action: pan-y;
    border: 1px solid ${colorPalette.dark}30;
    border-bottom: none;
    border-radius: 4px 4px 0 0;
    font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Monaco, 'Courier New', monospace;
    font-size: 0.9rem;
    line-height: 1.5;

    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: ${colorPalette.dark}60;
      border-radius: 3px;
      
      &:hover {
        background: ${colorPalette.dark}80;
      }
    }

    @media (min-width: 768px) {
      padding: 1rem;
      min-height: 120px;
      max-height: 200px;
    }

    @media (hover: none) and (pointer: coarse) {
      scrollbar-width: none;
      -ms-overflow-style: none;
      -webkit-overflow-scrolling: touch;
      
      &::-webkit-scrollbar {
        display: none;
      }
    }
  `,

  terminalLine: css`
    padding: 0.25rem 0;
    color: ${colorPalette.text};
    opacity: 0;
    animation: fadeIn 0.3s ease-out forwards;
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;

    @keyframes fadeIn {
      from { 
        opacity: 0;
        transform: translateY(5px);
      }
      to { 
        opacity: 1;
        transform: translateY(0);
      }
    }
  `,

  lineContent: css`
    flex: 1;
    word-break: break-word;
    opacity: 0;
    animation: textFadeIn 0.4s ease-out forwards;
    animation-delay: 0.1s;

    @keyframes textFadeIn {
      from {
        opacity: 0;
        transform: translateX(3px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `,

  timestamp: css`
    color: ${colorPalette.dark};
    opacity: 0.7;
    font-size: 0.8em;
    font-variant-numeric: tabular-nums;
    min-width: 60px;
    user-select: none;
  `,

  promptSymbol: css`
    color: ${colorPalette.light}CC;
    font-weight: 500;
    user-select: none;
  `,

  help: css`
    color: ${colorPalette.light};
    border-left: 2px solid ${colorPalette.light}80;
    padding-left: 0.5rem;
    margin-left: 0.25rem;
  `,

  error: css`
    color: #ff6b6b;
    border-left: 2px solid #ff6b6b80;
    padding-left: 0.5rem;
    margin-left: 0.25rem;
    text-shadow: 0 0 8px #ff6b6b20;
  `,

  success: css`
    color: #69db7c;
    border-left: 2px solid #69db7c80;
    padding-left: 0.5rem;
    margin-left: 0.25rem;
    text-shadow: 0 0 8px #69db7c20;
  `,

  statusBar: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 1rem;
    background: ${colorPalette.darkest};
    border: 1px solid ${colorPalette.dark}30;
    border-top: none;
    border-radius: 0 0 4px 4px;
    font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Monaco, 'Courier New', monospace;
    font-size: 0.9rem;
  `,

  statusContent: css`
    display: flex;
    gap: 1rem;
    flex: 1;
  `,

  statusGroup: css`
    display: flex;
    gap: 0.75rem;
  `,

  statusItem: css`
    color: ${colorPalette.text}CC;
    font-size: 0.85em;
  `,

  controlButtons: css`
    display: flex;
    gap: 0.5rem;
    margin-left: 1rem;
  `,

  controlButton: css`
    background: none;
    border: none;
    color: ${colorPalette.text}80;
    padding: 0.25rem;
    cursor: pointer;
    transition: color 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      color: ${colorPalette.text};
    }

    &.active {
      color: ${colorPalette.light};
    }

    svg {
      width: 1.1em;
      height: 1.1em;
    }
  `
});
