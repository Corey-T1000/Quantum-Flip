import React from 'react';

interface ColorPaletteProps {
  palettes: { light: string; dark: string; lightHC: string; darkHC: string; text: string }[];
  selectedIndex: number;
  onColorChange: (index: number) => void;
  highContrast: boolean;
}

const ColorPalette: React.FC<ColorPaletteProps> = ({ palettes, selectedIndex, onColorChange, highContrast }) => {
  return (
    <div className="mt-4 flex space-x-2">
      {palettes.map((palette, index) => (
        <button
          key={index}
          className={`w-8 h-8 rounded-full neumorphic-shadow ${selectedIndex === index ? 'ring-2 ring-blue-500' : ''}`}
          style={{
            background: highContrast
              ? `linear-gradient(135deg, ${palette.lightHC} 0%, ${palette.lightHC} 50%, ${palette.darkHC} 50%, ${palette.darkHC} 100%)`
              : `linear-gradient(135deg, ${palette.light} 0%, ${palette.light} 50%, ${palette.dark} 50%, ${palette.dark} 100%)`,
          }}
          onClick={() => onColorChange(index)}
          title={`Color Palette ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default ColorPalette;
