# Agent Development Log

## Project Structure
- `src/utils/game/`: Core game logic
  - `nodeOperations.ts`: Node manipulation (engageNode, getNeighbors)
  - `boardAnalysis.ts`: Board state analysis (scanAlignment, findNextMove)
  - `levelGeneration.ts`: Level generation and validation
  - `levelData.ts`: Level management and progression
  - `index.ts`: Central exports for game module

- `src/utils/audio/`: Audio system
  - `audioManager.ts`: Sound management
  - `constants.ts`: Audio file paths and settings
  - `types.ts`: Audio-related type definitions
  - `index.ts`: Central exports for audio module

- `src/components/`: React components
  - `GameBoard.tsx`: Main game grid component
  - `ScreenDisplay.tsx`: Game status display
  - `terminal/`: Terminal display system
    - Handles game messages and status updates

## Key Game Mechanics
- Board is a matrix of boolean values (true = light, false = dark)
- Clicking a node toggles it and adjacent nodes
- Goal is to align all nodes to same state
- Levels increase in size and complexity
- Progress saved in local storage

## Development Notes
- Development server runs on port 5176
- Sound effects load from /public/sounds/
- Debug mode available in development
- High contrast mode for accessibility

## Current Features
- Progressive level system
- Hint system for move suggestions
- Audio feedback
- Terminal-style display
- Debug tools in development mode
- Settings for visual and audio preferences

## Technical Requirements
- Node.js
- React + TypeScript
- Vite for development
- Tailwind CSS for styling
