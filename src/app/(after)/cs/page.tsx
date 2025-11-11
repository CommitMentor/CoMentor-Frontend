'use client'

import { useGetCSQuestion } from '@/api'
import { CSCard } from '@/components/CS/Card/CSCard'
import { CSCardSkeleton } from '@/components/Skeleton/CSCardSkeleton'
import { ChevronRight, ChartColumn } from 'lucide-react'
import { useRouter } from 'next/navigation'

const Page = () => {
  const { data, isLoading } = useGetCSQuestion(0)
  const router = useRouter()
  const today = new Date().toISOString().slice(0, 10)

  const todayGroup = data?.result.content.find((g) => g.date === today)
  const pastGroup = data?.result.content
    .filter((g) => g.date !== today)
    .sort((a, b) => (a.date < b.date ? 1 : -1))[0]

  return (
    <main className="flex flex-grow flex-col gap-12 px-4 py-10 sm:px-6 lg:px-8">
      {isLoading ? (
        <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <CSCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          {/* ✅ CS 학습 통계 섹션 */}
          <section className="mx-auto flex w-full max-w-5xl flex-col gap-4">
            <div
              className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 p-4 transition-colors hover:bg-slate-50"
              onClick={() => router.push('/cs/stats')}
            >
              <div className="flex items-center gap-2">
                <ChartColumn className="h-5 w-5 text-indigo-500" />
                <p className="text-lg font-semibold sm:text-xl">
                  나의 CS 학습 통계
                </p>
              </div>
              <ChevronRight size={22} className="text-slate-500" />
            </div>
          </section>

          {/* ✅ 오늘의 CS 질문 */}
          <section className="mx-auto flex w-full max-w-5xl flex-col gap-6">
            <p className="text-xl font-bold text-slate-800 sm:text-2xl">
              오늘의 CS 질문
            </p>

            {!todayGroup ? (
              <div className="text-center text-sm text-slate-500">
                아직 오늘의 질문이 생성되지 않았습니다. <br />
                매일 오전 10시에 생성됩니다.
              </div>
            ) : todayGroup.questions.length === 0 ? (
              <div className="text-sm text-slate-500">
                오늘의 질문이 존재하지 않습니다.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {todayGroup.questions.map((q) => (
                  <CSCard key={q.csQuestionId} csQuestion={q} />
                ))}
              </div>
            )}
          </section>

          {/* ✅ 날짜별 질문 내역 */}
          {pastGroup && (
            <section className="mx-auto flex w-full max-w-5xl flex-col gap-6">
              <div
                className="group flex cursor-pointer items-center gap-2"
                onClick={() => router.push('/cs/history')}
              >
                <p className="text-xl font-bold text-slate-800 transition-colors group-hover:text-indigo-600 sm:text-2xl">
                  날짜별 질문 내역 조회
                </p>
                <ChevronRight
                  size={22}
                  className="text-slate-500 group-hover:text-indigo-600"
                />
              </div>

              <div className="flex flex-col gap-10">
                <div key={pastGroup.date} className="flex flex-col gap-6">
                  <p className="text-sm text-slate-400">{pastGroup.date}</p>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {pastGroup.questions.map((q) => (
                      <CSCard key={q.csQuestionId} csQuestion={q} />
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}
        </>
      )}
    </main>
  )
}

export default Page
