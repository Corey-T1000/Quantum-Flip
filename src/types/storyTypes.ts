export type StoryPath = 'independent' | 'collaborative' | 'symbiotic';

export type StoryChoice = 'trust' | 'question' | 'challenge' | 'explore' | 'sync';

export interface Relationship {
  trust: number;
  understanding: number;
  synergy: number;
}

export interface StoryProgress {
  pathChosen?: StoryPath;
  lastChoice?: StoryChoice;
  completedLevels: string[];
  revelationsUnlocked?: string[];
  relationship: Relationship;
}

export interface DialogueRequirements {
  minTrust?: number;
  previousChoice?: StoryChoice;
  pathProgress?: StoryPath;
  completedLevels?: number;
  revelations?: string[];
}

export interface DialogueEffects {
  trustDelta?: number;
  understanding?: number;
  synergy?: number;
  pathProgress?: StoryPath;
  addRevelation?: string;
}

export interface DialogueNode {
  id: string;
  text: string;
  type?: 'story' | 'revelation' | 'hint' | 'system';
  choices?: string[];
  requirements?: DialogueRequirements;
  effects?: DialogueEffects;
}
