'use client'

import { Button } from '@/components/ui/button'
import { BookmarkIcon } from 'lucide-react'
import { useBookmarkHandler } from '@/hooks/useBookmarkHandler'
import { CSQuestionDetail, useGetCSQuestionDetail } from '@/api'
import { CSSolve } from './Solve'
import { useEffect, useState } from 'react'

interface ClientSolvePageProps {
  question: CSQuestionDetail
}

export const ClientSolvePage = ({ question }: ClientSolvePageProps) => {
  const { handleBookmarkClick } = useBookmarkHandler()
  const { data: fetchedData, refetch } = useGetCSQuestionDetail(
    question.csQuestionId,
  )

  const mergedQuestion = fetchedData?.result ?? question
  const [isBookmarked, setIsBookmarked] = useState(!!mergedQuestion.fileName)

  useEffect(() => {
    setIsBookmarked(!!mergedQuestion.fileName)
  }, [mergedQuestion.fileName])

  return (
    // ✅ 전체 페이지 여백을 반응형으로 수정
    <main className="flex w-full flex-col items-center justify-center gap-5 px-4 py-6 sm:px-6 md:px-8 md:py-8">
      {/* ✅ 콘텐츠 너비를 반응형으로 수정 (모바일: full, 데스크탑: max-w-4xl) */}
      <div className="flex w-full max-w-4xl items-center justify-between">
        {/* ✅ 페이지 제목 텍스트 크기를 반응형으로 수정 */}
        <h3 className="text-xl font-bold sm:text-2xl">CS 연습</h3>
        <Button
          variant="ghost"
          aria-label={isBookmarked ? '북마크 제거' : '북마크 추가'}
          aria-pressed={isBookmarked}
          className="cursor-pointer"
          onClick={() =>
            handleBookmarkClick({
              csQuestionId: question.csQuestionId,
              fileName: mergedQuestion.fileName,
              isBookmarked,
              refetchKeys: [['cs-question', question.csQuestionId.toString()]],
              onLocalToggle: (newState) => setIsBookmarked(newState),
            })
          }
        >
          <BookmarkIcon
            size={25}
            className={`${
              isBookmarked
                ? 'fill-yellow-500 text-yellow-500'
                : 'text-yellow-400'
            }`}
          />
        </Button>
      </div>

      <CSSolve question={mergedQuestion} refetch={refetch} />
    </main>
  )
}
