import React from 'react';

interface TerminalDisplayProps {
  level: number;
  moveCount: number;
  gameWon: boolean;
  colorPalette: {
    light: string;
    dark: string;
    lightHC: string;
    darkHC: string;
    text: string;
  };
  tutorialStep: {
    step: number;
    title: string;
    content: string;
    highlightTile: [number, number] | null;
  } | null;
}

const TerminalDisplay: React.FC<TerminalDisplayProps> = ({
  level,
  moveCount,
  gameWon,
  tutorialStep,
  colorPalette,
}) => {
  const getOperatorMessage = () => {
    if (tutorialStep) {
      switch (tutorialStep.step) {
        case 1:
          return "Welcome, Operator. Observe the Quantum Matrix before you.";
        case 2:
          return "Excellent. Now, engage the central node to observe the ripple effect.";
        case 3:
          return "Well done. Your task is to achieve uniform state across all tiles.";
        case 4:
          return "Perfect alignment achieved. You have mastered the basics.";
        case 5:
          return "Congratulations! You are now ready to enter the Quantum Matrix.";
        default:
          return tutorialStep.content;
      }
    } else if (gameWon) {
      return "Equilibrium achieved. Proceed to next matrix.";
    } else if (moveCount === 0) {
      return "Operator. Access granted. Initiate matrix stabilization.";
    } else {
      return "Matrix destabilized. Continue realignment procedure.";
    }
  };

  const getTitle = () => {
    if (tutorialStep) {
      return `Quantum Matrix Tutorial: Step ${tutorialStep.step}`;
    }
    return "Quantum Matrix Protocol";
  };

  return (
    <div 
      className="p-4 rounded-lg mb-4 font-mono" 
      style={{ 
        minHeight: '150px', 
        fontFamily: "'JetBrains Mono', monospace",
        backgroundColor: colorPalette.dark,
        color: colorPalette.text
      }}
    >
      <div className="flex justify-between items-center mb-2">
        <span style={{ color: colorPalette.lightHC }}>
          {tutorialStep ? `Tutorial Step ${tutorialStep.step}` : `Matrix ${level + 1}`}
        </span>
        <span style={{ color: colorPalette.light }}>Disruptions: {moveCount}</span>
      </div>
      <h3 className="text-lg font-bold mb-2" style={{ color: colorPalette.lightHC }}>{getTitle()}</h3>
      <p>{getOperatorMessage()}</p>
      <div className="mt-4 flex items-center">
        <span className="mr-2" style={{ color: colorPalette.light }}>[{'-'.repeat(20)}]</span>
        <span className="ml-2" style={{ color: colorPalette.light }}>
          Status: {tutorialStep ? 'Tutorial in Progress' : (gameWon ? 'Aligned' : 'In Progress')}
        </span>
      </div>
    </div>
  );
};

export default TerminalDisplay;
