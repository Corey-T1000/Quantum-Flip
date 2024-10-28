import React from 'react';
import { TerminalLineProps } from './types';
import { terminalStyles } from './terminalStyles';

export const TerminalLine: React.FC<TerminalLineProps> = ({
  timestamp,
  content,
  type,
  colorPalette
}) => {
  const styles = terminalStyles(colorPalette);

  const renderContent = (content: string | string[]) => {
    if (Array.isArray(content)) {
      return content.map((line, index) => (
        <div key={index} className={styles.lineContent}>
          <span className={type ? styles[type] : undefined}>
            {line}
          </span>
        </div>
      ));
    }
    return (
      <div className={styles.lineContent}>
        <span className={type ? styles[type] : undefined}>
          {content}
        </span>
      </div>
    );
  };

  return (
    <div className={styles.terminalLine}>
      <span className={styles.timestamp}>{timestamp}</span>
      <span className={styles.promptSymbol}>❯</span>
      {renderContent(content)}
    </div>
  );
};
