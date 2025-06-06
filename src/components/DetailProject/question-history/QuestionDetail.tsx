'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { UIQuestionHistoryItem } from '../types'
import { FileCode, MessageSquareText, Loader2, AlertCircle } from 'lucide-react'
import { Code } from 'lucide-react'

interface QuestionDetailProps {
  question: UIQuestionHistoryItem | null
  isBookmarked: boolean
  onBookmark: (questionId: number) => void
  onAnswer?: (
    question: UIQuestionHistoryItem,
    answer: string,
  ) => Promise<string | undefined>
  activeCSQuestionIds?: number[] // CS 질문 탭에서 활성화된 질문 ID 목록
}

/**
 * 질문 상세 정보 컴포넌트
 */
const QuestionDetail: React.FC<QuestionDetailProps> = ({
  question,
  isBookmarked,
  onBookmark,
  onAnswer,
  activeCSQuestionIds = [], // 기본값은 빈 배열
}) => {
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)
  const [isAnswering, setIsAnswering] = useState(false)
  const [isAnswered, setIsAnswered] = useState(false)

  // 현재 질문이 CS 질문 탭에서 답변 중인지 확인
  const isActiveCSQuestion =
    question && activeCSQuestionIds.includes(question.id)

  // 질문이 변경될 때마다 상태 초기화 및 이미 답변된 질문인지 확인
  useEffect(() => {
    if (question) {
      setUserAnswer('') // 사용자 답변 초기화
      setFeedback(null) // 피드백 초기화
      setIsAnswering(false) // 답변 중 상태 초기화

      // 이미 답변된 질문인지 확인
      const hasAnswer = !!question.answer && question.answer.trim() !== ''
      const isDone = question.status === 'DONE' || question.answered === true
      setIsAnswered(hasAnswer || isDone)
    }
  }, [question?.id, question?.answer, question?.status, question?.answered])

  if (!question) {
    return (
      <div className="flex h-60 items-center justify-center text-slate-500">
        왼쪽에서 질문을 선택해주세요.
      </div>
    )
  }

  // 안전하게 status 확인 (undefined 또는 다른 타입일 수 있음)
  const isTodo =
    (!question.answer || question.answer === '') &&
    question.status !== 'DONE' &&
    question.answered !== true

  const handleAnswerSubmit = async () => {
    if (!onAnswer || !userAnswer.trim() || !question) return

    setIsAnswering(true)
    try {
      const result = await onAnswer(question, userAnswer)
      setFeedback(result || '답변이 제출되었습니다.')
      setIsAnswered(true) // 답변 제출 성공 시 상태 업데이트
    } catch (error) {
      console.error('답변 제출 중 오류 발생:', error)
      setFeedback('답변 제출 중 오류가 발생했습니다.')
    } finally {
      setIsAnswering(false)
    }
  }

  return (
    <div>
      <div className="mb-4">
        <h3 className="font-medium text-slate-800">{question.question}</h3>

        {question.folderName && (
          <div className="mt-2 flex items-center justify-between text-xs">
            <div className="flex items-center text-blue-600">
              <FileCode className="mr-1 h-4 w-4" />
              <span>{question.folderName}</span>
            </div>
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
        )}
        <div className="text-muted-foreground mt-3 flex items-center gap-1 text-xs">
          <Code className="h-3.5 w-3.5" />
          <span>관련 코드</span>
        </div>
        {question.relatedCode && (
          <div className="mt-2 overflow-auto rounded-md bg-slate-100 p-3">
            <pre className="text-xs whitespace-pre-wrap text-slate-700">
              {question.relatedCode}
            </pre>
          </div>
        )}
      </div>

      <div className="mt-6 space-y-4">
        {isActiveCSQuestion && (
          <div className="mb-4 flex items-center gap-2 rounded-md bg-amber-50 p-3 text-amber-700">
            <AlertCircle className="h-4 w-4" />
            <p className="text-sm">
              이 질문은 현재 CS 질문 탭에서 답변 중인 질문입니다. CS 질문 탭에서
              답변해주세요.
            </p>
          </div>
        )}

        {isTodo && onAnswer && !isActiveCSQuestion ? (
          <div className="space-y-2">
            <h4 className="flex items-center text-sm font-medium">
              내 답변{' '}
              <MessageSquareText className="ml-1 h-4 w-4 text-blue-500" />
            </h4>
            <Textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="답변을 작성해 주세요..."
              className="min-h-[150px] resize-none"
              disabled={isAnswering || isAnswered}
            />
            <div className="flex justify-end">
              <Button
                onClick={handleAnswerSubmit}
                disabled={isAnswering || !userAnswer.trim() || isAnswered}
                className="flex items-center gap-2"
              >
                {isAnswering ? (
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
        ) : (
          <div className="rounded-md bg-slate-50 p-3">
            <h4 className="mb-2 text-sm font-medium">내 답변</h4>
            <div className="text-sm whitespace-pre-line text-slate-700">
              {question.answer || '답변이 없습니다.'}
            </div>
          </div>
        )}

        {feedback ? (
          <div className="rounded-md bg-green-50 p-3">
            <h4 className="mb-2 text-sm font-medium text-green-700">피드백</h4>
            <div className="text-sm whitespace-pre-line text-green-600">
              {feedback}
            </div>
          </div>
        ) : (
          question.feedback && (
            <div className="rounded-md bg-green-50 p-3">
              <h4 className="mb-2 text-sm font-medium text-green-700">
                피드백
              </h4>
              <div className="text-sm whitespace-pre-line text-green-600">
                {question.feedback}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default QuestionDetail
