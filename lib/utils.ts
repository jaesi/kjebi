import { Step } from './types';

export function calculateProgress(steps: Step[]): number {
  const completed = steps.filter(s => s.isCompleted).length;
  return Math.round((completed / steps.length) * 100);
}

export function isStepLocked(step: Step, allSteps: Step[]): boolean {
  return step.prerequisites.some(preId => {
    const preStep = allSteps.find(s => s.id === preId);
    return preStep && !preStep.isCompleted;
  });
}

export function getDifficultyEmoji(difficulty: string): string {
  switch (difficulty) {
    case 'easy': return '😊';
    case 'medium': return '😐';
    case 'hard': return '😰';
    default: return '😊';
  }
}
