export type LearningStatus = 'not-started' | 'in-progress' | 'completed';

export interface LearningTopic {
  id: string;
  title: string;
  description: string;
  status: LearningStatus;
  prerequisites: string[]; // IDs of prerequisite topics
  estimatedTime?: string; // e.g., "2 hours", "1 week"
  resources?: string[]; // URLs or resource names
}

export interface LearningPath {
  topics: LearningTopic[];
  currentTopicId?: string;
}
