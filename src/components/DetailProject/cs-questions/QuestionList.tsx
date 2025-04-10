'use client'

import React from 'react'
import { QuestionItem } from '../types'
import QuestionCard from '../ui/QuestionCard'
import { Progress } from '@/components/ui/progress'

interface QuestionListProps {
  questions: QuestionItem[]
  selectedQuestionId: number | null
  savedQuestions: number[]
  onSelectQuestion: (id: number) => void
  progressPercentage: number
}

/**
 * CS 질문 목록 컴포넌트
 */
const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  selectedQuestionId,
  savedQuestions,
  onSelectQuestion,
  progressPercentage,
}) => {
  if (questions.length === 0) {
    return (
      <div className="rounded-md bg-slate-50 p-4 text-center text-slate-500">
        질문이 없습니다. 코드를 선택하고 CS 질문을 생성해주세요.
      </div>
    )
  }

  // 답변한 질문 수
  const answeredCount = questions.filter((q) => q.answered).length

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-medium">질문 목록</h3>
          <span className="text-muted-foreground text-xs">
            {answeredCount}/{questions.length} 완료
          </span>
        </div>
        <Progress value={progressPercentage} className="h-1.5" />
      </div>

      <div className="space-y-2">
        {questions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            isSelected={selectedQuestionId === question.id}
            isBookmarked={savedQuestions.includes(question.id)}
            onClick={() => onSelectQuestion(question.id)}
          />
        ))}
      </div>
    </div>
  )
}

export default QuestionList
