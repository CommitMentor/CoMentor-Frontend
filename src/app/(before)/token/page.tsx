'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

const AuthCallback = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthCallbackContent />
    </Suspense>
  )
}

export interface AuthCallbackDeps {
  searchParams: { get: (k: string) => string | null }
  env?: string | undefined
  setAccessToken: (t: string) => void
  setRefreshToken: (t: string) => void
  setGithubAccessToken: (t: string) => void
  setRole: (r: 'GUEST' | 'USER' | 'WITHDRAWN') => void
  routerReplace: (path: string) => void
}

export const handleAuthCallback = (deps: AuthCallbackDeps) => {
  const {
    searchParams,
    env = process.env.NEXT_PUBLIC_ENV || 'dev',
    setAccessToken,
    setRefreshToken,
    setGithubAccessToken,
    setRole,
    routerReplace,
  } = deps

  const role =
    (searchParams.get('role') as 'GUEST' | 'USER' | 'WITHDRAWN') || 'GUEST'

  if (env === 'dev') {
    const access = searchParams.get('accessToken')
    const refresh = searchParams.get('refreshToken')
    const githubAccess = searchParams.get('githubAccessToken')

    if (access && refresh && githubAccess) {
      setAccessToken(access)
      setRefreshToken(refresh)
      setGithubAccessToken(githubAccess)
      setRole(role)

      routerReplace(role === 'USER' ? '/dashboard' : '/signup')
    }
  } else {
    setRole(role)
    routerReplace(role === 'USER' ? '/dashboard' : '/signup')
  }
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
