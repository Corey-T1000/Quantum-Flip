import React from 'react';
import { X } from 'lucide-react';
import { ColorPalette } from './terminal/types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  colorPalettes: ColorPalette[];
  textColor: string;
  onHighContrastToggle: () => void;
  onVolumeChange: (value: number) => void;
  highContrastMode: boolean;
  volume: number;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  colorPalettes,
  textColor,
  onHighContrastToggle,
  onVolumeChange,
  highContrastMode,
  volume
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        className="rounded-2xl neumorphic-shadow p-6 max-w-md w-full m-4"
        style={{ backgroundColor: colorPalettes[0].light, color: textColor }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2
            id="settings-title"
            className="text-2xl font-bold"
          >
            Matrix Parameters
          </h2>
          <button
            className="neumorphic-button p-2"
            onClick={onClose}
            aria-label="Close settings"
          >
            <X />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Visual Enhancement</h3>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={highContrastMode}
                onChange={onHighContrastToggle}
                role="switch"
                aria-checked={highContrastMode}
                aria-label="High contrast mode"
              />
              High Contrast Mode
            </label>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">
              Volume
            </h3>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-full"
              aria-label="Volume control"
            />
          </div>
          <div>
            {colorPalettes.map((palette, index) => (
              <div
                key={index}
                data-testid={`color-palette-${index}`}
                className="flex space-x-2 mb-2"
              >
                <div
                  className="w-6 h-6 rounded"
                  style={{ backgroundColor: palette.light }}
                />
                <div
                  className="w-6 h-6 rounded"
                  style={{ backgroundColor: palette.dark }}
                />
                <div
                  className="w-6 h-6 rounded"
                  style={{ backgroundColor: palette.darkest }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
