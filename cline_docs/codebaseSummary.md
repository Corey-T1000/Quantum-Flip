## Key Components

### Game Logic
- boardAnalysis.ts: Core quantum mechanics and move validation
- levelGeneration.ts: Level creation and progression (QA verified)
  * Tutorial levels (0-4): Fixed 3x3 patterns
  * Regular levels (5+): Dynamic sizing and complexity
- nodeOperations.ts: Tile manipulation and state management

### State Management
- gameSlice.ts: Game state including hint system
  * Level progression tracking
  * Move counting
  * Win condition management
  * Hint system state
- settingsSlice.ts: User preferences and game settings
- terminalSlice.ts: Terminal interface state

### UI Components
- GameBoard.tsx: Main game interface
- SettingsModal.tsx: Game configuration
- Terminal.tsx: Command interface

## Level Progression System
### Tutorial Sequence (0-4)
- Fixed 3x3 board size
- Predefined patterns for learning
- Consistent hint charge system
- Progressive complexity introduction

### Regular Levels (5+)
- Dynamic Board Sizing:
  * Levels 5-9: 3x3
  * Levels 10-14: 4x4
  * Levels 15-19: 5x5
  * Levels 20+: 6x6 (maximum)

- Solution Complexity:
  * Minimum moves: 3 + floor(level/5), capped at 6
  * Maximum moves: minMoves + 2, capped at 8
  * Random variation within bounds

- Hint System:
  * 3 charges per level
  * Replenishes on level change
  * Cooldown between uses

## Data Flow
1. User initiates hint request
2. gameSlice processes hint activation
3. boardAnalysis calculates valid moves
4. GameBoard renders hint visualization
5. User receives visual feedback

## Oracle/Hint System Architecture
- Calculation Layer (boardAnalysis.ts)
  * Determines valid moves
  * Applies quantum rules
  * Calculates move outcomes

- State Management (gameSlice.ts)
  * Controls hint activation
  * Manages hint state
  * Tracks hint usage

- Presentation Layer (GameBoard.tsx)
  * Renders hint indicators
  * Provides visual feedback
  * Handles user interaction

## Recent Changes
- Level progression QA completed
- Solution complexity verification
- Hint system integration testing
- State management validation

## Planned Improvements
- Progressive hint system
- Enhanced visual feedback
- Strategic hint management
- Tutorial integration
- Accessibility features

## External Dependencies
- React for UI
- Redux for state management
- Tailwind for styling

## Testing Coverage
- Unit Tests:
  * Level generation
  * Board operations
  * State management
  * Move validation

- Integration Tests:
  * Level progression
  * Game state management
  * Hint system
  * Tutorial sequence

- Planned Tests:
  * Visual regression
  * Accessibility
  * Performance
  * End-to-end gameplay
