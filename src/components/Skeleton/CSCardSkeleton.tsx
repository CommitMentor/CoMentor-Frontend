'use client'

import { SkeletonBox } from '@/lib/skeleton-generator'

export const SingleCSCardSkeleton = () => {
  return (
    <div className="flex h-[170px] w-full flex-col justify-between gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex justify-between">
        <SkeletonBox width={80} height={20} />
        <SkeletonBox width={20} height={20} />
      </div>

      <div className="flex flex-col gap-2">
        <SkeletonBox width="100%" height={20} />
        <SkeletonBox width="80%" height={20} />
      </div>

      <div className="flex justify-between">
        <SkeletonBox width={60} height={20} />
        <SkeletonBox width={80} height={30} />
      </div>
    </div>
  )
}

export const CSCardSkeleton = () => {
  // 카드 2개를 스켈레톤으로 표시
  const placeholders = Array.from({ length: 2 })

  return (
    <div className="flex flex-col gap-5">
      {placeholders.map((_, i) => (
        <SingleCSCardSkeleton key={i} />
      ))}
    </div>
  )
}
