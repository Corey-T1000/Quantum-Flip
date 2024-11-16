import React, { useState, KeyboardEvent } from 'react';

interface TerminalInputProps {
  onSubmit: (input: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const TerminalInput: React.FC<TerminalInputProps> = ({
  onSubmit,
  placeholder = 'Enter command...',
  disabled = false,
}) => {
  const [input, setInput] = useState('');

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      onSubmit(input.trim());
      setInput('');
    }
  };

  return (
    <div className="terminal-input-container mt-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full bg-gray-800 text-green-400 p-2 rounded border border-gray-700 focus:outline-none focus:border-green-500"
      />
    </div>
  );
};

export default TerminalInput;
