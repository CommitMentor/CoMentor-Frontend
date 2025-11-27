'use client'

import { useEffect } from 'react'
import { Bell, CircleHelp, Info, Sparkle, type LucideIcon } from 'lucide-react'
import { useNotificationStore } from '@/store/notificationStore'
import { NotificationPermissionButton } from '@/components/Notification/Permission/Button'
import { NotificationPermissionMessage } from '@/components/Notification/Permission/Message'

interface SettingsCardProps {
  icon: React.ReactElement<LucideIcon>
  title: string
  description: string
  right?: React.ReactNode
}

const SettingsCard = ({
  icon,
  title,
  description,
  right,
}: SettingsCardProps) => (
  <div className="flex items-center gap-4 rounded-xl border border-slate-100 p-7 shadow hover:bg-gray-50 hover:transition-colors">
    <div className="rounded-full bg-slate-200 p-1 text-slate-500">{icon}</div>
    <div className="grow">
      <h4 className="text-sm font-medium">{title}</h4>
      <p className="text-[12px] text-slate-600">{description}</p>
    </div>
    {right && <div>{right}</div>}
  </div>
)

export const NotificationSettings = () => {
  const { setPermission } = useNotificationStore.getState()

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission)
    }
  }, [setPermission])

  return (
    <div className="flex h-full flex-col gap-8 px-4">
      <div className="flex flex-col gap-4">
        <h3 className="text-base font-semibold sm:text-lg">푸시 알림 권한</h3>
        <SettingsCard
          icon={<Bell size={24} />}
          title="브라우저 알림"
          description="브라우저에서 푸시 알림을 받을 수 있도록 허용합니다."
          right={<NotificationPermissionButton />}
        />
        <NotificationPermissionMessage />
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-base font-semibold sm:text-lg">알림 유형</h3>
        <p className="text-sm text-slate-600">
          브라우저 알림을 허용하면 아래 항목 모두에 대한 알림을 받습니다.
        </p>
        <SettingsCard
          icon={<CircleHelp size={24} />}
          title="오늘의 질문"
          description="오늘의 CS 질문 생성 알림을 받습니다."
        />
        <SettingsCard
          icon={<Sparkle size={24} />}
          title="학습 리마인드"
          description="48시간 이상 미학습 시, 학습 리마인드 알림을 받습니다."
        />
      </div>

      <div className="mt-auto flex flex-col gap-2 rounded-md border border-blue-200 bg-blue-50 p-5 text-blue-800">
        <div className="flex items-center gap-2 font-semibold">
          <Info size={18} />
          <p>알림 정보</p>
        </div>
        <ul className="list-inside list-disc pl-2 text-sm">
          <li>오늘의 질문: 매일 오전 10시에 생성된 CS 질문</li>
          <li>학습 리마인드: 48시간 이상 학습하지 않은 경우</li>
        </ul>
      </div>
    </div>
  )
}
