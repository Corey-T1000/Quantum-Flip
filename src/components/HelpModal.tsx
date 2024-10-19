import React from 'react';
import { X } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  textColor: string;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, textColor }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#e0e5ec] rounded-2xl neumorphic-shadow w-full max-w-md m-4 flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-bold" style={{ color: textColor }}>Quantum Matrix Protocol</h2>
          <button onClick={onClose} className="neumorphic-button p-2">
            <X size={24} />
          </button>
        </div>
        <div className="p-4 overflow-y-auto flex-grow" style={{ color: textColor }}>
          <div className="space-y-4">
            <p>Operator. Access granted to Quantum Matrix. Proceed.</p>
            <ol className="list-decimal list-inside space-y-2">
              <li>Engage a tile. Neighbors react. Disrupt the lattice.</li>
              <li>Achieve uniformity. All tiles must align.</li>
              <li>Endure. Adapt. Synchronize.</li>
              <li>Consult the oracle if needed. Dependence weakens your skills.</li>
              <li>Complexity rises. Stabilize the chaotic matrices.</li>
              <li>Adjust chromatic resonance via parameter controls.</li>
              <li>Modify matrix dimensions to alter challenge intensity.</li>
            </ol>
            <p>Warnings:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Every action has consequences.</li>
              <li>True mastery lies in minimal disruption.</li>
              <li>Visual enhancement mode available for optimal node distinction.</li>
              <li>Experiment with matrix sizes to find your optimal challenge threshold.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;