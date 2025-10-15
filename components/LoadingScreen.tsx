'use client';

import { useEffect, useState } from 'react';

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);

  const steps = [
    { icon: '✓', text: '주제 분석 완료', duration: 1000 },
    { icon: '⟳', text: '선행 지식 파악 중', duration: 1500 },
    { icon: '⟳', text: '학습 경로 생성 중', duration: 2000 }
  ];

  useEffect(() => {
    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 10;
      });
    }, 200);

    // Step progression
    let currentStep = 0;
    const stepTimeout = setTimeout(() => {
      const stepInterval = setInterval(() => {
        currentStep++;
        setStep(currentStep);
        if (currentStep >= steps.length - 1) {
          clearInterval(stepInterval);
        }
      }, 1200);
    }, 500);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(stepTimeout);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a] flex items-center justify-center p-8">
      <div className="w-full max-w-md space-y-8">
        {/* Robot icon */}
        <div className="text-center">
          <div className="text-7xl mb-4 animate-bounce">🤖</div>
          <h2 className="text-2xl font-bold text-gray-100">AI가 분석 중입니다...</h2>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="w-full bg-[#2a2a2a] rounded-full h-3 overflow-hidden border border-[#3a3a3a]">
            <div
              className="bg-[#DFF250] h-3 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-center text-sm text-gray-400">
            {Math.round(progress)}%
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {steps.map((s, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 text-base transition-all duration-300 ${
                index < step
                  ? 'text-[#DFF250] font-medium'
                  : index === step
                  ? 'text-[#DFF250] font-medium'
                  : 'text-gray-600'
              }`}
            >
              <span className="text-xl">
                {index < step ? '✓' : index === step ? '⟳' : '○'}
              </span>
              <span>{s.text}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500">
          평균 30초 소요됩니다
        </p>
      </div>
    </div>
  );
}
