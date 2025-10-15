import { useLocalStorage } from './useLocalStorage';
import { Roadmap, Conversation } from '@/lib/types';
import { calculateProgress } from '@/lib/utils';

export function useRoadmap(id: string | null) {
  const [roadmap, setRoadmap] = useLocalStorage<Roadmap | null>(
    id ? `roadmap-${id}` : 'roadmap-null',
    null
  );

  const completeStep = (stepId: number) => {
    if (!roadmap) return;

    const updatedSteps = roadmap.steps.map(step =>
      step.id === stepId
        ? { ...step, isCompleted: true }
        : step
    );

    const progress = calculateProgress(updatedSteps);

    setRoadmap({
      ...roadmap,
      steps: updatedSteps,
      progress,
      currentStep: stepId + 1
    });
  };

  const uncompleteStep = (stepId: number) => {
    if (!roadmap) return;

    const updatedSteps = roadmap.steps.map(step =>
      step.id === stepId
        ? { ...step, isCompleted: false }
        : step
    );

    const progress = calculateProgress(updatedSteps);

    setRoadmap({
      ...roadmap,
      steps: updatedSteps,
      progress
    });
  };

  const toggleStepExpanded = (stepId: number) => {
    if (!roadmap) return;

    const updatedSteps = roadmap.steps.map(step =>
      step.id === stepId
        ? { ...step, isExpanded: !step.isExpanded }
        : step
    );

    setRoadmap({
      ...roadmap,
      steps: updatedSteps
    });
  };

  const addConversation = (stepId: number, conversation: Conversation) => {
    if (!roadmap) return;

    const updatedSteps = roadmap.steps.map(step =>
      step.id === stepId
        ? {
            ...step,
            conversations: [...step.conversations, conversation]
          }
        : step
    );

    setRoadmap({
      ...roadmap,
      steps: updatedSteps
    });
  };

  return {
    roadmap,
    setRoadmap,
    completeStep,
    uncompleteStep,
    toggleStepExpanded,
    addConversation
  };
}
