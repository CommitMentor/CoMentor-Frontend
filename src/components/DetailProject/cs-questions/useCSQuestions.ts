'use client'

import { useState, useEffect, useCallback } from 'react'
import { QuestionItem } from '../types'
import { generateCSQuestions } from '@/api/services/project'

interface UseCSQuestionsProps {
  projectId: string
  codeSnippet?: string
}

export default function useCSQuestions({
  projectId,
  codeSnippet = '',
}: UseCSQuestionsProps) {
  const [questions, setQuestions] = useState<QuestionItem[]>([])
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(
    null,
  )
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [questionsLoading, setQuestionsLoading] = useState(true)
  const [savedQuestions, setSavedQuestions] = useState<number[]>([])
  const [showCompletionToast, setShowCompletionToast] = useState(false)
  const [showLearningInsights, setShowLearningInsights] = useState(false)

  // 질문 데이터 가져오기
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!projectId || !codeSnippet) return

      setQuestionsLoading(true)
      try {
        const data = await generateCSQuestions(projectId, codeSnippet, '')
        const enhancedData = data.map((q) => ({
          ...q,
          answered: false,
          userAnswer: '',
          feedback: '',
          codeSnippet: codeSnippet.substring(0, 100) + '...',
        }))
        setQuestions(enhancedData)
        if (enhancedData.length > 0 && selectedQuestionId === null) {
          setSelectedQuestionId(enhancedData[0].id)
        }
      } catch (error) {
        console.error('CS 질문을 가져오는 중 오류 발생:', error)
      } finally {
        setQuestionsLoading(false)
      }
    }

    fetchQuestions()
  }, [projectId, codeSnippet])

  // 모든 질문이 답변되었는지 확인
  useEffect(() => {
    const allAnswered =
      questions.length > 0 && questions.every((q) => q.answered)

    if (allAnswered && !showCompletionToast) {
      setShowCompletionToast(true)
      setShowLearningInsights(true)
      // 3초 후 토스트 메시지 자동으로 사라짐
      setTimeout(() => {
        setShowCompletionToast(false)
      }, 3000)
    }
  }, [questions, showCompletionToast])

  const handleSelectQuestion = useCallback(
    (id: number) => {
      const selectedQuestion = questions.find((q) => q.id === id)
      setSelectedQuestionId(id)

      // 이미 답변한 질문이면 기존 답변과 피드백 표시
      if (selectedQuestion?.answered && selectedQuestion?.userAnswer) {
        setAnswer(selectedQuestion.userAnswer)
        setFeedback(selectedQuestion.feedback || null)
      } else {
        setAnswer('')
        setFeedback(null)
      }
    },
    [questions],
  )

  const handleAnswerChange = useCallback((value: string) => {
    setAnswer(value)
  }, [])

  const handleSubmitAnswer = useCallback(
    async (
      onSubmit?: (answer: string, questionId: number) => Promise<string>,
    ) => {
      if (!onSubmit || !selectedQuestionId || !answer.trim()) return

      setLoading(true)
      try {
        const result = await onSubmit(answer, selectedQuestionId)
        setFeedback(result)

        // 답변과 피드백 함께 저장
        setQuestions((prev) =>
          prev.map((q) =>
            q.id === selectedQuestionId
              ? { ...q, answered: true, userAnswer: answer, feedback: result }
              : q,
          ),
        )
      } catch (error) {
        console.error('답변 제출 중 오류 발생:', error)
        setFeedback('답변 제출 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    },
    [selectedQuestionId, answer],
  )

  const handleSaveQuestion = useCallback(
    async (
      questionId: number,
      onSave?: (questionId: number) => Promise<boolean | undefined>,
    ) => {
      if (!onSave) return

      try {
        const success = await onSave(questionId)
        if (success) {
          setSavedQuestions((prev) => [...prev, questionId])
          return true
        }
        return false
      } catch (error) {
        console.error('질문 저장 중 오류 발생:', error)
        return false
      }
    },
    [],
  )

  const toggleLearningInsights = useCallback(() => {
    setShowLearningInsights((prev) => !prev)
  }, [])

  // 현재 상태 계산
  const allQuestionsAnswered =
    questions.length > 0 && questions.every((q) => q.answered)
  const selectedQuestion = questions.find((q) => q.id === selectedQuestionId)
  const currentQuestionIndex =
    questions.findIndex((q) => q.id === selectedQuestionId) + 1
  const answeredCount = questions.filter((q) => q.answered).length
  const progressPercentage =
    questions.length > 0 ? (answeredCount / questions.length) * 100 : 0

  return {
    // 상태
    questions,
    selectedQuestionId,
    answer,
    feedback,
    loading,
    questionsLoading,
    savedQuestions,
    showCompletionToast,
    showLearningInsights,

    // 계산된 값
    allQuestionsAnswered,
    selectedQuestion,
    currentQuestionIndex,
    answeredCount,
    progressPercentage,

    // 이벤트 핸들러
    handleSelectQuestion,
    handleAnswerChange,
    handleSubmitAnswer,
    handleSaveQuestion,
    toggleLearningInsights,
  }
}
