import React, { useEffect } from 'react';

interface ScreenDisplayProps {
  levelName: string;
  moveCount: number;
  gameWon: boolean;
  colorPalette: {
    light: string;
    dark: string;
    darkest: string;
    lightHC: string;
    darkHC: string;
    text: string;
  };
  tutorialMessage: string | null;
  debugMode: boolean; // Added debugMode prop
}

const ScreenDisplay: React.FC<ScreenDisplayProps> = ({
  levelName,
  moveCount,
  gameWon,
  colorPalette,
  tutorialMessage,
  debugMode, // Added debugMode prop
}) => {
  useEffect(() => {
    console.log("ScreenDisplay re-rendered.", {
      levelName,
      moveCount,
      gameWon,
      tutorialMessage,
      debugMode, // Log debugMode
    });
  }, [levelName, moveCount, gameWon, tutorialMessage, debugMode]);

  const getOperatorMessage = () => {
    console.log("getOperatorMessage called.", { gameWon, tutorialMessage });
    if (tutorialMessage) {
      return tutorialMessage;
    } else if (gameWon) {
      return "Equilibrium achieved. Proceed to next matrix when ready.";
    } else if (moveCount === 0) {
      return "Operator. Access granted. Initiate matrix stabilization.";
    } else {
      return "Matrix destabilized. Continue realignment procedure.";
    }
  };

  const getTitle = () => {
    console.log("getTitle called.", { gameWon, tutorialMessage });
    if (tutorialMessage) {
      return "Quantum Matrix Tutorial";
    }
    return gameWon ? "Matrix Stabilized" : "Quantum Matrix Protocol";
  };

  const message = getOperatorMessage();
  const title = getTitle();

  console.log("ScreenDisplay rendering with:", { message, title, gameWon, tutorialMessage, debugMode });

  return (
    <div 
      className="p-4 rounded-lg mb-4 font-mono" 
      style={{ 
        minHeight: '150px', 
        fontFamily: "'JetBrains Mono', monospace",
        backgroundColor: colorPalette.darkest,
        color: colorPalette.lightHC
      }}
    >
      <div className="flex justify-between items-center mb-2">
        <span style={{ color: colorPalette.lightHC }}>
          {tutorialMessage ? "Tutorial" : levelName}
        </span>
        <span style={{ color: colorPalette.lightHC }}>Disruptions: {moveCount}</span>
      </div>
      <h3 className="text-lg font-bold mb-2" style={{ color: colorPalette.lightHC }}>{title}</h3>
      <p style={{ color: colorPalette.lightHC }}>{message}</p>
      <div className="mt-4 flex items-center">
        <span className="mr-2" style={{ color: colorPalette.lightHC }}>[{'-'.repeat(20)}]</span>
        <span className="ml-2" style={{ color: colorPalette.lightHC }}>
          Status: {tutorialMessage ? 'Tutorial in Progress' : (gameWon ? 'Aligned' : 'In Progress')}
        </span>
      </div>
      <div style={{ color: colorPalette.lightHC }}>Debug: gameWon = {gameWon.toString()}, isTutorial = {(!!tutorialMessage).toString()}</div>
      {debugMode && (
        <div style={{ color: colorPalette.lightHC }}>
          <p>Debug Mode: Active</p>
          <p>Additional debug information can be displayed here.</p>
        </div>
      )}
    </div>
  );
};

export default React.memo(ScreenDisplay);
