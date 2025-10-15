export interface Step {
  id: number;
  title: string;
  description: string;
  aiExplanation: string;
  why: string;
  estimatedHours: number;
  difficulty: 'easy' | 'medium' | 'hard';
  isOptional: boolean;
  prerequisites: number[];
  isCompleted: boolean;
  isExpanded: boolean;
  conversations: Conversation[];
}

export interface Conversation {
  id: string;
  question: string;
  answer: string;
  answerSummary: string;
  timestamp: string;
}

export interface Roadmap {
  id: string;
  topic: string;
  recommendedStart: number;
  currentStep: number;
  totalSteps: number;
  estimatedTotalHours: number;
  steps: Step[];
  progress: number;
  createdAt: string;
}
