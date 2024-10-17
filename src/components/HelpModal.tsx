import React from 'react';
import { X } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#e0e5ec] rounded-2xl neumorphic-shadow p-6 max-w-md w-full m-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-700">How to Play</h2>
          <button onClick={onClose} className="neumorphic-button p-2">
            <X size={24} />
          </button>
        </div>
        <div className="space-y-4 text-gray-700">
          <p>Welcome to Quantum Flip! Here's how to play:</p>
          <ol className="list-decimal list-inside space-y-2">
            <li>Click on any tile to flip it and its adjacent tiles.</li>
            <li>Your goal is to make all tiles the same color.</li>
            <li>Complete the level with as few moves as possible.</li>
            <li>Use the "I'm Stuck" button for a hint if you need help.</li>
            <li>Progress through levels of increasing difficulty.</li>
          </ol>
          <p>Tips:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Plan your moves carefully to minimize the number of flips.</li>
            <li>Sometimes, flipping a tile multiple times is necessary.</li>
            <li>The high contrast mode can help if you have trouble distinguishing the tiles.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;