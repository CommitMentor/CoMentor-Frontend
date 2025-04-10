'use client'

import React from 'react'
import { QuestionCardProps } from '../types'

/**
 * 재사용 가능한 질문 카드 컴포넌트
 */
const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  isSelected = false,
  isBookmarked = false,
  onClick,
}) => {
  return (
    <div
      className={`cursor-pointer rounded-md p-3 ${
        isSelected ? 'bg-slate-100' : 'bg-white hover:bg-slate-50'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <p className="text-sm text-slate-700">{question.question}</p>
        {isBookmarked && (
          <span className="ml-2 shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-600">
            북마크됨
          </span>
        )}
      </div>
      {question.codeSnippet && (
        <p className="mt-1 truncate text-xs text-slate-500">
          {question.codeSnippet}
        </p>
      )}
      {question.answered && (
        <div className="mt-1 flex justify-end">
          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-600">
            답변됨
          </span>
        </div>
      )}
    </div>
  )
}

export default QuestionCard
