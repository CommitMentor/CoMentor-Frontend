'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, BookOpen, Award, Brain, Sparkles } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { QuestionItem } from '../types'

interface LearningInsightsProps {
  questions: QuestionItem[]
  className?: string
}

/**
 * 학습 인사이트 컴포넌트
 * CS 질문에 대한 사용자의 학습 현황 및 추가 정보를 표시
 */
export default function LearningInsights({
  questions,
  className = '',
}: LearningInsightsProps) {
  // 답변된 질문 수
  const answeredCount = questions.filter((q) => q.answered).length
  // 학습 진행률
  const progressPercentage =
    questions.length > 0 ? (answeredCount / questions.length) * 100 : 0

  // 인사이트 카테고리화
  const categorizeInsights = (questions: QuestionItem[]) => {
    const categories: Record<string, string[]> = {
      알고리즘: [],
      데이터베이스: [],
      디자인패턴: [],
      네트워크: [],
      운영체제: [],
      기타: [],
    }

    questions.forEach((q) => {
      // 피드백에서 카테고리 추출 로직
      // 실제 구현에서는 더 정교한 카테고리 분류 알고리즘 필요
      const feedback = q.feedback || ''

      if (feedback.includes('알고리즘') || q.question.includes('알고리즘')) {
        categories.알고리즘.push(q.question)
      } else if (
        feedback.includes('데이터베이스') ||
        q.question.includes('데이터베이스') ||
        q.question.includes('SQL')
      ) {
        categories.데이터베이스.push(q.question)
      } else if (
        feedback.includes('디자인 패턴') ||
        q.question.includes('패턴')
      ) {
        categories.디자인패턴.push(q.question)
      } else if (
        feedback.includes('네트워크') ||
        q.question.includes('네트워크') ||
        q.question.includes('HTTP')
      ) {
        categories.네트워크.push(q.question)
      } else if (
        feedback.includes('운영체제') ||
        q.question.includes('운영체제') ||
        q.question.includes('프로세스')
      ) {
        categories.운영체제.push(q.question)
      } else {
        categories.기타.push(q.question)
      }
    })

    // 비어있는 카테고리 제거
    Object.keys(categories).forEach((key) => {
      if (categories[key].length === 0) {
        delete categories[key]
      }
    })

    return categories
  }

  const insights = categorizeInsights(questions)

  // 추천 학습 자료
  const learningResources = [
    {
      title: '알고리즘과 자료구조',
      description: '효율적인 알고리즘 설계와 자료구조 활용 방법을 학습하세요.',
      url: 'https://www.example.com/algorithms',
      icon: <Brain className="h-5 w-5 text-indigo-500" />,
    },
    {
      title: '디자인 패턴의 이해',
      description: '소프트웨어 설계의 핵심 패턴과 적용 사례를 살펴보세요.',
      url: 'https://www.example.com/design-patterns',
      icon: <Sparkles className="h-5 w-5 text-amber-500" />,
    },
  ]

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 헤더 및 진행 상황 */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-sm">
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-blue-100 opacity-50"></div>
        <div className="absolute -right-5 -bottom-5 h-28 w-28 rounded-full bg-indigo-100 opacity-50"></div>

        <div className="relative">
          <div className="flex items-center gap-3">
            <Award className="h-8 w-8 text-indigo-500" />
            <h2 className="text-xl font-bold text-indigo-900">학습 인사이트</h2>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="rounded-md bg-white p-4 shadow-sm">
              <div className="text-sm text-gray-500">진행률</div>
              <div className="mt-1 flex items-end gap-1.5">
                <span className="text-2xl font-bold text-indigo-700">
                  {progressPercentage.toFixed(0)}%
                </span>
                <span className="mb-0.5 text-sm font-medium text-gray-600">
                  완료
                </span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-indigo-500"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            <div className="rounded-md bg-white p-4 shadow-sm">
              <div className="text-sm text-gray-500">학습 현황</div>
              <div className="mt-1 flex items-end gap-1.5">
                <span className="text-2xl font-bold text-indigo-700">
                  {answeredCount}
                </span>
                <span className="mb-0.5 text-sm font-medium text-gray-600">
                  / {questions.length} 질문 완료
                </span>
              </div>
              <div className="mt-2 flex items-center">
                <CheckCircle className="mr-1.5 h-4 w-4 text-green-500" />
                <span className="text-xs font-medium text-gray-600">
                  {questions.length - answeredCount}개 질문 남음
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 학습 주제 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="h-5 w-5 text-indigo-500" />
            학습 주제 분석
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4 text-sm">
            질문과 답변을 기반으로 다음 주제에 대한 학습이 진행되었습니다:
          </p>

          <Accordion type="single" collapsible className="w-full">
            {Object.entries(insights).map(([category, questions], index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-sm font-medium hover:text-indigo-600 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-indigo-400"></div>
                    {category} ({questions.length})
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="mt-1 ml-4 space-y-2">
                    {questions.map((question, qIndex) => (
                      <li key={qIndex} className="text-sm text-gray-600">
                        • {question}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* 추천 학습 자료 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="h-5 w-5 text-indigo-500" />
            추천 학습 자료
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4 text-sm">
            더 깊이 있는 학습을 위해 다음 자료를 참고해보세요:
          </p>

          <div className="space-y-3">
            {learningResources.map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 rounded-md border border-gray-200 p-3 transition-colors hover:bg-gray-50"
              >
                <div className="mt-0.5 rounded-full bg-indigo-50 p-1.5">
                  {resource.icon}
                </div>
                <div>
                  <h4 className="font-medium text-indigo-700">
                    {resource.title}
                  </h4>
                  <p className="mt-0.5 text-sm text-gray-600">
                    {resource.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
