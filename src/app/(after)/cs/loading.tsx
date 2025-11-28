import { SingleCSCardSkeleton } from '@/components/Skeleton/CSCardSkeleton'
import { SkeletonBox } from '@/lib/skeleton-generator'

export default function Loading() {
  return (
    <main className="flex flex-col gap-12 px-4 py-10 sm:px-6 lg:px-8">
      {/* CS 학습 통계 Skeleton */}
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-4">
        <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-2">
            <SkeletonBox width={20} height={20} className="rounded-full" />
            <SkeletonBox width={160} height={28} />
          </div>
          <SkeletonBox width={24} height={24} className="rounded-full" />
        </div>
      </section>

      {/* 오늘의 질문 Skeleton */}
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <SkeletonBox width={192} height={32} />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <SingleCSCardSkeleton key={i} />
          ))}
        </div>
      </section>

      {/* 날짜별 질문 기록 Skeleton */}
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="flex items-center gap-2">
          <SkeletonBox width={224} height={32} />
          <SkeletonBox width={24} height={24} className="rounded-full" />
        </div>

        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-6">
            <SkeletonBox width={96} height={20} />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <SingleCSCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
