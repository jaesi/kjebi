'use client';

import { Conversation } from '@/lib/types';
import { useState, useEffect, useRef } from 'react';

interface QuestionPanelProps {
  isOpen: boolean;
  stepTitle: string;
  conversations: Conversation[];
  onClose: () => void;
  onAskQuestion: (q: string) => Promise<void>;
  streamingAnswer?: string;
  isStreaming?: boolean;
}

export function QuestionPanel({
  isOpen,
  stepTitle,
  conversations,
  onClose,
  onAskQuestion,
  streamingAnswer = '',
  isStreaming = false
}: QuestionPanelProps) {
  const [question, setQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversations, streamingAnswer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isAsking) return;

    setIsAsking(true);
    try {
      await onAskQuestion(question);
      setQuestion('');
    } finally {
      setIsAsking(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Panel - Mobile: overlay, Desktop: split view */}
      <div
        className={`
          fixed lg:relative
          right-0 top-0 h-full
          w-full lg:w-1/2
          bg-[#2a2a2a] shadow-xl lg:shadow-none
          z-50 lg:z-0
          transform lg:transform-none
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
          flex flex-col
          border-l border-[#3a3a3a]
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#3a3a3a] bg-[#1a1a1a]">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-100">{stepTitle}</h3>
            <p className="text-sm text-gray-400">질문하기</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 p-2 hover:bg-[#3a3a3a] rounded-lg transition-colors"
            title="닫기"
          >
            ✕
          </button>
        </div>

        {/* Question form */}
        <div className="p-4 border-b border-[#3a3a3a]">
          <form onSubmit={handleSubmit} className="space-y-2">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="궁금한 것을 질문해보세요..."
              className="w-full px-3 py-2 bg-[#1a1a1a] text-gray-100 border border-[#3a3a3a] rounded-lg resize-none focus:ring-2 focus:ring-[#DFF250] focus:border-transparent outline-none placeholder-gray-500"
              rows={3}
              disabled={isAsking}
            />
            <button
              type="submit"
              disabled={isAsking || !question.trim()}
              className="w-full bg-[#DFF250] text-[#1a1a1a] font-medium py-2 px-4 rounded-lg hover:bg-[#DFF250]/90 disabled:bg-[#3a3a3a] disabled:text-gray-500 disabled:cursor-not-allowed"
            >
              {isAsking ? '답변 생성 중...' : '질문하기'}
            </button>
          </form>
        </div>

        {/* Conversations */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {conversations.length === 0 && !isStreaming ? (
            <div className="text-center text-gray-500 mt-8">
              <p>아직 질문이 없습니다</p>
              <p className="text-sm mt-2">궁금한 것을 질문해보세요!</p>
            </div>
          ) : (
            <>
              {conversations.map((conv) => (
                <div key={conv.id} className="space-y-2">
                  {/* Question */}
                  <div className="bg-[#DFF250]/10 border border-[#DFF250]/30 rounded-lg p-3">
                    <p className="text-sm font-medium text-[#DFF250]">
                      Q. {conv.question}
                    </p>
                    <p className="text-xs text-[#DFF250]/70 mt-1">
                      {new Date(conv.timestamp).toLocaleString('ko-KR')}
                    </p>
                  </div>

                  {/* Answer */}
                  <div className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg p-3">
                    <p className="text-sm text-gray-300 whitespace-pre-line">
                      {conv.answer}
                    </p>
                  </div>
                </div>
              ))}

              {/* Streaming answer */}
              {isStreaming && streamingAnswer && (
                <div className="space-y-2">
                  <div className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg p-3">
                    <p className="text-sm text-gray-300 whitespace-pre-line">
                      {streamingAnswer}
                      <span className="inline-block w-2 h-4 ml-1 bg-[#DFF250] animate-pulse" />
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
