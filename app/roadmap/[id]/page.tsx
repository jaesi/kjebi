'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useRoadmap } from '@/hooks/useRoadmap';
import { StepCard } from '@/components/StepCard';
import { QuestionPanel } from '@/components/QuestionPanel';
import { isStepLocked } from '@/lib/utils';
import { useState, useEffect } from 'react';

export default function RoadmapPage() {
  const params = useParams();
  const id = params.id as string;
  const { roadmap, completeStep, uncompleteStep, toggleStepExpanded, addConversation } = useRoadmap(id);
  const [activeStepId, setActiveStepId] = useState<number | null>(null);
  const [streamingAnswer, setStreamingAnswer] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  // Removed unused currentQuestion state

  useEffect(() => {
    // If roadmap is not in localStorage, redirect to home
    if (!roadmap && typeof window !== 'undefined') {
      const stored = localStorage.getItem(`roadmap-${id}`);
      if (!stored) {
        window.location.href = '/';
      }
    }
  }, [id, roadmap]);

  const handleAskQuestion = async (stepId: number, question: string) => {
    if (!roadmap) return;

    const step = roadmap.steps.find(s => s.id === stepId);
    if (!step) return;

    setIsStreaming(true);
    setStreamingAnswer('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roadmapId: roadmap.id,
          stepId,
          stepTitle: step.title,
          question,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get answer');
      }

      const conversation = await response.json();

      // Simulate streaming effect
      const fullAnswer = conversation.answer;
      let currentIndex = 0;

      const streamInterval = setInterval(() => {
        if (currentIndex < fullAnswer.length) {
          const chunkSize = Math.floor(Math.random() * 5) + 2; // 2-6 characters at a time
          setStreamingAnswer(fullAnswer.slice(0, currentIndex + chunkSize));
          currentIndex += chunkSize;
        } else {
          clearInterval(streamInterval);
          setIsStreaming(false);
          addConversation(stepId, conversation);
          setStreamingAnswer('');
        }
      }, 30); // 30ms between chunks

    } catch (error) {
      console.error('Error:', error);
      alert('답변을 가져오는 중 오류가 발생했습니다.');
      setIsStreaming(false);
      setStreamingAnswer('');
    }
  };

  if (!roadmap) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a]">
        <p className="text-gray-400">로딩 중...</p>
      </div>
    );
  }

  const activeStep = roadmap.steps.find(s => s.id === activeStepId);

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col">
      {/* Header */}
      <header className="bg-[#2a2a2a] border-b border-[#3a3a3a] sticky top-0 z-30">
        <div className="max-w-full mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-100">
                📚 {roadmap.topic} 학습 로드맵
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                {roadmap.totalSteps}단계 · {roadmap.estimatedTotalHours}시간 · 진행률 {roadmap.progress}%
              </p>
            </div>
            <Link
              href="/"
              className="text-sm text-[#DFF250] hover:text-[#DFF250]/80"
            >
              ← 홈으로
            </Link>
          </div>

          {/* Progress bar */}
          <div className="mt-3">
            <div className="w-full bg-[#3a3a3a] rounded-full h-2">
              <div
                className="bg-[#DFF250] h-2 rounded-full transition-all"
                style={{ width: `${roadmap.progress}%` }}
              />
            </div>
          </div>

          {/* Recommended start */}
          {roadmap.recommendedStart && roadmap.progress === 0 && (
            <div className="mt-3 p-3 bg-[#DFF250]/10 rounded-lg border border-[#DFF250]/30">
              <p className="text-sm text-[#DFF250]">
                💡 추천: {roadmap.recommendedStart}단계부터 시작하세요
              </p>
            </div>
          )}
        </div>
      </header>

      {/* Main content - Split view on desktop */}
      <div className="flex-1 flex overflow-hidden">
        {/* Roadmap section */}
        <main
          className={`
            flex-1 overflow-y-auto px-4 py-8
            ${activeStepId !== null ? 'lg:w-1/2' : 'lg:max-w-7xl lg:mx-auto'}
            transition-all duration-300
          `}
        >
          <div className="space-y-4 max-w-4xl mx-auto">
            {roadmap.steps.map((step) => {
              const locked = isStepLocked(step, roadmap.steps);
              const recommended = step.id === roadmap.recommendedStart && !step.isCompleted;

              return (
                <StepCard
                  key={step.id}
                  step={step}
                  isLocked={locked}
                  isRecommended={recommended}
                  onQuestionClick={() => setActiveStepId(step.id)}
                  onComplete={() => completeStep(step.id)}
                  onUncomplete={() => uncompleteStep(step.id)}
                  onToggleExpand={() => toggleStepExpanded(step.id)}
                />
              );
            })}
          </div>
        </main>

        {/* Question Panel - Split view on desktop, overlay on mobile */}
        <QuestionPanel
          isOpen={activeStepId !== null}
          stepTitle={activeStep?.title || ''}
          conversations={activeStep?.conversations || []}
          onClose={() => setActiveStepId(null)}
          onAskQuestion={(q) => handleAskQuestion(activeStepId!, q)}
          streamingAnswer={streamingAnswer}
          isStreaming={isStreaming}
        />
      </div>
    </div>
  );
}
