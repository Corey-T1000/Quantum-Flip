import { BoardState } from '../types';

// Pregenerated board states for each level
export const pregeneratedLevels: BoardState[][] = [
  [
    [
      [true, false, true],
      [false, true, false],
      [true, false, true]
    ],
    [
      [false, true, false],
      [true, false, true],
      [false, true, false]
    ],
    [
      [true, false, true],
      [false, false, false],
      [true, false, true]
    ]
  ],
  [
    [
      [true, false, true, false],
      [false, true, false, true],
      [true, false, true, false],
      [false, true, false, true]
    ],
    [
      [false, true, false, true],
      [true, false, true, false],
      [false, true, false, true],
      [true, false, true, false]
    ],
    [
      [true, false, false, true],
      [false, true, true, false],
      [false, true, true, false],
      [true, false, false, true]
    ]
  ],
  // Add more levels as needed
];

export const getInitialBoardState = (level: number): BoardState => {
  if (level < 0 || level >= pregeneratedLevels.length) {
    throw new Error('Invalid level');
  }
  return pregeneratedLevels[level][0];
};

export const engageNode = (matrix: BoardState, row: number, col: number): void => {
  const size = matrix.length;
  matrix[row][col] = !matrix[row][col];
  if (row > 0) matrix[row - 1][col] = !matrix[row - 1][col];
  if (row < size - 1) matrix[row + 1][col] = !matrix[row + 1][col];
  if (col > 0) matrix[row][col - 1] = !matrix[row][col - 1];
  if (col < size - 1) matrix[row][col + 1] = !matrix[row][col + 1];
};

export const scanAlignment = (matrix: BoardState): boolean => {
  const referenceState = matrix[0][0];
  return matrix.every((row) => row.every((node) => node === referenceState));
};

export const consultOracle = (matrix: BoardState): [number, number] => {
  const size = matrix.length;
  let optimalScore = -Infinity;
  let optimalMove: [number, number] = [-1, -1];

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const score = evaluateEngagement(matrix, row, col);
      if (score > optimalScore) {
        optimalScore = score;
        optimalMove = [row, col];
      }
    }
  }

  return optimalMove;
};

const evaluateEngagement = (matrix: BoardState, row: number, col: number): number => {
  const projectedMatrix = matrix.map(row => [...row]);
  engageNode(projectedMatrix, row, col);

  let alignedNodes = 0;
  let totalNodes = 0;

  projectedMatrix.forEach(row => {
    row.forEach(node => {
      if (node) alignedNodes++;
      totalNodes++;
    });
  });

  return Math.max(alignedNodes, totalNodes - alignedNodes);
};
