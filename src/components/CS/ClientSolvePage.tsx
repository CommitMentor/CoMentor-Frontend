'use client'

import { Button } from '@/components/ui/button'
import { BookmarkIcon } from 'lucide-react'
import { useBookmarkHandler } from '@/hooks/useBookmarkHandler'
import { CSQuestionDetail, useGetCSQuestionDetail } from '@/api'
import { CSSolve } from './Solve'

interface ClientSolvePageProps {
  question: CSQuestionDetail
}

export const ClientSolvePage = ({ question }: ClientSolvePageProps) => {
  const { handleBookmarkClick } = useBookmarkHandler()
  const { refetch } = useGetCSQuestionDetail(question.csQuestionId)

  const isBookmarked = !!question.fileName

  return (
    <main className="flex flex-col items-center justify-center gap-5 px-40 py-5">
      <div className="flex w-[800px] justify-between">
        <h3 className="text-2xl font-bold">CS 연습</h3>
        <Button
          variant="ghost"
          aria-label={isBookmarked ? '북마크 제거' : '북마크 추가'}
          aria-pressed={isBookmarked}
          className="cursor-pointer"
          onClick={() =>
            handleBookmarkClick({
              csQuestionId: question.csQuestionId,
              fileName: question.fileName,
              isBookmarked,
              refetchKeys: [['cs-question', question.csQuestionId.toString()]],
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

      <CSSolve question={question} refetch={refetch} />
    </main>
  )
}
