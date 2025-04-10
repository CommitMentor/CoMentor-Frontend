'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { QuestionHistoryItem } from '../types'

interface QuestionDetailProps {
  question: QuestionHistoryItem | null
  isBookmarked: boolean
  onBookmark: (questionId: number) => void
}

/**
 * 질문 상세 정보 컴포넌트
 */
const QuestionDetail: React.FC<QuestionDetailProps> = ({
  question,
  isBookmarked,
  onBookmark,
}) => {
  if (!question) {
    return (
      <div className="flex h-60 items-center justify-center text-slate-500">
        왼쪽에서 질문을 선택해주세요.
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4">
        <h3 className="font-medium text-slate-800">{question.question}</h3>
        {question.codeSnippet && (
          <p className="mt-1 text-xs text-slate-500">{question.codeSnippet}</p>
        )}

        <div className="mt-1 flex justify-end">
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => onBookmark(question.id)}
            disabled={isBookmarked}
          >
            {isBookmarked ? '북마크됨' : '북마크 추가'}
          </Button>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="rounded-md bg-slate-50 p-3">
          <h4 className="mb-2 text-sm font-medium">내 답변</h4>
          <div className="text-sm whitespace-pre-line text-slate-700">
            {question.answer}
          </div>
        </div>

        <div className="rounded-md bg-green-50 p-3">
          <h4 className="mb-2 text-sm font-medium text-green-700">피드백</h4>
          <div className="text-sm whitespace-pre-line text-green-600">
            {question.feedback}
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuestionDetail
