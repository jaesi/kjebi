'use client';

export const runtime = 'nodejs';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';

function LoginFormInner() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setError('비밀번호가 올바르지 않습니다.');
        setIsLoading(false);
      } else if (result?.ok) {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError('로그인 중 오류가 발생했습니다.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a] flex items-center justify-center p-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-3">
          <div className="text-7xl mb-2">⚓</div>
          <h2 className="text-5xl font-bold text-[#DFF250] tracking-tight">KJEBI</h2>
          <p className="text-xl text-gray-300 font-medium">
            무엇이든 배울 수 있는 세상
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-8">
          <div className="space-y-2">
            <label htmlFor="password" className="block text-lg font-medium text-gray-200">
              비밀번호를 입력하세요
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="관리자 비밀번호"
              className="w-full px-4 py-3 text-lg bg-[#2a2a2a] border border-[#3a3a3a] text-gray-100 rounded-lg focus:ring-2 focus:ring-[#DFF250] focus:border-transparent outline-none transition-all placeholder-gray-500"
              disabled={isLoading}
              autoFocus
            />
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !password.trim()}
            className="w-full bg-[#DFF250] text-black font-bold py-3 px-6 rounded-lg hover:bg-[#c9dc45] disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? '로그인 중...' : '입장하기'}
          </button>
        </form>

        <div className="text-center text-sm text-gray-500">
          <p>🔒 보안된 데모 환경입니다</p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">로딩 중...</div>}>
      <LoginFormInner />
    </Suspense>
  );
}
