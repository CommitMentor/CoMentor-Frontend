'use client'

import { useEffect, useState } from 'react'

export const initMsw = async () => {
  if (
    process.env.NEXT_RUNTIME !== 'nodejs' &&
    process.env.NEXT_PUBLIC_MSW === 'enable'
  ) {
    try {
      // 최신 버전의 setupMSW 호출 (비동기 함수)
      const { setupMSW } = await import('@/api/mocks/worker/browser')
      await setupMSW() // 비동기로 처리
      console.log('MSW 초기화 완료')
      return true
    } catch (error) {
      console.error('MSW 초기화 실패:', error)
      return false
    }
  }
  return false
}

export const MSWComponent = ({ children }: { children: React.ReactNode }) => {
  const [mswReady, setMswReady] = useState(false)

  useEffect(() => {
    const init = async () => {
      const success = await initMsw()
      setMswReady(success || !process.env.NEXT_PUBLIC_MSW)
    }

    init()
  }, [])

  // MSW 초기화 중에는 앱 로드 지연
  if (process.env.NEXT_PUBLIC_MSW === 'enable' && !mswReady) {
    return <div className="p-4 text-center">MSW 초기화 중...</div>
  }

  return <>{children}</>
}
