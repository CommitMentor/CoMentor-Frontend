'use client'

import React from 'react'
import { HistoryByDate, QuestionHistoryItem } from '../types'
import QuestionCard from '../ui/QuestionCard'

interface HistoryListProps {
  dates: string[]
  history: HistoryByDate
  selectedQuestionId?: number
  bookmarkedQuestions: number[]
  onSelectQuestion: (question: QuestionHistoryItem) => void
}

/**
 * 질문 이력 목록 컴포넌트
 */
const HistoryList: React.FC<HistoryListProps> = ({
  dates,
  history,
  selectedQuestionId,
  bookmarkedQuestions,
  onSelectQuestion,
}) => {
  if (dates.length === 0) {
    return (
      <div className="flex h-60 items-center justify-center text-slate-500">
        아직 저장된 질문이 없습니다.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {dates.map((date) => (
        <div key={date}>
          <h4 className="mb-2 text-sm font-medium text-slate-700">{date}</h4>
          <div className="space-y-2">
            {history[date].map((question) => (
              <QuestionCard
                key={question.id}
                question={{
                  ...question,
                  answered: true,
                  codeSnippet: question.codeSnippet,
                }}
                isSelected={selectedQuestionId === question.id}
                isBookmarked={bookmarkedQuestions.includes(question.id)}
                onClick={() => onSelectQuestion(question)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default HistoryList
