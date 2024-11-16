import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  worker: {
    format: 'es',
    plugins: []
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          'game-logic': [
            './src/utils/gameLogic.ts',
            './src/utils/optimizedSolutionFinder.ts',
            './src/utils/boardOperations.ts'
          ]
        }
      }
    }
  },
  optimizeDeps: {
    exclude: ['src/workers/solver.worker.ts']
  }
});
