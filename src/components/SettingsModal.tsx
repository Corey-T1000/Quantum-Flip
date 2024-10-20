import React from 'react';
import { X } from 'lucide-react';
import ColorPalette from './ColorPalette';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  colorPalettes: { light: string; dark: string; lightHC: string; darkHC: string; text: string; }[];
  selectedPaletteIndex: number;
  onColorChange: (index: number) => void;
  textColor: string;
  highContrastMode: boolean;
  onHighContrastToggle: () => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  colorPalettes,
  selectedPaletteIndex,
  onColorChange,
  textColor,
  highContrastMode,
  onHighContrastToggle,
  volume,
  onVolumeChange,
}) => {
  if (!isOpen) return null;

  const selectedPalette = colorPalettes[selectedPaletteIndex];

  const handleVolumeChange = (newVolume: number) => {
    onVolumeChange(newVolume);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="rounded-2xl neumorphic-shadow p-6 max-w-md w-full m-4" style={{ backgroundColor: selectedPalette.light }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold" style={{ color: textColor }}>Matrix Parameters</h2>
          <button onClick={onClose} className="neumorphic-button p-2">
            <X size={24} />
          </button>
        </div>
        <div className="space-y-4" style={{ color: textColor }}>
          <div>
            <h3 className="text-lg font-semibold mb-2">Chromatic Resonance</h3>
            <ColorPalette
              palettes={colorPalettes}
              selectedIndex={selectedPaletteIndex}
              onColorChange={onColorChange}
              highContrast={highContrastMode}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Visual Enhancement</h3>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={highContrastMode}
                onChange={onHighContrastToggle}
                className="mr-2"
              />
              High Contrast Mode
            </label>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2" style={{ color: textColor }}>Volume</h3>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
