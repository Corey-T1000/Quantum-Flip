export type BoardState = boolean[][];

export interface SolutionStep {
  row: number;
  col: number;
  step: number;
}

export interface GeneratedBoard {
  board: BoardState;
  solution: [number, number][];
}