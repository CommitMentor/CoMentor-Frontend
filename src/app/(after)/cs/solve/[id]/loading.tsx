import { ContentCard } from '@/components/CS/Solve/ContentCard'
import { generateSkeleton, SkeletonBox } from '@/lib/skeleton-generator'

const SkeletonContentCard = generateSkeleton(ContentCard)

export default function Loading() {
  return (
    <main className="flex w-full flex-col items-center justify-center gap-5 px-4 py-6 sm:px-6 md:px-8 md:py-8">
      {/* Header Skeleton */}
      <div className="flex w-full max-w-4xl items-center justify-between">
        <SkeletonBox width={128} height={32} className="sm:h-9 sm:w-40" />
        <SkeletonBox width={40} height={40} className="rounded-md" />
      </div>

      {/* Tabs Skeleton */}
      <div className="flex w-full max-w-4xl flex-col gap-5">
        <SkeletonBox width="100%" height={40} className="rounded-md" />

        {/* Content Card Skeleton (Question) */}
        <SkeletonContentCard
          title="질문"
          stack={<SkeletonBox width={80} height={24} className="rounded-3xl" />}
        >
          <div className="flex flex-col gap-2 py-2">
            <SkeletonBox width="100%" height={20} />
            <SkeletonBox width="75%" height={20} />
          </div>
        </SkeletonContentCard>

        {/* Content Card Skeleton (Answer Area) */}
        <SkeletonContentCard title="답변">
          <SkeletonBox width="100%" height={200} className="rounded-md" />
        </SkeletonContentCard>

        {/* Buttons Skeleton */}
        <div className="flex justify-end gap-2">
          <SkeletonBox width={96} height={40} className="rounded-md" />
          <SkeletonBox width={96} height={40} className="rounded-md" />
        </div>
      </div>
    </main>
  )
}
