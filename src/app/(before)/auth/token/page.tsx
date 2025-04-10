'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

export default function AuthCallback() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthCallbackContent />
    </Suspense>
  )
}

const AuthCallbackContent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setAccessToken, setRole, setRefreshToken } = useAuthStore()

  const access = searchParams.get('accessToken')
  const refresh = searchParams.get('refreshToken')
  const role =
    (searchParams.get('role') as 'GUEST' | 'USER' | 'WITHDRAWN') || 'GUEST'

  useEffect(() => {
    if (access && refresh) {
      setAccessToken(access)
      setRefreshToken(refresh)
      setRole(role)

      if (role === 'GUEST' || role === 'WITHDRAWN') {
        router.replace('/signup')
      } else if (role === 'USER') {
        router.replace('/dashboard')
      }
    }
  }, [access, refresh, role, router, setRefreshToken])

  return null
}
