export type BoardState = boolean[][];

export interface Level {
  id: string;
  name: string;
  description: string;
  grid: string[];
}
