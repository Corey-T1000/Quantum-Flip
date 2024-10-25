export interface ColorPalette {
  darkest: string;
  text: string;
  light: string;
  dark: string;
  lightHC: string;
  darkHC: string;
}

export interface TerminalEntry {
  timestamp: string;
  content: string | string[];
  type: 'command' | 'response' | 'status' | 'progress' | 'system' | 'help';
  count?: number;
  level?: string;
  state?: 'light' | 'dark';
}
