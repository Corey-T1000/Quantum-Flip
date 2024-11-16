import { StoryProgress, DialogueNode, StoryPath, StoryChoice } from '../types';
import { storyBranches, revelations, mysteryHints, gameplayMessages } from './storyContent';
import { PerformanceMonitor } from './performance';

class AINarrator {
  private lastMessageId: string | null = null;
  private messageHistory: Set<string> = new Set();
  private readonly maxHistorySize = 50;
  private sequenceMessageCount = 0;

  constructor() {
    this.resetHistory();
  }

  private resetHistory() {
    this.messageHistory.clear();
    this.lastMessageId = null;
    this.sequenceMessageCount = 0;
  }

  private addToHistory(messageId: string) {
    if (this.messageHistory.size >= this.maxHistorySize) {
      const oldestMessage = Array.from(this.messageHistory)[0];
      this.messageHistory.delete(oldestMessage);
    }
    this.messageHistory.add(messageId);
    this.lastMessageId = messageId;
    this.sequenceMessageCount++;
  }

  private meetsRequirements(
    node: DialogueNode,
    progress: StoryProgress
  ): boolean {
    if (!node.requirements) return true;

    const {
      minTrust,
      previousChoice,
      pathProgress,
      completedLevels,
      revelations: requiredRevelations
    } = node.requirements;

    if (minTrust && (!progress.relationship || progress.relationship.trust < minTrust)) {
      return false;
    }

    if (previousChoice && progress.lastChoice !== previousChoice) {
      return false;
    }

    if (pathProgress && progress.pathChosen !== pathProgress) {
      return false;
    }

    if (completedLevels && progress.completedLevels.length < completedLevels) {
      return false;
    }

    if (requiredRevelations) {
      return requiredRevelations.every(rev => 
        progress.revelationsUnlocked?.includes(rev)
      );
    }

    return true;
  }

  private applyEffects(
    node: DialogueNode,
    progress: StoryProgress
  ): StoryProgress {
    if (!node.effects) return progress;

    const updatedProgress = { ...progress };
    const relationship = { ...progress.relationship };

    if (node.effects.trustDelta) {
      relationship.trust += node.effects.trustDelta;
    }

    if (node.effects.understanding) {
      relationship.understanding += node.effects.understanding;
    }

    if (node.effects.synergy) {
      relationship.synergy += node.effects.synergy;
    }

    if (node.effects.pathProgress) {
      updatedProgress.pathChosen = node.effects.pathProgress as StoryPath;
    }

    if (node.effects.addRevelation) {
      updatedProgress.revelationsUnlocked = [
        ...(progress.revelationsUnlocked || []),
        node.effects.addRevelation
      ];
    }

    updatedProgress.relationship = relationship;
    return updatedProgress;
  }

  private getAvailableNodes(
    progress: StoryProgress
  ): DialogueNode[] {
    const path = progress.pathChosen;
    let availableNodes: DialogueNode[] = [];

    // Add story branch nodes
    if (path) {
      availableNodes = storyBranches[path].filter(node =>
        this.meetsRequirements(node, progress) &&
        !this.messageHistory.has(node.id)
      );
    }

    // Add revelations if requirements are met
    Object.values(revelations).forEach(revelation => {
      if (
        this.meetsRequirements(revelation, progress) &&
        !this.messageHistory.has(revelation.id)
      ) {
        availableNodes.push(revelation);
      }
    });

    // Add mystery hints based on path
    if (path && progress.completedLevels.length > 5) {
      mysteryHints[path].forEach(hint => {
        if (
          this.meetsRequirements(hint, progress) &&
          !this.messageHistory.has(hint.id)
        ) {
          availableNodes.push(hint);
        }
      });
    }

    return availableNodes;
  }

  private getNodeWeight(node: DialogueNode, progress: StoryProgress): number {
    let weight = 1;

    // Increase weight for nodes that continue the current path
    if (progress.pathChosen && node.id.startsWith(progress.pathChosen)) {
      weight += 2;
    }

    // Increase weight for revelations after certain progress
    if (progress.completedLevels.length > 5 && node.id.startsWith('rev_')) {
      weight += 3;
    }

    // Increase weight for mystery hints when player has relevant revelations
    if (node.id.startsWith('mys_') && progress.revelationsUnlocked?.length) {
      weight += progress.revelationsUnlocked.length;
    }

    // Reduce weight for recently seen similar content
    const pathPrefix = node.id.split('_')[0];
    const recentSimilar = Array.from(this.messageHistory)
      .filter(id => id.startsWith(pathPrefix))
      .length;
    weight -= recentSimilar * 0.5;

    return Math.max(weight, 0.1);
  }

  private getGameplayMessage(
    disruptions: number,
    isNewSequence: boolean,
    isT9Mode: boolean,
    gameWon: boolean
  ): DialogueNode | null {
    // Reset sequence message count on new sequence
    if (isNewSequence) {
      this.sequenceMessageCount = 0;
    }

    // Only show gameplay messages occasionally
    if (this.sequenceMessageCount % 3 !== 0 && !isNewSequence) {
      return null;
    }

    let category: string;
    if (isT9Mode) {
      category = gameWon ? 't9_success' : 't9_mode';
    } else if (isNewSequence) {
      category = 'sequence_start';
    } else if (disruptions <= 3) {
      category = 'low_disruptions';
    } else if (disruptions >= 10) {
      category = 'high_disruptions';
    } else {
      category = 'progression';
    }

    const messages = gameplayMessages[category].filter(
      msg => !this.messageHistory.has(msg.id)
    );

    if (messages.length === 0) {
      return null;
    }

    // Add some randomization to message selection
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
  }

  public getNextMessage(
    progress: StoryProgress,
    state: 'start' | 'win' | 'choice',
    choice?: StoryChoice,
    gameState?: {
      disruptions: number;
      isNewSequence: boolean;
      isT9Mode?: boolean;
      gameWon?: boolean;
    }
  ): { text: string; type: string; choices?: string[]; progress: StoryProgress } {
    return PerformanceMonitor.measureSync('ai.getMessage', () => {
      if (choice) {
        progress.lastChoice = choice;
      }

      // Try to get a gameplay-specific message first
      if (gameState) {
        const gameplayMessage = this.getGameplayMessage(
          gameState.disruptions,
          gameState.isNewSequence,
          gameState.isT9Mode || false,
          gameState.gameWon || false
        );
        
        if (gameplayMessage) {
          this.addToHistory(gameplayMessage.id);
          return {
            text: gameplayMessage.text,
            type: gameplayMessage.type || 'gameplay',
            progress
          };
        }
      }

      const availableNodes = this.getAvailableNodes(progress);
      
      if (availableNodes.length === 0) {
        return {
          text: "The quantum field fluctuates steadily...",
          type: 'system',
          progress
        };
      }

      // Weight and select nodes based on current context
      const weightedNodes = availableNodes.map(node => ({
        node,
        weight: this.getNodeWeight(node, progress)
      }));

      // Sort by weight and add some randomization for variety
      const randomFactor = 0.2;
      weightedNodes.sort((a, b) => 
        (b.weight + Math.random() * randomFactor) - 
        (a.weight + Math.random() * randomFactor)
      );

      const selectedNode = weightedNodes[0].node;
      this.addToHistory(selectedNode.id);
      const updatedProgress = this.applyEffects(selectedNode, progress);
      
      return {
        text: selectedNode.text,
        type: selectedNode.type || 'story',
        choices: selectedNode.choices,
        progress: updatedProgress
      };
    });
  }
}

export const aiNarrator = new AINarrator();
