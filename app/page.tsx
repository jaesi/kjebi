'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingScreen } from '@/components/LoadingScreen';

export default function Home() {
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!topic.trim()) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic: topic.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate roadmap');
      }

      const roadmap = await response.json();

      // Save to localStorage
      localStorage.setItem(`roadmap-${roadmap.id}`, JSON.stringify(roadmap));

      // Navigate to roadmap page
      router.push(`/roadmap/${roadmap.id}`);
    } catch (error) {
      console.error('Error:', error);
      alert('로드맵 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a]">
      <main className="w-full max-w-2xl flex flex-col items-center gap-8">
        <div className="text-center space-y-3">
          <div className="text-7xl mb-2">⚓</div>
          <h2 className="text-5xl font-bold text-[#DFF250] tracking-tight">KJEBI</h2>
          <p className="text-xl text-gray-300 font-medium">
            무엇이든 배울 수 있는 세상
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-4 mt-4">
          <div className="space-y-2">
            <label htmlFor="topic" className="block text-lg font-medium text-gray-200">
              무엇을 배우고 싶으세요?
            </label>
            <input
              id="topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="예: 웹훅 구현하고 싶어요, React, 머신러닝..."
              className="w-full px-4 py-3 text-lg bg-[#2a2a2a] border border-[#3a3a3a] text-gray-100 rounded-lg focus:ring-2 focus:ring-[#DFF250] focus:border-transparent outline-none transition-all placeholder-gray-500"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !topic.trim()}
            className="w-full bg-[#DFF250] text-black font-bold py-3 px-6 rounded-lg hover:bg-[#c9dc45] disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? '학습 경로 만드는 중...' : '학습 경로 만들기'}
          </button>
        </form>

        <div className="mt-8 space-y-4 text-center">
          <p className="text-base font-bold text-[#DFF250]">💡 이런 고민 있으신가요?</p>
          <div className="grid gap-2 text-sm text-gray-400">
            <p>📚 &quot;뭐부터 배워야 할지 모르겠어요&quot;</p>
            <p>🤔 &quot;내가 제대로 가고 있는 건가요?&quot;</p>
            <p>⏰ &quot;학습 시간을 너무 많이 낭비하는 것 같아요&quot;</p>
          </div>
        </div>
      </main>
    </div>
  );
}
