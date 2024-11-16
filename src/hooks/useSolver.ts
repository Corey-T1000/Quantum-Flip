import { useState, useCallback, useEffect } from 'react';
import { BoardState, SolutionStep } from '../types';
import { PerformanceMonitor } from '../utils/performance';

interface SolverState {
  solution: SolutionStep[] | null;
  isLoading: boolean;
  error: Error | null;
  timeTaken: number | null;
}

export const useSolver = () => {
  const [worker, setWorker] = useState<Worker | null>(null);
  const [state, setState] = useState<SolverState>({
    solution: null,
    isLoading: false,
    error: null,
    timeTaken: null
  });

  useEffect(() => {
    const solverWorker = new Worker(
      new URL('../workers/solver.worker.ts', import.meta.url),
      { type: 'module' }
    );

    solverWorker.onmessage = (e) => {
      if (e.data.type === 'SOLUTION') {
        setState({
          solution: e.data.solution,
          isLoading: false,
          error: null,
          timeTaken: e.data.timeTaken
        });

        // Log performance metrics
        PerformanceMonitor.measureSync('solver.solution', () => e.data.timeTaken);
      }
    };

    solverWorker.onerror = (error) => {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: new Error(error.message)
      }));
    };

    setWorker(solverWorker);

    return () => {
      solverWorker.terminate();
    };
  }, []);

  const findSolution = useCallback((
    board: BoardState,
    maxDepth?: number
  ) => {
    if (!worker) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    worker.postMessage({
      type: 'SOLVE',
      board,
      maxDepth
    });
  }, [worker]);

  return {
    ...state,
    findSolution
  };
};

export default useSolver;
