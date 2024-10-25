import React from 'react';
import { TerminalStyles } from './terminalStyles';
import { ColorPalette, TerminalEntry } from './types';

interface TerminalLineProps extends TerminalEntry {
  showTimestamps: boolean;
  colorPalette: ColorPalette;
}

const TerminalLine: React.FC<TerminalLineProps> = ({
  timestamp,
  content,
  type,
  count,
  level,
  state,
  showTimestamps,
  colorPalette
}) => {
  const styles = TerminalStyles(colorPalette);
  
  const renderContent = (content: string | string[]) => {
    if (Array.isArray(content)) {
      return content.map((line, i) => (
        <div key={i} className="ml-4">
          {line}
        </div>
      ));
    }
    return content;
  };

  return (
    <div className="terminal-line typing-effect mb-2 text-base md:text-sm">
      {showTimestamps && (
        <span style={{ ...styles.text.dim, marginRight: '1rem' }}>
          {timestamp}
        </span>
      )}
      {type === 'command' && count ? (
        <div className="flex items-center space-x-3 py-1">
          <span className="prompt-symbol text-lg md:text-base">❯</span>
          <span style={{ 
            color: state === 'light' ? styles.charm.primary : styles.charm.secondary,
            textShadow: `0 0 10px ${state === 'light' ? styles.charm.highlight : styles.charm.shadow}33`,
            fontWeight: 'bold'
          }}>
            M{level}
          </span>
          <span style={{ color: styles.charm.gray200 }}>{content}</span>
          <span style={{ ...styles.text.dim }} className="ml-2">×{count}</span>
        </div>
      ) : type === 'help' ? (
        <div className="py-1" style={{ color: styles.charm.warning }}>
          <div className="flex items-center space-x-3">
            <span className="prompt-symbol text-lg md:text-base">❯</span>
            <span style={{ fontWeight: 'bold' }}>help.display()</span>
          </div>
          <div className="mt-2">{renderContent(content)}</div>
        </div>
      ) : (
        <span style={{ color: type === 'system' ? styles.charm.success : styles.charm.foreground }}>
          {renderContent(content)}
        </span>
      )}
    </div>
  );
};

export default TerminalLine;
