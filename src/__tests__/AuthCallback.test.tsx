import React from 'react'
import { render } from '@testing-library/react'
import { waitFor } from '@testing-library/dom'

// We'll provide mutable mocks referenced by the mocked modules so tests can
// change behavior per-case without re-mocking the whole module each time.
let replaceMock: jest.Mock = jest.fn()
let searchParamsMap: Record<string, string | null> = {}

let setAccessToken: jest.Mock = jest.fn()
let setRefreshToken: jest.Mock = jest.fn()
let setGithubAccessToken: jest.Mock = jest.fn()
let setRole: jest.Mock = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: (...args: any[]) => replaceMock(...args),
  }),
  useSearchParams: () => ({
    get: (k: string) => searchParamsMap[k] ?? null,
  }),
}))

jest.mock('@/store/authStore', () => ({
  useAuthStore: () => ({
    setAccessToken: (...args: any[]) => setAccessToken(...args),
    setRefreshToken: (...args: any[]) => setRefreshToken(...args),
    setGithubAccessToken: (...args: any[]) => setGithubAccessToken(...args),
    setRole: (...args: any[]) => setRole(...args),
  }),
}))

describe('AuthCallback page', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()

    // reset mocks and maps
    replaceMock = jest.fn()
    searchParamsMap = {}

    setAccessToken = jest.fn()
    setRefreshToken = jest.fn()
    setGithubAccessToken = jest.fn()
    setRole = jest.fn()
  })

  it('개발 환경에서 토큰이 있으면 토큰과 역할을 설정하고 /dashboard로 리다이렉트한다', async () => {
    process.env.NEXT_PUBLIC_ENV = 'dev'

    searchParamsMap = {
      accessToken: 'ACCESS',
      refreshToken: 'REFRESH',
      githubAccessToken: 'GITHUB',
      role: 'USER',
    }

    const { handleAuthCallback } = require('@/app/(before)/token/page')

    handleAuthCallback({
      searchParams: { get: (k: string) => searchParamsMap[k] ?? null },
      env: 'dev',
      setAccessToken,
      setRefreshToken,
      setGithubAccessToken,
      setRole,
      routerReplace: replaceMock,
    })

    expect(setAccessToken).toHaveBeenCalledWith('ACCESS')
    expect(setRefreshToken).toHaveBeenCalledWith('REFRESH')
    expect(setGithubAccessToken).toHaveBeenCalledWith('GITHUB')
    expect(setRole).toHaveBeenCalledWith('USER')
    expect(replaceMock).toHaveBeenCalledWith('/dashboard')
  })

  it('개발 환경에서 토큰이 없으면 토큰을 설정하지 않고 리다이렉트하지 않는다', async () => {
    process.env.NEXT_PUBLIC_ENV = 'dev'

    searchParamsMap = {}

    const { handleAuthCallback } = require('@/app/(before)/token/page')

    handleAuthCallback({
      searchParams: { get: (k: string) => searchParamsMap[k] ?? null },
      env: 'dev',
      setAccessToken,
      setRefreshToken,
      setGithubAccessToken,
      setRole,
      routerReplace: replaceMock,
    })

    expect(setAccessToken).not.toHaveBeenCalled()
    expect(setRefreshToken).not.toHaveBeenCalled()
    expect(setGithubAccessToken).not.toHaveBeenCalled()
    expect(replaceMock).not.toHaveBeenCalled()
  })

  it('개발 환경이 아니면 토큰을 읽지 않고 역할을 설정하고 리다이렉트한다', async () => {
    process.env.NEXT_PUBLIC_ENV = 'prod'

    searchParamsMap = { role: 'USER' }

    const { handleAuthCallback } = require('@/app/(before)/token/page')

    handleAuthCallback({
      searchParams: { get: (k: string) => searchParamsMap[k] ?? null },
      env: 'prod',
      setAccessToken,
      setRefreshToken,
      setGithubAccessToken,
      setRole,
      routerReplace: replaceMock,
    })

    expect(setRole).toHaveBeenCalledWith('USER')
    expect(replaceMock).toHaveBeenCalledWith('/dashboard')
    expect(setAccessToken).not.toHaveBeenCalled()
    expect(setRefreshToken).not.toHaveBeenCalled()
    expect(setGithubAccessToken).not.toHaveBeenCalled()
  })
})
