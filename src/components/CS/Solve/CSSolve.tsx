'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ContentCard } from './ContentCard'
import {
  CSQuestionDetail,
  useCSDontknowFeedback,
  useCSFeedback,
  useCSRetryFeedback,
} from '@/api'
import { useRef, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { AnswerList } from './AnswerList'
import { FeedbackList } from './FeedbackList'
import { useSearchParams } from 'next/navigation'

interface CSSolveProps {
  question: CSQuestionDetail
  refetch: () => void
}

export const CSSolve = ({ question, refetch }: CSSolveProps) => {
  const searchParmas = useSearchParams()
  const tabFromUrl = searchParmas.get('tab') as 'challenge' | 'solution' | null

  const [answer, setAnswer] = useState('')
  const [tab, setTab] = useState<'challenge' | 'solution'>(
    tabFromUrl ?? 'challenge',
  )
  const feedbackRef = useRef<HTMLDivElement>(null)

  const { mutate: submitFeedback, isPending: isSubmitting } = useCSFeedback()
  const { mutate: retryFeedback, isPending: isRetrying } = useCSRetryFeedback()
  const { mutate: dontknowFeedback, isPending: isSendingDontknow } =
    useCSDontknowFeedback(question.csQuestionId)

  const handleSubmit = () => {
    const payload = {
      csQuestionId: question.csQuestionId,
      answer: answer.trim(),
    }

    const onSuccess = async () => {
      await refetch()
      setAnswer('')
      setTab('solution')

      // ✅ 피드백 영역으로 스크롤
      setTimeout(() => {
        feedbackRef.current?.scrollIntoView({
          behavior: 'smooth',
        })
      }, 300) // 조금 기다렸다가 scroll
    }

    if (question.questionStatus === 'DONE') {
      retryFeedback(payload, { onSuccess })
    } else {
      submitFeedback(payload, { onSuccess })
    }
  }

  const handleDontKnow = () => {
    const payload = {
      csQuestionId: question.csQuestionId,
    }

    const onSuccess = async () => {
      await refetch()
      setTab('solution')
      // scroll to feedback
      setTimeout(() => {
        feedbackRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 300)
    }

    dontknowFeedback(payload, { onSuccess })
  }

  const userAnswers = question.answers.filter((a) => a.author === 'USER')
  const aiFeedbacks = question.answers.filter((a) => a.author === 'AI')

  return (
    <Tabs
      value={tab}
      onValueChange={(v) => setTab(v as typeof tab)}
      className="flex w-full max-w-4xl flex-col gap-5"
    >
      <TabsList className="w-full">
        <TabsTrigger value="challenge">도전하기</TabsTrigger>
        <TabsTrigger value="solution">답변보기</TabsTrigger>
      </TabsList>

      {/* 도전하기 탭 */}
      <TabsContent value="challenge">
        <div className="flex flex-col gap-5">
          <ContentCard
            title="질문"
            stack={
              <p className="rounded-3xl bg-green-100 px-3 py-1 text-sm text-green-600">
                {question.stack}
              </p>
            }
          >
            <p className="font-medium">{question.question}</p>
          </ContentCard>

          <ContentCard title="답변">
            <Textarea
              placeholder="질문에 대한 답변을 작성해주세요..."
              className="h-[200px] resize-none border-slate-300"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
          </ContentCard>

          <div className="flex justify-end gap-2">
            <Button
              className="flex w-24 items-center justify-center gap-1"
              disabled={question.questionStatus == 'DONE'}
              onClick={handleDontKnow}
            >
              {isSendingDontknow && (
                <Loader2 className="animate-spin text-slate-500" size={16} />
              )}
              {isSendingDontknow ? '제출 중...' : '모르겠어요'}
            </Button>

            <Button
              className="flex w-24 items-center justify-center gap-1"
              disabled={
                answer.trim().length === 0 || isSubmitting || isRetrying
              }
              onClick={handleSubmit}
            >
              {(isSubmitting || isRetrying) && (
                <Loader2 className="animate-spin text-slate-500" size={16} />
              )}
              {isSubmitting || isRetrying ? '제출 중...' : '답변 제출'}
            </Button>
          </div>
        </div>
      </TabsContent>

      {/* 답변보기 탭 */}
      <TabsContent value="solution">
        <div className="flex flex-col gap-5">
          <ContentCard
            title="질문"
            stack={
              <p className="rounded-3xl bg-green-100 px-3 py-1 text-sm text-green-600">
                {question.stack}
              </p>
            }
          >
            <p className="font-medium">{question.question}</p>
          </ContentCard>

          <ContentCard title="답변">
            <AnswerList answers={userAnswers} />
          </ContentCard>

          <div ref={feedbackRef}>
            <ContentCard title="피드백">
              <FeedbackList feedbacks={aiFeedbacks} />
            </ContentCard>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}
