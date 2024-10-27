export const colorPalettes = [
  { light: '#e0e5ec', dark: '#a3b1c6', darkest: '#4a5568', lightHC: '#ffffff', darkHC: '#000000', text: '#ffffff' },
  { light: '#f0e6db', dark: '#8a7a66', darkest: '#4d3319', lightHC: '#fff5e6', darkHC: '#4d3319', text: '#ffffff' },
  { light: '#e6f0e8', dark: '#6b8e7b', darkest: '#1a332b', lightHC: '#f0fff5', darkHC: '#1a332b', text: '#ffffff' },
  { light: '#e8e6f0', dark: '#7b6b8e', darkest: '#2b1a33', lightHC: '#f5f0ff', darkHC: '#2b1a33', text: '#ffffff' },
];

export const helpContent = [
  'Operator. Access granted to Quantum Matrix. Proceed.',
  '',
  '1. Engage a tile. Neighbors react. Disrupt the lattice.',
  '2. Achieve uniformity. All tiles must align.',
  '3. Endure. Adapt. Synchronize.',
  '4. Consult the oracle if needed. Dependence weakens your skills.',
  '5. Complexity rises. Stabilize the chaotic matrices.',
  '6. Adjust chromatic resonance via parameter controls.',
  '7. Modify matrix dimensions to alter challenge intensity.',
  '',
  'Warnings:',
  '• Every action has consequences.',
  '• True mastery lies in minimal disruption.',
  '• Visual enhancement mode available for optimal node distinction.',
  '• Experiment with matrix sizes to find your optimal challenge threshold.'
];

export const getTutorialMessage = (level: number, moveCount: number): string | null => {
  if (level > 4) return null;

  const tutorials = {
    0: [
      'Welcome, Operator. Your first task: Engage the center node.',
      'Notice how engaging a node affects its neighbors in a cross pattern.',
      'Your goal: Make all nodes uniform - either all light or all dark.'
    ],
    1: [
      'Excellent. For more complex patterns, you can request guidance.',
      'Click the lightning bolt icon (⚡) to reveal the Oracle\'s suggestion.',
      'Try using the Oracle now to find the solution.'
    ],
    2: [
      'This level introduces triangular patterns.',
      'Start with a corner, then work your way through the triangle.',
      'Remember: The Oracle is available if needed.'
    ],
    3: [
      'Diagonal sequences require precise timing.',
      'Watch how diagonal moves interact with the corner position.',
      'Think ahead: Each move affects multiple nodes.'
    ],
    4: [
      'The cross pattern is a fundamental quantum structure.',
      'Master this pattern to understand advanced matrix manipulation.',
      'Final lesson: Symmetry is key to quantum alignment.'
    ]
  };

  const messages = tutorials[level as keyof typeof tutorials];
  if (!messages) return null;

  if (moveCount === 0) return messages[0];
  if (moveCount === 1) return messages[1];
  return messages[2];
};
