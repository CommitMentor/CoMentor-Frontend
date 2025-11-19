'use client'

import { useState } from 'react'
import { Bell, Loader2, LogOut, Settings, type LucideIcon } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/lib/utils'
import { useUserInfo } from '@/api'
import { UserSettings } from './UserSettings'
import { NotificationSettings } from './NotificationSettings'

type ActiveTab = 'settings' | 'notifications'

// --- 재사용 컴포넌트
interface NavItemProps {
  icon: LucideIcon
  label: string
  onClick?: () => void
  isActive?: boolean
}

const NavItem = ({ icon: Icon, label, onClick, isActive }: NavItemProps) => (
  <div
    className={cn(
      'flex cursor-pointer items-center justify-center gap-2 rounded-3xl px-3 py-2 text-sm transition-colors lg:justify-start lg:px-4 lg:py-3 lg:text-base',
      isActive
        ? 'bg-white text-slate-800 shadow-[inset_0_0_4.8px_0_rgba(0,0,0,0.25)]'
        : 'hover:bg-slate-200',
    )}
    onClick={onClick}
  >
    <Icon size={18} />
    <p>{label}</p>
  </div>
)

const SideNav = ({
  activeTab,
  onTabChange,
  onLogout,
}: {
  activeTab: ActiveTab
  onTabChange: (tab: ActiveTab) => void
  onLogout: () => void
}) => (
  <nav className="flex w-full justify-around p-2 text-slate-600 lg:w-72 lg:flex-col lg:justify-between lg:rounded-xl lg:bg-slate-100 lg:p-3">
    <div className="flex flex-row gap-2 lg:flex-col">
      <NavItem
        icon={Settings}
        label="설정"
        isActive={activeTab === 'settings'}
        onClick={() => onTabChange('settings')}
      />
      <NavItem
        icon={Bell}
        label="알림"
        isActive={activeTab === 'notifications'}
        onClick={() => onTabChange('notifications')}
      />
    </div>
    {/* 로그아웃 버튼 */}
    <div className="flex items-center">
      <NavItem icon={LogOut} label="로그아웃" onClick={onLogout} />
    </div>
  </nav>
)

export default function SettingsView() {
  const router = useRouter()
  const { clearAuth } = useAuthStore()
  const { data: userResponse, isLoading, isError } = useUserInfo()
  const user = userResponse?.result

  const searchParams = useSearchParams()
  const tabFromUrl = searchParams.get('tab')

  const [activeTab, setActiveTab] = useState<ActiveTab>(
    tabFromUrl === 'notifications' ? 'notifications' : 'settings',
  )

  const handleLogout = () => {
    clearAuth()
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 size={32} className="animate-spin text-slate-500" />
      </div>
    )
  }

  if (isError || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center text-red-500">
        사용자 정보를 불러오는 데 실패했습니다.
      </div>
    )
  }

  return (
    <main className="flex h-full flex-col py-3 lg:items-center lg:justify-center">
      <section className="flex w-full grow flex-col lg:max-w-5xl lg:flex-row lg:rounded-xl lg:border lg:border-slate-200 lg:p-3 lg:shadow-md">
        <SideNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLogout={handleLogout}
        />
        <article className="w-full grow p-4 lg:p-4">
          {activeTab === 'settings' && <UserSettings user={user} />}
          {activeTab === 'notifications' && <NotificationSettings />}
        </article>
      </section>
    </main>
  )
}
