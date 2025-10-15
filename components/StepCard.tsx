'use client';

import { Step } from '@/lib/types';
import { getDifficultyEmoji } from '@/lib/utils';

interface StepCardProps {
  step: Step;
  isLocked: boolean;
  isRecommended: boolean;
  onQuestionClick: () => void;
  onComplete: () => void;
  onUncomplete: () => void;
  onToggleExpand: () => void;
}

export function StepCard({
  step,
  isLocked,
  isRecommended,
  onQuestionClick,
  onComplete,
  onUncomplete,
  onToggleExpand
}: StepCardProps) {
  return (
    <div
      className={`
        border rounded-lg p-6 transition-all
        ${step.isCompleted ? 'bg-green-900/20 border-green-600' : 'bg-[#2a2a2a] border-[#3a3a3a]'}
        ${isLocked ? 'opacity-50' : ''}
        ${isRecommended ? 'ring-2 ring-[#DFF250]' : ''}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-gray-100">
              {step.id}단계: {step.title}
            </h3>
            {step.isCompleted && <span className="text-green-500">✓</span>}
            {isLocked && <span className="text-gray-400">🔒</span>}
            {isRecommended && !step.isCompleted && <span className="text-[#DFF250]">⭐</span>}
          </div>
          <p className="text-sm text-gray-400 mt-1">{step.description}</p>
        </div>
      </div>

      {/* Metadata */}
      <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
        <span>{getDifficultyEmoji(step.difficulty)} {step.difficulty}</span>
        <span>⏰ {step.estimatedHours}시간</span>
        {step.isOptional && <span className="text-[#DFF250]">선택</span>}
      </div>

      {/* Expandable explanation */}
      <div className="mb-4">
        <button
          onClick={onToggleExpand}
          className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-gray-100"
        >
          <span>📖 설명</span>
          <span>{step.isExpanded ? '▲' : '▼'}</span>
        </button>
        {step.isExpanded && (
          <div className="mt-3 p-4 bg-[#1a1a1a] rounded-lg border border-[#3a3a3a]">
            <p className="text-sm text-gray-300 whitespace-pre-line">
              {step.aiExplanation}
            </p>
            <div className="mt-3 pt-3 border-t border-[#3a3a3a]">
              <p className="text-sm text-gray-400">
                <span className="font-semibold">왜 필요한가요?</span> {step.why}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Conversation summary */}
      {step.conversations.length > 0 && (
        <div className="mb-4 p-3 bg-[#DFF250]/10 rounded-lg border border-[#DFF250]/30">
          <p className="text-sm font-medium text-[#DFF250]">
            💬 질문 {step.conversations.length}개
          </p>
          <p className="text-xs text-[#DFF250]/80 mt-1">
            최근: {step.conversations[step.conversations.length - 1].answerSummary.slice(0, 50)}...
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onQuestionClick}
          disabled={isLocked}
          className="flex-1 px-4 py-2 text-sm font-medium text-[#1a1a1a] bg-[#DFF250] rounded-lg hover:bg-[#DFF250]/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          💬 질문하기
        </button>
        {!step.isCompleted ? (
          <button
            onClick={onComplete}
            disabled={isLocked}
            className="flex-1 px-4 py-2 text-sm font-medium text-green-100 bg-green-700 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ☑️ 이해했어요
          </button>
        ) : (
          <button
            onClick={onUncomplete}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-400 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg hover:bg-[#1a1a1a]/80"
          >
            ↩️ 되돌리기
          </button>
        )}
      </div>
    </div>
  );
}
