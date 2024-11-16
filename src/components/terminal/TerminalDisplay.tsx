import React from 'react';
import MessageList from './MessageList';
import TerminalInput from './TerminalInput';
import useTerminal from '../../hooks/useTerminal';

interface TerminalDisplayProps {
  onCommand?: (command: string) => void;
  initialMessages?: string[];
  disabled?: boolean;
}

const TerminalDisplay: React.FC<TerminalDisplayProps> = ({
  onCommand,
  initialMessages = [],
  disabled = false,
}) => {
  const {
    messages,
    addMessage,
    clearMessages,
  } = useTerminal();

  React.useEffect(() => {
    initialMessages.forEach(msg => {
      addMessage(msg, 'system');
    });
  }, []);

  const handleCommand = (input: string) => {
    addMessage(`> ${input}`, 'system');
    onCommand?.(input);
  };

  return (
    <div className="terminal-display bg-gray-900 text-green-400 p-4 rounded-lg h-full flex flex-col">
      <div className="terminal-header flex justify-between items-center mb-4">
        <h3 className="text-xl font-mono">Terminal</h3>
        <button
          onClick={clearMessages}
          className="text-sm text-gray-500 hover:text-gray-400"
        >
          Clear
        </button>
      </div>
      
      <div className="flex-grow overflow-hidden">
        <MessageList messages={messages} />
      </div>

      <TerminalInput
        onSubmit={handleCommand}
        disabled={disabled}
        placeholder="Enter command..."
      />
    </div>
  );
};

export default TerminalDisplay;
