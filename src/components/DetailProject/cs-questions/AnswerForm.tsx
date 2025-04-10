'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, BookmarkIcon, CheckCircle, Code } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AnswerFormProps {
  question: string
  codeSnippet?: string
  questionIndex?: number
  totalQuestions?: number
  answer: string
  feedback: string | null
  isAnswered: boolean
  isLoading: boolean
  isBookmarked: boolean | undefined
  onAnswerChange: (value: string) => void
  onSubmit: () => void
  onSave?: () => Promise<boolean | undefined>
}

export default function AnswerForm({
  question,
  codeSnippet = '',
  questionIndex = 1,
  totalQuestions = 1,
  answer,
  feedback,
  isAnswered,
  isLoading,
  isBookmarked,
  onAnswerChange,
  onSubmit,
  onSave,
}: AnswerFormProps) {
  if (!question) {
    return (
      <div className="bg-muted/20 text-muted-foreground flex h-40 items-center justify-center rounded-md border p-6">
        질문을 선택해주세요.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium">
              {questionIndex}
            </div>
            <span className="text-muted-foreground text-sm">
              {questionIndex} / {totalQuestions}
            </span>
          </div>

          {onSave && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onSave}
              disabled={isBookmarked}
              className={cn(
                'flex items-center gap-1 text-xs',
                isBookmarked && 'text-amber-500',
              )}
            >
              <BookmarkIcon className="h-4 w-4" />
              <span>{isBookmarked ? '저장됨' : '저장하기'}</span>
            </Button>
          )}
        </div>

        <div className="bg-card rounded-lg border p-4">
          <h3 className="font-medium">{question}</h3>

          {codeSnippet && (
            <div className="mt-3 space-y-1">
              <div className="text-muted-foreground flex items-center gap-1 text-xs">
                <Code className="h-3.5 w-3.5" />
                <span>관련 코드</span>
              </div>
              <pre className="bg-muted overflow-auto rounded-md p-2 text-xs">
                {codeSnippet.length > 300
                  ? codeSnippet.substring(0, 300) + '...'
                  : codeSnippet}
                {/* todo 선택한 코드 중 ai가 질문과 관련된 코드만 선택하여 제공하게 수정 필요 */}
              </pre>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">답변</h3>
          {isAnswered && (
            <div className="flex items-center gap-1 text-xs text-green-600">
              <CheckCircle className="h-3.5 w-3.5" />
              <span>답변 완료</span>
            </div>
          )}
        </div>

        <Textarea
          value={answer}
          onChange={(e) => onAnswerChange(e.target.value)}
          placeholder="질문에 대한
답변을 작성해 주세요..."
          className="min-h-[150px] resize-none"
          disabled={isLoading || isAnswered}
        />

        <div className="flex justify-end">
          <Button
            onClick={onSubmit}
            disabled={isLoading || !answer.trim() || isAnswered}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>제출 중...</span>
              </>
            ) : (
              '답변 제출'
            )}
          </Button>
        </div>
      </div>

      {feedback && (
        <div className="rounded-lg border bg-green-50 p-4">
          <h3 className="mb-2 font-medium text-green-800">피드백</h3>
          <div className="text-sm whitespace-pre-line text-green-700">
            {feedback}
          </div>
        </div>
      )}
    </div>
  )
}
