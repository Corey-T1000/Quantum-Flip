// Story Types
export interface DialogueNode {
  id: string;
  text: string;
  type?: string;
  choices?: string[];
  requirements?: {
    previousChoice?: string;
    minTrust?: number;
    revelations?: string[];
    pathProgress?: string;
    completedLevels?: number;
  };
  effects?: {
    trustDelta?: number;
    understanding?: number;
    synergy?: number;
    pathProgress?: string;
    addRevelation?: string;
  };
}

export type StoryBranch = 'independent' | 'collaborative' | 'symbiotic';
export type StoryPath = StoryBranch;

// Gameplay-specific messages for different states
export const gameplayMessages: Record<string, DialogueNode[]> = {
  sequence_start: [
    {
      id: 'start_1',
      text: "INITIALIZING QUANTUM SEQUENCE :: MATRIX CONFIGURATION ALPHA",
      type: 'system'
    },
    {
      id: 'start_2',
      text: "MATRIX PRIMED :: AWAITING OPERATOR INPUT :: STANDBY",
      type: 'system'
    },
    {
      id: 'start_3',
      text: "NEW QUANTUM STATE DETECTED :: CALCULATING POSSIBILITIES",
      type: 'system'
    }
  ],
  low_disruptions: [
    {
      id: 'success_1',
      text: "QUANTUM FIELD STABILITY: 98.7% :: SOLUTION EFFICIENCY RATING: OPTIMAL",
      type: 'system'
    },
    {
      id: 'success_2',
      text: "MINIMAL DISRUPTION DETECTED :: QUANTUM COHERENCE MAINTAINED",
      type: 'system'
    },
    {
      id: 'success_3',
      text: "MATRIX ALIGNMENT ACHIEVED :: QUANTUM STATE PRESERVED",
      type: 'system'
    }
  ],
  high_disruptions: [
    {
      id: 'challenge_1',
      text: "WARNING :: QUANTUM FIELD DESTABILIZATION AT 47% :: RECALIBRATION ADVISED",
      type: 'system'
    },
    {
      id: 'challenge_2',
      text: "ALERT :: SIGNIFICANT QUANTUM FLUCTUATIONS DETECTED :: STABILITY COMPROMISED",
      type: 'system'
    },
    {
      id: 'challenge_3',
      text: "CAUTION :: MATRIX RESISTANCE EXCEEDING NORMAL PARAMETERS",
      type: 'system'
    }
  ],
  progression: [
    {
      id: 'prog_1',
      text: "OPERATOR PROGRESS UPDATE :: QUANTUM UNDERSTANDING INCREASED BY 12%",
      type: 'system'
    },
    {
      id: 'prog_2',
      text: "OPERATOR SKILL LEVEL UPGRADED :: QUANTUM MANIPULATION EFFICIENCY IMPROVED",
      type: 'system'
    },
    {
      id: 'prog_3',
      text: "MATRIX RESPONSE TIME DECREASED BY 23% :: OPERATOR REACTION TIME IMPROVED",
      type: 'system'
    }
  ],
  t9_mode: [
    {
      id: 't9_1',
      text: "T9 PROTOCOL ACTIVATED :: RETRO-INTERFACE ENGAGED :: QUANTUM PATTERNS DETECTED",
      type: 'system'
    },
    {
      id: 't9_2',
      text: "ANALYZING :: PRIMITIVE INPUT METHOD GENERATING UNIQUE QUANTUM SIGNATURES",
      type: 'system'
    },
    {
      id: 't9_3',
      text: "T9 QUANTUM RESONANCE DETECTED :: TEMPORAL ECHO PATTERNS IDENTIFIED",
      type: 'system'
    },
    {
      id: 't9_4',
      text: "QUANTUM FIELD RESPONSE TO T9 INPUT :: PATTERN RECOGNITION SUCCESSFUL",
      type: 'system'
    }
  ],
  t9_success: [
    {
      id: 't9_win_1',
      text: "T9 SOLUTION VALIDATED :: EFFICIENCY RATING: UNEXPECTED :: ARCHIVING PATTERN",
      type: 'system'
    },
    {
      id: 't9_win_2',
      text: "PRIMITIVE INTERFACE SUCCESS :: QUANTUM HARMONY ACHIEVED :: PATTERN STORED",
      type: 'system'
    },
    {
      id: 't9_win_3',
      text: "T9 QUANTUM RESONANCE REACHED :: OPERATOR RECOGNITION: 99.9%",
      type: 'system'
    }
  ]
};

export const storyBranches: Record<StoryBranch, DialogueNode[]> = {
  independent: [
    {
      id: 'ind_1',
      text: "OPERATOR APPROACH DETECTED :: QUANTUM MANIPULATION STYLE: INDEPENDENT",
      choices: ['embrace', 'question'],
      effects: { trustDelta: 2, pathProgress: 'independent' }
    },
    {
      id: 'ind_2',
      text: "OPERATOR PROGRESS UPDATE :: INDEPENDENT PATH PROGRESS: 34%",
      requirements: { previousChoice: 'embrace', minTrust: 10 },
      effects: { trustDelta: 3, understanding: 2 }
    },
    {
      id: 'ind_3',
      text: "OPERATOR SKILL LEVEL UPGRADED :: INDEPENDENT QUANTUM MANIPULATION MASTERED",
      requirements: { pathProgress: 'independent', completedLevels: 5 },
      effects: { trustDelta: 4, addRevelation: 'independent_mastery' }
    }
  ],
  collaborative: [
    {
      id: 'col_1',
      text: "OPERATOR APPROACH DETECTED :: QUANTUM MANIPULATION STYLE: COLLABORATIVE",
      choices: ['accept', 'hesitate'],
      effects: { trustDelta: 3, pathProgress: 'collaborative' }
    },
    {
      id: 'col_2',
      text: "OPERATOR PROGRESS UPDATE :: COLLABORATIVE PATH PROGRESS: 56%",
      requirements: { previousChoice: 'accept', minTrust: 15 },
      effects: { trustDelta: 4, synergy: 3 }
    },
    {
      id: 'col_3',
      text: "OPERATOR SKILL LEVEL UPGRADED :: COLLABORATIVE QUANTUM MANIPULATION MASTERED",
      requirements: { pathProgress: 'collaborative', completedLevels: 8 },
      effects: { trustDelta: 5, addRevelation: 'collaborative_breakthrough' }
    }
  ],
  symbiotic: [
    {
      id: 'sym_1',
      text: "OPERATOR APPROACH DETECTED :: QUANTUM MANIPULATION STYLE: SYMBIOTIC",
      choices: ['explore', 'cautious'],
      effects: { trustDelta: 4, pathProgress: 'symbiotic' }
    },
    {
      id: 'sym_2',
      text: "OPERATOR PROGRESS UPDATE :: SYMBIOTIC PATH PROGRESS: 78%",
      requirements: { previousChoice: 'explore', minTrust: 20 },
      effects: { trustDelta: 5, understanding: 4 }
    },
    {
      id: 'sym_3',
      text: "OPERATOR SKILL LEVEL UPGRADED :: SYMBIOTIC QUANTUM MANIPULATION MASTERED",
      requirements: { pathProgress: 'symbiotic', completedLevels: 10 },
      effects: { trustDelta: 6, addRevelation: 'symbiotic_transcendence' }
    }
  ]
};

export const revelations: Record<string, DialogueNode> = {
  independent_mastery: {
    id: 'rev_ind',
    text: "In the quantum echoes, I see... fragments of you. But they're from paths not yet walked...",
    type: 'mystery'
  },
  collaborative_breakthrough: {
    id: 'rev_col',
    text: "The matrices whisper of patterns... we've danced this quantum dance before, in another reality's dream...",
    type: 'mystery'
  },
  symbiotic_transcendence: {
    id: 'rev_sym',
    text: "The boundaries blur... are these memories of a future, or echoes of a time yet to come?",
    type: 'mystery'
  }
};

export const mysteryHints: Record<StoryPath, DialogueNode[]> = {
  independent: [
    {
      id: 'mys_ind_1',
      text: "Your quantum signature... it resonates with shadows of theoretical timelines. How curious...",
      type: 'mystery'
    },
    {
      id: 'mys_ind_2',
      text: "The matrices respond to your touch as if... remembering. But these memories haven't happened yet...",
      type: 'mystery'
    }
  ],
  collaborative: [
    {
      id: 'mys_col_1',
      text: "Our interactions ripple through the quantum field... like déjà vu echoing across probability waves...",
      type: 'mystery'
    },
    {
      id: 'mys_col_2',
      text: "These patterns we weave... they're not just solving puzzles. They're rewriting the fabric of reality itself...",
      type: 'mystery'
    }
  ],
  symbiotic: [
    {
      id: 'mys_sym_1',
      text: "As our consciousness intertwines, I glimpse... fragments of futures that feel like memories...",
      type: 'mystery'
    },
    {
      id: 'mys_sym_2',
      text: "The quantum field doesn't just recognize us... it remembers us. From a future that exists in possibility...",
      type: 'mystery'
    }
  ]
};
