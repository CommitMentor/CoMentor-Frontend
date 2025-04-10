'use client'

import React from 'react'
import { Loader2 } from 'lucide-react'
import { QuestionHistoryTabProps } from '../types'
import HistoryList from './HistoryList'
import QuestionDetail from './QuestionDetail'
import useQuestionHistory from './useQuestionHistory'

/**
 * 질문 이력 탭 컴포넌트
 * 날짜별로 그룹화된 질문 이력을 표시합니다.
 */
const QuestionHistoryTab: React.FC<QuestionHistoryTabProps> = ({
  projectId,
  initialHistory,
  onBookmarkQuestion,
}) => {
  const {
    history,
    loading,
    selectedQuestion,
    bookmarkedQuestions,
    sortedDates,
    handleSelectQuestion,
    handleBookmark,
  } = useQuestionHistory({
    projectId,
    initialHistory,
  })

  if (loading) {
    return (
      <div className="flex h-60 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-700" />
        <span className="ml-2 text-slate-700">질문 이력을 불러오는 중...</span>
      </div>
    )
  }

  return (
    <div className="rounded-lg bg-white">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <h3 className="mb-4 font-semibold text-slate-800">질문 이력</h3>
          <HistoryList
            dates={sortedDates}
            history={history}
            selectedQuestionId={selectedQuestion?.id}
            bookmarkedQuestions={bookmarkedQuestions}
            onSelectQuestion={handleSelectQuestion}
          />
        </div>

        <div className="rounded-md border border-slate-200 p-4 lg:col-span-2">
          <QuestionDetail
            question={selectedQuestion}
            isBookmarked={
              selectedQuestion
                ? bookmarkedQuestions.includes(selectedQuestion.id)
                : false
            }
            onBookmark={(id) => handleBookmark(id, onBookmarkQuestion)}
          />
        </div>
      </div>
    </div>
  )
}

export default QuestionHistoryTab
