'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { handleAuthCallback } from './handleAuthCallback'

const AuthCallback = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthCallbackContent />
    </Suspense>
  )
}

const AuthCallbackContent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setAccessToken, setRole, setRefreshToken, setGithubAccessToken } =
    useAuthStore()

  useEffect(() => {
    handleAuthCallback({
      searchParams,
      setAccessToken,
      setRefreshToken,
      setGithubAccessToken,
      setRole,
      routerReplace: router.replace,
    })
  }, [
    searchParams,
    router,
    setAccessToken,
    setRefreshToken,
    setGithubAccessToken,
    setRole,
  ])

  return null
}

export default AuthCallback
