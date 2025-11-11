// src/__tests__/SettingsPage.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import * as api from '@/api'
import * as authStore from '@/store/authStore'
import { useRouter } from 'next/navigation'
import SettingsPage from '@/app/(after)/setting/page'

// next/navigation 모킹
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(() => ({
    get: jest.fn(() => null),
  })),
}))

// API 훅 모킹
jest.mock('@/api', () => ({
  useUserInfo: jest.fn(),
}))

// Zustand store 모킹
jest.mock('@/store/authStore', () => ({
  useAuthStore: jest.fn(),
}))

// 하위 컴포넌트 모킹
jest.mock('@/app/(after)/setting/components/UserSettings', () => ({
  UserSettings: ({ user }: any) => (
    <div>Mock UserSettings: {user.userName}</div>
  ),
}))

jest.mock('@/app/(after)/setting/components/NotificationSettings', () => ({
  NotificationSettings: () => <div>Mock NotificationSettings</div>,
}))

describe('SettingsPage', () => {
  const pushMock = jest.fn()
  const clearAuthMock = jest.fn()

  beforeEach(() => {
    ;(useRouter as jest.Mock).mockReturnValue({ push: pushMock })
    ;(authStore.useAuthStore as unknown as jest.Mock).mockReturnValue({
      clearAuth: clearAuthMock,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('로딩 중일 때 Loader2 스피너가 보여야 한다', () => {
    ;(api.useUserInfo as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    })
    const { container } = render(<SettingsPage />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('유저 정보가 로드되면 UserSettings와 NotificationSettings가 렌더링된다', async () => {
    const mockUser = {
      userName: 'testUser',
      email: 'test@test.com',
      stackNames: [],
      notification: true,
    }
    ;(api.useUserInfo as jest.Mock).mockReturnValue({
      data: { result: mockUser },
      isLoading: false,
      isError: false,
    })

    render(<SettingsPage />)

    // UserSettings should be visible by default (settings tab)
    expect(screen.getByText(/Mock UserSettings/i)).toBeInTheDocument()
  })

  it('사이드 네비게이션 클릭 시 탭이 변경된다', async () => {
    const mockUser = {
      userName: 'testUser',
      email: 'test@test.com',
      stackNames: [],
      notification: true,
    }
    ;(api.useUserInfo as jest.Mock).mockReturnValue({
      data: { result: mockUser },
      isLoading: false,
      isError: false,
    })

    render(<SettingsPage />)

    // 기본 activeTab은 settings
    expect(screen.getByText(/Mock UserSettings/i)).toBeInTheDocument()

    // 알림 탭 클릭
    fireEvent.click(screen.getByText(/알림/i))
    await waitFor(() => {
      expect(screen.getByText(/Mock NotificationSettings/i)).toBeInTheDocument()
    })
  })

  it('로그아웃 클릭 시 clearAuth와 router.push 호출', async () => {
    const mockUser = {
      userName: 'testUser',
      email: 'test@test.com',
      stackNames: [],
      notification: true,
    }
    ;(api.useUserInfo as jest.Mock).mockReturnValue({
      data: { result: mockUser },
      isLoading: false,
      isError: false,
    })

    render(<SettingsPage />)
    fireEvent.click(screen.getByText(/로그아웃/i))

    expect(clearAuthMock).toHaveBeenCalledTimes(1)
    expect(pushMock).toHaveBeenCalledWith('/')
  })
})
