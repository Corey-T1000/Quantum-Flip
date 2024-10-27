import React from 'react';
import { css } from '@emotion/css';
import { getTerminalStyles } from './terminalStyles';
import { ColorPalette } from './types';

interface TerminalLineProps {
  timestamp: string;
  content: string | string[];
  type?: 'help' | 'error' | 'success';
  colorPalette: ColorPalette;
}

const TerminalLine: React.FC<TerminalLineProps> = ({
  timestamp,
  content,
  type,
  colorPalette
}) => {
  const terminalStyles = getTerminalStyles(colorPalette);

  const renderContent = (content: string | string[]) => {
    if (Array.isArray(content)) {
      return content.map((line, index) => (
        <div key={index} className={css`${terminalStyles} .terminal-line`}>
          {line}
        </div>
      ));
    }
    return <div className={css`${terminalStyles} .terminal-line`}>{content}</div>;
  };

  return (
    <div>
      <span className={css`${terminalStyles} .timestamp`}>{timestamp}</span>
      <span className={css`${terminalStyles} .prompt-symbol`}>{`>`}</span>
      {renderContent(content)}
    </div>
  );
};

export default TerminalLine;
