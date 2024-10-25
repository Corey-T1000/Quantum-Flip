import { ColorPalette } from './types';

export const TerminalStyles = (colorPalette: ColorPalette) => {
  const charm = {
    background: colorPalette.darkest,
    foreground: colorPalette.text,
    primary: colorPalette.light,
    secondary: colorPalette.dark,
    highlight: colorPalette.lightHC,
    shadow: colorPalette.darkHC,
    success: '#9ECE6A',
    warning: '#E0AF68',
    error: '#F7768E',
    gray100: colorPalette.text,
    gray200: `${colorPalette.text}CC`,
    gray300: `${colorPalette.text}99`,
    gray400: `${colorPalette.text}66`,
    gray500: `${colorPalette.text}44`,
    gray600: `${colorPalette.darkest}CC`,
    gray700: colorPalette.darkest,
    gray800: `${colorPalette.darkHC}CC`,
    gray900: colorPalette.darkHC,
  };

  return {
    charm,
    text: {
      normal: { color: charm.gray100 },
      dim: { color: charm.gray300 },
      highlight: { color: charm.primary },
      success: { color: charm.success },
      warning: { color: charm.warning },
      error: { color: charm.error },
    },
    border: {
      normal: `1px solid ${charm.gray600}`,
      highlight: `1px solid ${charm.primary}`,
      glow: `0 0 10px ${charm.primary}33`,
    },
  };
};
