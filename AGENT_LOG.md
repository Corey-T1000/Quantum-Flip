# Agent Development Log

## Project Structure
- `src/utils/game/`: Core game logic
  - `nodeOperations.ts`: Node manipulation (engageNode, getNeighbors)
    - Handles tile state toggling in cross pattern
    - Manages neighbor detection and state matching
  - `boardAnalysis.ts`: Board state analysis
    - Checks win conditions (uniform state)
    - Evaluates move quality
    - Provides hint suggestions
  - `levelGeneration.ts`: Level generation and validation
    - Creates solvable puzzle configurations
    - Generates progressive difficulty levels
    - Verifies level solvability
  - `levelData.ts`: Level management and progression
    - Manages 30 pre-generated levels
    - Handles level retrieval and solutions
  - `index.ts`: Central exports for game module

- `src/utils/audio/`: Audio system
  - `audioManager.ts`: Sound management
  - `constants.ts`: Audio file paths and settings
  - `types.ts`: Audio-related type definitions
  - `index.ts`: Central exports for audio module

- `src/components/`: React components
  - `GameBoard.tsx`: Main game grid component
  - `ScreenDisplay.tsx`: Game status display
  - `SettingsModal.tsx`: Game configuration interface
  - `terminal/`: Terminal display system
    - Handles game messages and status updates
    - Provides command-line style interface

## Key Game Mechanics
- Board Structure:
  - Matrix of boolean values (true = light, false = dark)
  - Three grid sizes: 3x3, 4x4, and 5x5
  - Cross-pattern interaction (clicked tile + adjacent tiles)

- Level Design:
  - 30 total levels across 3 difficulty tiers:
    - Tier 1 (Levels 1-10): 3x3 grid, 2-10 moves to solve
    - Tier 2 (Levels 11-20): 4x4 grid, 2-10 moves to solve
    - Tier 3 (Levels 21-30): 5x5 grid, 2-10 moves to solve
  - Each level is pre-generated with guaranteed solution
  - Difficulty increases through grid size and solution length

- Game Flow:
  - Click tiles to toggle states
  - Goal is to achieve uniform state (all light or all dark)
  - Progress saved in local storage
  - Hint system available for move suggestions

## Development Notes
- Development server runs on port 5174
- Sound effects load from /public/sounds/
  - tile-interaction.mp3: Plays on tile clicks
  - level-completion.mp3: Plays on level completion
- Debug mode available in development
  - Shows grid coordinates
  - Displays solution path
  - Provides level generation insights
- High contrast mode for accessibility
  - Enhanced color differentiation
  - Improved visual feedback

## Current Features
- Progressive level system (30 levels)
- Hint system using board analysis
- Audio feedback for interactions
- Terminal-style display for game status
- Debug tools in development mode
- Settings for:
  - Color themes (4 palettes)
  - High contrast mode
  - Audio volume
  - Visual preferences

## Technical Requirements
- Node.js (v14+)
- React 18 + TypeScript
- Vite for development
- Tailwind CSS for styling
- Lucide React for icons

## Development Roadmap
- Additional game modes planned
- Multiplayer features under consideration
- Mobile optimization in progress
- Achievement system planned
- Leaderboard integration proposed

## Recent Changes
- Tutorial System Implementation (2024-01-09):
  - Added integrated tutorial flow for first 5 levels
  - Tutorial messages tied to specific level patterns:
    - Level 1: Introduction to basic tile interaction
    - Level 2: Learning adjacent corner relationships
    - Level 3: Understanding triangle patterns
    - Level 4: Mastering diagonal sequences
    - Level 5: Advanced cross-pattern manipulation
  - Messages displayed through existing terminal UI
  - Progressive learning curve with hands-on practice
  - Non-intrusive guidance using existing interface elements

- Level Persistence Implementation (2024-01-09):
  - Added localStorage-based level persistence
  - Levels now remain consistent across page reloads
  - Debug mode shows solutions for pre-generated levels
  - Added "Regenerate All Levels" debug feature
  - Improved hint system reliability with consistent levels

- Level Generation System Overhaul (2024-01-09):
  - Implemented structured patterns for early levels (1-5):
    - Level 1: Single center move for basic introduction
    - Level 2: Adjacent corners for simple interaction
    - Level 3: Triangle pattern introducing diagonal thinking
    - Level 4: Diagonal sequence with corner move
    - Level 5: Cross pattern for advanced interaction
  - Added pattern-based generation for medium levels (6-10):
    - Center-outward spiral progression
    - Predictable move sequences
    - Gradual complexity increase
  - Enhanced larger grid generation (4x4, 5x5):
    - Center-based initial moves
    - Pattern-focused placement
    - Controlled randomization
  - Improved hint system compatibility across all levels
  - Better difficulty scaling and learning curve

- Progress Bar Calculation Update (2024-01-09):
  - Changed progress calculation to be more intuitive
  - Now based on distance from 50/50 split instead of dominant ratio
  - Progress = 0 when tiles are evenly split (50/50)
  - Progress = 1 when tiles are uniform (100% same color)
  - Formula: Math.abs(lightRatio - 0.5) * 2
  - Provides better visual feedback of progress toward solution
