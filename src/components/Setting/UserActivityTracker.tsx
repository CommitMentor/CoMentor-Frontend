'use client'

import { useEffect, useRef } from 'react'
import { useUserActivity } from '@/api'
import { useAuthStore } from '@/store/authStore'

const UserActivityTracker = () => {
  const { mutate } = useUserActivity()
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)

  useEffect(() => {
    if (!isLoggedIn) return

    // 활동 기록 전송
    const sendActivity = () => {
      mutate()
    }

    // 탭 활성화 시 interval 시작
    const startInterval = () => {
      intervalRef.current = setInterval(sendActivity, 5 * 60 * 1000)
    }

    // interval 중단
    const clearIntervalIfExists = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    // 창 종료 또는 새로고침 시 활동 기록 전송 (mutate는 비동기이므로 성공 보장X)
    const handleBeforeUnload = () => {
      sendActivity()
    }

    // 탭 비활성화 시 interval 중단
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        startInterval()
      } else {
        clearIntervalIfExists()
      }
    }

    // 초기에 탭이 보이면 시작
    if (document.visibilityState === 'visible') {
      startInterval()
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      clearIntervalIfExists()
    }
  }, [mutate, isLoggedIn])

  return null
}

export default UserActivityTracker
