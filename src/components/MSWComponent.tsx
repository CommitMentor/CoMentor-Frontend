'use client'

import { useEffect, useState } from 'react'

const MSWComponent = () => {
  const [mswInitialized, setMswInitialized] = useState(false)

  useEffect(() => {
    const initializeMSW = async () => {
      // MSW가 활성화되어 있는지 확인
      if (process.env.NEXT_PUBLIC_MSW === 'enable') {
        try {
          // 모듈 동적 임포트
          const { setupMSW } = await import('@/api/mocks/worker/browser')
          // MSW 초기화 (비동기 함수)
          await setupMSW()

          console.log('MSW 초기화 완료')
          setMswInitialized(true)
        } catch (error) {
          console.error('MSW 초기화 실패:', error)
        }
      }
    }

    initializeMSW()
  }, [])

  // 렌더링 없음
  return null
}

export default MSWComponent
