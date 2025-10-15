import { LearningTopic } from '@/types/learning';

export const sampleTopics: LearningTopic[] = [
  {
    id: '1',
    title: 'HTML 기초',
    description: '웹 페이지의 구조를 만드는 HTML의 기본 개념',
    status: 'completed',
    prerequisites: [],
    estimatedTime: '1주',
    resources: ['MDN HTML 가이드', 'HTML 튜토리얼']
  },
  {
    id: '2',
    title: 'CSS 기초',
    description: '웹 페이지의 스타일링과 레이아웃',
    status: 'completed',
    prerequisites: ['1'],
    estimatedTime: '2주',
    resources: ['CSS Tricks', 'Flexbox Froggy']
  },
  {
    id: '3',
    title: 'JavaScript 기초',
    description: '프로그래밍의 기본과 DOM 조작',
    status: 'in-progress',
    prerequisites: ['1', '2'],
    estimatedTime: '4주',
    resources: ['JavaScript.info', 'Eloquent JavaScript']
  },
  {
    id: '4',
    title: 'React 기초',
    description: '컴포넌트 기반 UI 라이브러리',
    status: 'not-started',
    prerequisites: ['3'],
    estimatedTime: '3주',
    resources: ['React 공식 문서', 'React Tutorial']
  },
  {
    id: '5',
    title: 'TypeScript',
    description: '타입 안정성을 제공하는 JavaScript 슈퍼셋',
    status: 'not-started',
    prerequisites: ['3'],
    estimatedTime: '2주',
    resources: ['TypeScript Handbook']
  },
  {
    id: '6',
    title: 'Next.js',
    description: 'React 프레임워크로 풀스택 애플리케이션 구축',
    status: 'not-started',
    prerequisites: ['4', '5'],
    estimatedTime: '3주',
    resources: ['Next.js 공식 문서']
  },
  {
    id: '7',
    title: 'Node.js 기초',
    description: '서버 사이드 JavaScript 런타임',
    status: 'not-started',
    prerequisites: ['3'],
    estimatedTime: '2주',
    resources: ['Node.js 공식 가이드']
  },
  {
    id: '8',
    title: 'API 설계',
    description: 'RESTful API와 GraphQL',
    status: 'not-started',
    prerequisites: ['7'],
    estimatedTime: '2주',
    resources: ['REST API 튜토리얼']
  }
];
