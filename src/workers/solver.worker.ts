import { findOptimalSolution } from '../utils/optimizedSolutionFinder';
import { BoardState, SolutionStep } from '../types';

interface SolverMessage {
  type: 'SOLVE';
  board: BoardState;
  maxDepth?: number;
}

interface SolverResponse {
  type: 'SOLUTION';
  solution: SolutionStep[] | null;
  timeTaken: number;
}

self.onmessage = async (e: MessageEvent<SolverMessage>) => {
  if (e.data.type === 'SOLVE') {
    const startTime = performance.now();
    const solution = findOptimalSolution(e.data.board, e.data.maxDepth);
    const timeTaken = performance.now() - startTime;

    const response: SolverResponse = {
      type: 'SOLUTION',
      solution,
      timeTaken
    };

    self.postMessage(response);
  }
};
