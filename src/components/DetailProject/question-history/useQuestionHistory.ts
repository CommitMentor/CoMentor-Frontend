'use client'

import { useState, useEffect, useCallback } from 'react'
import { getQuestionHistory } from '@/api/services/project'
import { HistoryByDate, QuestionHistoryItem } from '../types'

interface UseQuestionHistoryProps {
  projectId: string
  initialHistory?: HistoryByDate
}

export default function useQuestionHistory({
  projectId,
  initialHistory,
}: UseQuestionHistoryProps) {
  const [history, setHistory] = useState<HistoryByDate>(initialHistory || {})
  const [loading, setLoading] = useState(!initialHistory)
  const [selectedQuestion, setSelectedQuestion] =
    useState<QuestionHistoryItem | null>(null)
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<number[]>([])

  // 질문 이력 가져오기
  useEffect(() => {
    const fetchHistory = async () => {
      if (initialHistory || !projectId) return

      setLoading(true)
      try {
        const data = await getQuestionHistory(projectId)
        setHistory(data)
      } catch (error) {
        console.error('질문 이력을 가져오는 중 오류 발생:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [projectId, initialHistory])

  // 질문 선택 핸들러
  const handleSelectQuestion = useCallback((question: QuestionHistoryItem) => {
    setSelectedQuestion(question)
  }, [])

  // 북마크 핸들러
  const handleBookmark = useCallback(
    async (
      questionId: number,
      onBookmark?: (questionId: number) => Promise<boolean>,
    ) => {
      if (!onBookmark) return false

      try {
        const success = await onBookmark(questionId)
        if (success) {
          setBookmarkedQuestions((prev) => [...prev, questionId])
          return true
        }
        return false
      } catch (error) {
        console.error('북마크 중 오류 발생:', error)
        return false
      }
    },
    [],
  )

  // 날짜 정렬 (최신순)
  const sortedDates = Object.keys(history).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime()
  })

  return {
    history,
    loading,
    selectedQuestion,
    bookmarkedQuestions,
    sortedDates,
    handleSelectQuestion,
    handleBookmark,
  }
}
