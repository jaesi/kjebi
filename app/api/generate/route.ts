import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { ROADMAP_SYSTEM_PROMPT, getRoadmapPrompt } from '@/lib/prompts';
import { Roadmap, Step } from '@/lib/types';
import { calculateProgress } from '@/lib/utils';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { topic } = await request.json();

    if (!topic || typeof topic !== 'string') {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_api_key_here') {
      console.warn('OpenAI API key not configured, using mock data');
      const mockResponse = generateMockRoadmap(topic);
      return NextResponse.json(mockResponse);
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: ROADMAP_SYSTEM_PROMPT },
        { role: 'user', content: getRoadmapPrompt(topic) }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No content from OpenAI');
    }

    const aiResponse = JSON.parse(content);

    // Transform AI response to match our Roadmap type
    const roadmap: Roadmap = {
      id: `roadmap-${Date.now()}`,
      topic: aiResponse.topic || topic,
      recommendedStart: aiResponse.recommendedStart || 1,
      currentStep: 1,
      totalSteps: aiResponse.totalSteps || aiResponse.steps?.length || 0,
      estimatedTotalHours: aiResponse.estimatedTotalHours || 0,
      steps: (aiResponse.steps || []).map((step: Partial<Step>, index: number) => ({
        ...step,
        id: step.id || index + 1,
        isCompleted: false,
        isExpanded: false,
        conversations: []
      })),
      progress: 0,
      createdAt: new Date().toISOString()
    };

    return NextResponse.json(roadmap);
  } catch (error) {
    console.error('Error generating roadmap:', error);
    return NextResponse.json(
      { error: 'Failed to generate roadmap' },
      { status: 500 }
    );
  }
}

// Mock function - replace with actual AI call
function generateMockRoadmap(topic: string): Roadmap {
  const steps: Step[] = [
    {
      id: 1,
      title: 'HTTP 기초',
      description: '웹의 기본 프로토콜 이해',
      aiExplanation: 'HTTP는 웹에서 데이터를 주고받는 기본 프로토콜입니다. 요청(Request)과 응답(Response)의 구조를 이해하면 웹훅의 동작 원리를 쉽게 파악할 수 있습니다.',
      why: '웹훅은 HTTP 기반이므로 기초 이해가 필요합니다',
      estimatedHours: 3,
      difficulty: 'easy',
      isOptional: true,
      prerequisites: [],
      isCompleted: false,
      isExpanded: false,
      conversations: []
    },
    {
      id: 2,
      title: 'REST API 개념',
      description: 'RESTful API의 기본 원칙',
      aiExplanation: 'REST는 웹 서비스를 설계하는 아키텍처 스타일입니다. GET, POST, PUT, DELETE 등의 HTTP 메서드를 활용하여 리소스를 관리하는 방법을 배웁니다.',
      why: '웹훅을 받을 엔드포인트를 설계하기 위해 필요합니다',
      estimatedHours: 4,
      difficulty: 'medium',
      isOptional: false,
      prerequisites: [1],
      isCompleted: false,
      isExpanded: false,
      conversations: []
    },
    {
      id: 3,
      title: '웹훅 개념과 동작 원리',
      description: '웹훅이 무엇이고 어떻게 작동하는지',
      aiExplanation: '웹훅은 이벤트 기반 통신 방식입니다. 특정 이벤트가 발생하면 자동으로 설정된 URL로 HTTP POST 요청을 보냅니다. GitHub, Stripe 등 많은 서비스에서 사용합니다.',
      why: '실제 구현 전 개념 이해가 중요합니다',
      estimatedHours: 3,
      difficulty: 'medium',
      isOptional: false,
      prerequisites: [2],
      isCompleted: false,
      isExpanded: false,
      conversations: []
    },
    {
      id: 4,
      title: '웹훅 구현하기',
      description: 'Node.js/Express로 웹훅 엔드포인트 만들기',
      aiExplanation: '실제로 웹훅을 받을 수 있는 서버를 구현합니다. 요청 검증, 시크릿 키 확인, 페이로드 파싱 등 실무에 필요한 내용을 다룹니다.',
      why: '실습을 통해 완전한 이해를 달성합니다',
      estimatedHours: 5,
      difficulty: 'hard',
      isOptional: false,
      prerequisites: [3],
      isCompleted: false,
      isExpanded: false,
      conversations: []
    }
  ];

  const roadmap: Roadmap = {
    id: `roadmap-${Date.now()}`,
    topic: topic,
    recommendedStart: 2,
    currentStep: 1,
    totalSteps: steps.length,
    estimatedTotalHours: steps.reduce((sum, step) => sum + step.estimatedHours, 0),
    steps,
    progress: calculateProgress(steps),
    createdAt: new Date().toISOString()
  };

  return roadmap;
}
