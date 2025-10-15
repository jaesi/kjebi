import { Step } from './types';

export function calculateProgress(steps: Step[]): number {
  const completed = steps.filter(s => s.isCompleted).length;
  return Math.round((completed / steps.length) * 100);
}

export function isStepLocked(step: Step, allSteps: Step[]): boolean {
  // Lock if any prerequisite step is not completed
  const hasUncompletedPrerequisites = step.prerequisites.some(preId => {
    const preStep = allSteps.find(s => s.id === preId);
    return preStep && !preStep.isCompleted;
  });

  // Also lock if the previous step (by ID) is not completed
  const previousStep = allSteps.find(s => s.id === step.id - 1);
  const isPreviousStepIncomplete = previousStep ? !previousStep.isCompleted && !previousStep.isOptional : false;

  return hasUncompletedPrerequisites || isPreviousStepIncomplete;
}

export function getDifficultyEmoji(difficulty: string): string {
  switch (difficulty) {
    case 'easy': return '😊';
    case 'medium': return '😐';
    case 'hard': return '😰';
    default: return '😊';
  }
}
