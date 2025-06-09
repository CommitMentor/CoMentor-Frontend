import { fetchCSQuestionList } from '@/api/services/CS/server/queries'
import { CSCard } from '@/components/CS/Card/CSCard'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

const Page = async () => {
  const data = await fetchCSQuestionList(0)
  const today = new Date().toISOString().slice(0, 10)

  const todayGroup = data.result.content.find((g) => g.date === today)
  const pastGroup = data.result.content
    .filter((g) => g.date !== today)
    .sort((a, b) => (a.date < b.date ? 1 : -1))[0]

  return (
    <main className="flex flex-grow flex-col items-center gap-10 py-10">
      <section className="flex w-[880px] flex-col gap-5">
        <p className="text-xl leading-5 font-bold">오늘의 CS 질문</p>
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
          <div className="grid grid-cols-1 justify-center gap-5 md:grid-cols-2">
            {todayGroup.questions.map((q) => (
              <CSCard key={q.csQuestionId} csQuestion={q} />
            ))}
          </div>
        )}
      </section>

      {pastGroup && (
        <section className="flex flex-col gap-5">
          <Link
            href="/history"
            className="flex cursor-pointer items-center gap-1"
          >
            <p className="text-xl leading-5 font-bold">날짜별 질문 내역 조회</p>
            <ChevronRight size={24} />
          </Link>

          <div className="flex flex-col gap-10">
            <div key={pastGroup.date} className="flex flex-col gap-5">
              <p className="text-sm text-slate-400">{pastGroup.date}</p>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {pastGroup.questions.map((q) => (
                  <CSCard key={q.csQuestionId} csQuestion={q} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  )
}

export default Page
