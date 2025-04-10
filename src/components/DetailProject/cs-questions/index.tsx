'use client'

import React, { useCallback, useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { CSQuestionsTabProps } from '../types'
import QuestionList from './QuestionList'
import AnswerForm from './AnswerForm'
import LearningInsights from './LearningInsights'
import useCSQuestions from './useCSQuestions'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle2, AlertCircle, Code } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * CS 질문 탭 컴포넌트
 * 생성된 CS 질문 목록을 표시하고 답변을 제출할 수 있습니다.
 */
const CSQuestionsTab: React.FC<CSQuestionsTabProps> = ({
  projectId,
  codeSnippet = '',
  onAnswerSubmit,
  onSaveQuestion,
  onTabChange,
}) => {
  const [activeTab, setActiveTab] = useState('questions')

  const {
    // 상태
    questions,
    selectedQuestionId,
    answer,
    feedback,
    loading,
    questionsLoading,
    savedQuestions,
    showCompletionToast,

    // 계산된 값
    allQuestionsAnswered,
    selectedQuestion,
    currentQuestionIndex,

    progressPercentage,

    // 이벤트 핸들러
    handleSelectQuestion,
    handleAnswerChange,
    handleSubmitAnswer,
    handleSaveQuestion,
    toggleLearningInsights,
  } = useCSQuestions({ projectId, codeSnippet })

  const handleSubmit = useCallback(async () => {
    await handleSubmitAnswer(onAnswerSubmit)
  }, [handleSubmitAnswer, onAnswerSubmit])

  const handleSave = useCallback(
    async (questionId: number) => {
      return await handleSaveQuestion(questionId, onSaveQuestion)
    },
    [handleSaveQuestion, onSaveQuestion],
  )

  // 현재 선택된 질문의 저장 핸들러
  const handleSaveCurrentQuestion = useCallback(async () => {
    if (selectedQuestionId) {
      return await handleSave(selectedQuestionId)
    }
    return false
  }, [selectedQuestionId, handleSave])

  // 모든 질문 답변 완료 시 인사이트 탭으로 자동 전환
  useEffect(() => {
    if (allQuestionsAnswered) {
      setActiveTab('insights')
    }
  }, [allQuestionsAnswered])

  // 코드가 선택되지 않은 경우
  if (!codeSnippet || codeSnippet.trim() === '') {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <Code className="h-8 w-8 text-blue-500" />
          <p className="text-lg font-medium">코드를 먼저 선택해주세요</p>
          <p className="text-muted-foreground max-w-md text-sm">
            코드 선택 탭에서 분석하고 싶은 코드를 선택한 후 CS 질문을 생성할 수
            있습니다.
          </p>
          <Button
            className="mt-3"
            variant="outline"
            onClick={() => onTabChange && onTabChange('code-select')}
          >
            코드 선택으로 이동
          </Button>
        </div>
      </div>
    )
  }

  if (questionsLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">
            선택한 코드를 분석하여 CS 질문을 생성 중입니다...
          </p>
        </div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <AlertCircle className="h-8 w-8 text-amber-500" />
          <p className="text-lg font-medium">질문을 생성할 수 없습니다</p>
          <p className="text-muted-foreground max-w-md text-sm">
            선택한 코드에서 CS 관련 질문을 생성할 수 없습니다. 다른 코드 영역을
            선택하시거나, 더 많은 코드를 선택해 주세요.
          </p>
          <Button
            className="mt-3"
            variant="outline"
            onClick={() => onTabChange && onTabChange('code-select')}
          >
            코드 다시 선택하기
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 완료 토스트 메시지 */}
      {showCompletionToast && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            축하합니다! 모든 질문에 답변을 완료했습니다. 학습 인사이트를
            확인해보세요.
          </AlertDescription>
        </Alert>
      )}

      <Tabs
        defaultValue="questions"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-6 w-full md:w-[400px]">
          <TabsTrigger value="questions" className="flex-1">
            질문 & 답변
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex-1">
            학습 인사이트
          </TabsTrigger>
        </TabsList>

        <TabsContent value="questions" className="mt-0">
          <div className="grid gap-6 md:grid-cols-5">
            <div className="md:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <QuestionList
                    questions={questions}
                    selectedQuestionId={selectedQuestionId}
                    savedQuestions={savedQuestions}
                    onSelectQuestion={handleSelectQuestion}
                    progressPercentage={progressPercentage}
                  />
                </CardContent>
              </Card>
            </div>
            <div className="md:col-span-3">
              <Card>
                <CardContent className="p-6">
                  {selectedQuestion ? (
                    <AnswerForm
                      question={selectedQuestion.question}
                      codeSnippet={selectedQuestion.codeSnippet}
                      questionIndex={currentQuestionIndex}
                      totalQuestions={questions.length}
                      answer={answer}
                      feedback={feedback}
                      isAnswered={selectedQuestion.answered || false}
                      isLoading={loading}
                      isBookmarked={
                        selectedQuestion &&
                        savedQuestions.includes(selectedQuestion.id)
                      }
                      onAnswerChange={handleAnswerChange}
                      onSubmit={handleSubmit}
                      onSave={handleSaveCurrentQuestion}
                    />
                  ) : (
                    <div className="flex h-[300px] items-center justify-center">
                      <p className="text-muted-foreground">
                        질문을 선택해주세요
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="mt-0">
          <Card>
            <CardContent className="p-6">
              <LearningInsights questions={questions} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default CSQuestionsTab
