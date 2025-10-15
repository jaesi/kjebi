import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { CHAT_SYSTEM_PROMPT, getChatPrompt } from '@/lib/prompts';
import { Conversation } from '@/lib/types';

export const runtime = 'nodejs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { question, stepTitle } = await request.json();

    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_api_key_here') {
      console.warn('OpenAI API key not configured, using mock data');
      const mockResponse = generateMockAnswer(stepTitle, question);
      return NextResponse.json(mockResponse);
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: CHAT_SYSTEM_PROMPT },
        { role: 'user', content: getChatPrompt(stepTitle, question) }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No content from OpenAI');
    }

    const aiResponse = JSON.parse(content);

    const conversation: Conversation = {
      id: `conv-${Date.now()}`,
      question,
      answer: aiResponse.detail || aiResponse.answer || '답변을 생성할 수 없습니다.',
      answerSummary: aiResponse.summary || question,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(conversation);
  } catch (error) {
    console.error('Error answering question:', error);
    return NextResponse.json(
      { error: 'Failed to answer question' },
      { status: 500 }
    );
  }
}

// Mock function - replace with actual AI call
function generateMockAnswer(stepTitle: string, question: string): Conversation {
  const conversation: Conversation = {
    id: `conv-${Date.now()}`,
    question,
    answer: `💡 좋은 질문이에요! ${question}에 대해 설명드리겠습니다.\n\n${stepTitle}를 학습하시면서 이런 궁금증을 갖는 것은 아주 자연스러운 과정입니다.\n\n📝 상세 설명:\n- 이 개념은 실무에서 자주 사용됩니다\n- 처음에는 어렵게 느껴질 수 있지만 연습하면 익숙해집니다\n- 추가 학습이 필요하다면 MDN 문서를 참고하세요`,
    answerSummary: `${question}에 대한 답변: 이 개념은 실무에서 중요하며, 연습을 통해 충분히 익힐 수 있습니다.`,
    timestamp: new Date().toISOString()
  };

  return conversation;
}
