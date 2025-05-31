'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import { useRefreshAccessToken } from '@/api'

const AutoRefreshToken = () => {
  const {
    accessToken,
    refreshToken,
    role,
    setAccessToken,
    clearAuth,
    hydrate,
  } = useAuthStore()
  const router = useRouter()

  const { mutate: refreshTokenMutate } = useRefreshAccessToken()

  useEffect(() => {
    hydrate()

    const shouldTryRefresh = !accessToken && !!refreshToken && role !== 'GUEST'

    if (!shouldTryRefresh) return

    refreshTokenMutate(undefined, {
      onSuccess: (data) => {
        if (data.result) {
          setAccessToken(data.result)
        } else {
          clearAuth()
          router.replace('/')
        }
      },
      onError: () => {
        clearAuth()
        router.replace('/')
      },
    })
  }, [
    accessToken,
    refreshToken,
    role,
    refreshTokenMutate,
    setAccessToken,
    clearAuth,
    router,
    hydrate,
  ])

  return null
}

export default AutoRefreshToken
