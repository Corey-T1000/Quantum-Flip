interface T9Key {
  number: string;
  letters: string;
}

export const T9_KEYS: T9Key[] = [
  { number: '1', letters: '1.,!' },
  { number: '2', letters: 'abc2' },
  { number: '3', letters: 'def3' },
  { number: '4', letters: 'ghi4' },
  { number: '5', letters: 'jkl5' },
  { number: '6', letters: 'mno6' },
  { number: '7', letters: 'pqrs7' },
  { number: '8', letters: 'tuv8' },
  { number: '9', letters: 'wxyz9' },
];

export class T9Input {
  private currentKey: string = '';
  private keyPressTime: number = 0;
  private currentPosition: number = 0;
  private text: string = '';
  private readonly KEY_TIMEOUT = 1000;

  constructor() {
    this.reset();
  }

  public handleKeyPress(key: string): string {
    const now = Date.now();
    
    if (key === '0') {
      this.text += ' ';
      this.resetCurrentKey();
      return this.text;
    }
    
    if (key === '*') {
      if (this.text.length > 0) {
        this.text = this.text.slice(0, -1);
      }
      this.resetCurrentKey();
      return this.text;
    }
    
    if (key === '#') {
      this.confirmCurrentKey();
      return this.text;
    }

    const t9Key = T9_KEYS.find(k => k.number === key);
    if (!t9Key) return this.text;

    if (key === this.currentKey && (now - this.keyPressTime) < this.KEY_TIMEOUT) {
      // Cycle through characters
      this.currentPosition = (this.currentPosition + 1) % t9Key.letters.length;
      this.text = this.text.slice(0, -1) + t9Key.letters[this.currentPosition];
    } else {
      this.confirmCurrentKey();
      this.currentKey = key;
      this.currentPosition = 0;
      this.text += t9Key.letters[0];
    }

    this.keyPressTime = now;
    return this.text;
  }

  private confirmCurrentKey(): void {
    this.resetCurrentKey();
  }

  private resetCurrentKey(): void {
    this.currentKey = '';
    this.currentPosition = 0;
    this.keyPressTime = 0;
  }

  public getText(): string {
    return this.text;
  }

  public reset(): void {
    this.text = '';
    this.resetCurrentKey();
  }
}