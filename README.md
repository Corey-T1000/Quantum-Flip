# Quantum-Flip

Quantum-Flip is a strategic puzzle game that challenges players to manipulate quantum states in a grid-based environment. Engage with the Quantum Matrix and test your skills in achieving equilibrium across multiple levels of increasing complexity.

## Features

- Grid-based gameplay with quantum-inspired mechanics
- Progressive difficulty levels (30 levels across 3 difficulty tiers)
- Neumorphic design with customizable color palettes
- Accessibility options, including high contrast mode
- Responsive design for various devices
- Immersive sound effects
- Terminal-style display for game status
- Debug mode for development
- State persistence for game progress
- Redux-based state management

## Getting Started

### Prerequisites

- Node.js (version 14 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/Corey-T1000/Quantum-Flip.git
   ```

2. Navigate to the project directory:
   ```
   cd Quantum-Flip
   ```

3. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

### Running the Development Server

Start the development server:

```
npm run dev
```
or
```
yarn dev
```

Open your browser and visit `http://localhost:5175` to play the game.

### Running Tests

```
npm test
```
or
```
yarn test
```

## Project Structure

- `src/`: Source code for the game
  - `components/`: React components for game elements
    - `terminal/`: Terminal display system components
    - `GameBoard.tsx`: Main game grid component
    - `ScreenDisplay.tsx`: Game status display
    - `SettingsModal.tsx`: Game settings interface
  - `store/`: Redux store and state management
    - `gameSlice.ts`: Game state management
    - `settingsSlice.ts`: Settings state management
    - `terminalSlice.ts`: Terminal state management
    - `index.ts`: Store configuration
  - `utils/`: Utility functions and game logic
    - `game/`: Core game mechanics
    - `audio/`: Sound system
  - `types.ts`: TypeScript type definitions
- `public/`: Static assets
  - `sounds/`: Game audio effects

## State Management

The game uses Redux for state management, with the following slices:

### Game State
- Current level
- Grid state
- Move count
- Win condition
- Hint system
- Progress tracking

### Settings State
- Color palette selection
- High contrast mode
- Volume control
- Debug mode

### Terminal State
- Command history
- Timestamp display
- Tutorial messages

## Technologies Used

- React 18
- TypeScript
- Vite
- Redux Toolkit
- Redux Persist
- Tailwind CSS
- Lucide React (for icons)
- Jest (testing)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Inspired by quantum mechanics concepts
- Sound effects created using Web Audio API

## Future Enhancements

- Additional game modes
- Multiplayer functionality
- Advanced quantum mechanics concepts
- Leaderboards and achievements
- Mobile app versions

Enjoy playing Quantum-Flip and mastering the Quantum Matrix!
