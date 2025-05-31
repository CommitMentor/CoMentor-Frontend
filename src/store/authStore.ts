import { create } from 'zustand'
import Cookies from 'js-cookie'

type UserRole = 'GUEST' | 'USER' | 'WITHDRAWN'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  githubAccessToken: string | null
  role: UserRole | null
  setAccessToken: (token: string) => void
  setRefreshToken: (token: string) => void
  setGithubAccessToken: (token: string) => void
  setRole: (role: UserRole) => void
  clearAuth: () => void
  isLoggedIn: () => boolean
  hydrate: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: Cookies.get('accessToken') || null,
  refreshToken: Cookies.get('refreshToken') || null,
  githubAccessToken: Cookies.get('githubAccessToken') || null,
  role: (Cookies.get('role') as UserRole) || 'GUEST',

  hydrate: () => {
    const accessToken = Cookies.get('accessToken') || null
    const refreshToken = Cookies.get('refreshToken') || null
    const githubAccessToken = Cookies.get('githubAccessToken') || null
    const role = (Cookies.get('role') as UserRole) || 'GUEST'

    set({
      accessToken,
      refreshToken,
      githubAccessToken,
      role,
    })
  },

  setAccessToken: (token) => {
    Cookies.set('accessToken', token, {
      secure: true,
      sameSite: 'Strict',
      expires: 1 / 24,
    })
    set({ accessToken: token })
  },

  setRefreshToken: (token) => {
    Cookies.set('refreshToken', token, {
      secure: true,
      sameSite: 'Strict',
      expires: 7,
    })
    set({ refreshToken: token })
  },

  setGithubAccessToken: (token) => {
    Cookies.set('githubAccessToken', token, {
      secure: true,
      sameSite: 'Strict',
      expires: 7,
    })
    set({ githubAccessToken: token })
  },

  setRole: (role) => {
    Cookies.set('role', role, { secure: true, sameSite: 'Strict' })
    set({ role })
  },

  clearAuth: () => {
    const env = process.env.NEXT_PUBLIC_ENV
    const cookieOptions =
      env === 'dev' ? undefined : { path: '/', domain: '.comentor.store' }

    Cookies.remove('accessToken', cookieOptions)
    Cookies.remove('refreshToken', cookieOptions)
    Cookies.remove('githubAccessToken', cookieOptions)
    Cookies.remove('role')

    set({
      accessToken: null,
      refreshToken: null,
      githubAccessToken: null,
      role: null,
    })
  },

  isLoggedIn: () => {
    const { accessToken, role } = get()
    return !!accessToken && role === 'USER'
  },
}))
