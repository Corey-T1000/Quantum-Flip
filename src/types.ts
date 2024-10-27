export type BoardState = boolean[][];

export interface LevelData {
  board: BoardState;
  solution: [number, number][];
}

export interface GameState {
  currentLevel: number;
  grid: BoardState;
  moveCount: number;
  gameWon: boolean;
  hintTile: [number, number] | null;
}
