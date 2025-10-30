import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SignupPage from '@/app/(before)/signup/page'
import { SignupForm } from '@/components/User/SignupForm'
import { useUserJoin } from '@/api'

// --- Mocks ---
// next/navigation 모킹
const mockRouterPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
}))

// @/api의 useUserJoin 훅 모킹
const mockMutate = jest.fn()
jest.mock('@/api', () => ({
  // useUserJoin 외에 다른 export가 있다면 ...jest.requireActual('@/api')
  useUserJoin: jest.fn(() => ({
    mutate: mockMutate,
    isPending: false,
  })),
}))

// SignupForm이 실제로 Stack을 import하는 경로를 모킹
jest.mock('@/api/types/common', () => ({
  Stack: {
    React: 'react',
    NextJS: 'nextjs',
    Javascript: 'javascript',
  },
}))

// lucide-react 모킹 (로딩 스피너)
jest.mock('lucide-react', () => ({
  Loader2: () => <div>Loading...</div>,
  CircleIcon: () => <div>Circle</div>,
  CheckIcon: () => <div>Check</div>,
}))

// --- 테스트 시작 ---

describe('SignupPage', () => {
  // 각 테스트 전에 모킹된 함수들 초기화
  beforeEach(() => {
    jest.clearAllMocks()
    // useUserJoin의 기본 반환값 설정
    ;(useUserJoin as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    })
  })

  it('SignupPage는 SignupForm을 렌더링해야 합니다', () => {
    render(<SignupPage />)
    // SignupForm 내부에 있는 "회원가입" 제목으로 폼 렌더링 확인
    expect(
      screen.getByRole('heading', { name: '회원가입' }),
    ).toBeInTheDocument()
  })

  describe('SignupForm', () => {
    it('폼 필드와 비활성화된 제출 버튼이 렌더링되어야 합니다', () => {
      render(<SignupForm />)

      // 제목
      expect(
        screen.getByRole('heading', { name: '회원가입' }),
      ).toBeInTheDocument()

      // 입력 필드
      expect(screen.getByLabelText('이메일')).toBeInTheDocument()
      expect(screen.getByText('기술 스택')).toBeInTheDocument()
      expect(screen.getByLabelText('React')).toBeInTheDocument() // 모킹된 Stack 기반
      expect(screen.getByLabelText('NextJS')).toBeInTheDocument()

      // 라디오 버튼
      expect(screen.getByLabelText('알림 허용')).toBeInTheDocument()
      expect(screen.getByLabelText('알림 거부')).toBeInTheDocument()
      expect(screen.getByLabelText('알림 허용')).toBeChecked() // defaultValues.notification = true

      // 버튼 (초기 상태, 유효성 검사 미통과로 비활성화)
      expect(screen.getByRole('button', { name: '회원 가입' })).toBeDisabled()
    })

    it('유효한 데이터로 폼 제출 시 mutate가 호출되고 대시보드로 이동해야 합니다', async () => {
      // GIVEN: API 성공 시뮬레이션
      mockMutate.mockImplementation((_user, options) => {
        options.onSuccess()
      })

      const user = userEvent.setup()
      render(<SignupForm />)

      // WHEN: 사용자가 폼을 유효하게 채움
      await user.type(screen.getByLabelText('이메일'), 'test@example.com')
      await user.click(screen.getByLabelText('React'))
      await user.click(screen.getByLabelText('알림 거부')) // 기본값 변경 테스트

      // THEN: 버튼이 활성화됨 (Zod 유효성 검사는 비동기일 수 있음)
      await waitFor(() => {
        expect(screen.getByRole('button', { name: '회원 가입' })).toBeEnabled()
      })

      // WHEN: 사용자가 폼 제출
      await user.click(screen.getByRole('button', { name: '회원 가입' }))

      // THEN: mutate 함수가 올바른 데이터와 함께 호출됨
      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalledWith(
          {
            email: 'test@example.com',
            stackNames: ['react'], // 모킹된 Stack의 value
            notification: false, // '알림 거부'의 value
          },
          expect.any(Object), // onSuccess, onError가 담긴 options 객체
        )
      })

      // THEN: 성공 콜백이 실행되어 라우터가 호출됨
      expect(mockRouterPush).toHaveBeenCalledWith('/dashboard')
    })

    it('폼 제출 실패 시 에러가 콘솔에 기록되고 이동하지 않아야 합니다', async () => {
      // GIVEN: API 실패 시뮬레이션
      const mockError = new Error('Signup Failed')
      mockMutate.mockImplementation((_user, options) => {
        options.onError(mockError)
      })
      // console.error 스파이
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {})

      const user = userEvent.setup()
      render(<SignupForm />)

      // WHEN: 사용자가 폼을 유효하게 채움
      await user.type(screen.getByLabelText('이메일'), 'test@example.com')
      await user.click(screen.getByLabelText('NextJS'))

      // THEN: 버튼 활성화
      await waitFor(() => {
        expect(screen.getByRole('button', { name: '회원 가입' })).toBeEnabled()
      })

      // WHEN: 폼 제출
      await user.click(screen.getByRole('button', { name: '회원 가입' }))

      // THEN: mutate 호출됨
      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalled()
      })

      // THEN: 에러가 콘솔에 기록되고 라우팅은 발생하지 않음
      expect(consoleErrorSpy).toHaveBeenCalledWith('회원가입 실패:', mockError)
      expect(mockRouterPush).not.toHaveBeenCalled()

      // 스파이 원상 복구
      consoleErrorSpy.mockRestore()
    })

    it('폼 제출 중(isPending)일 때 로딩 스피너를 표시해야 합니다', () => {
      // GIVEN: API가 로딩 중인 상태로 설정
      ;(useUserJoin as jest.Mock).mockReturnValue({
        mutate: mockMutate,
        isPending: true,
      })

      // WHEN: 컴포넌트 렌더링
      render(<SignupForm />)

      // THEN: 버튼에 "Loading..." 텍스트가 표시됨 (lucide-react 모킹)
      const button = screen.getByRole('button')
      expect(button).toHaveTextContent('Loading...')

      // "회원 가입" 텍스트는 없어야 함
      expect(screen.queryByText('회원 가입')).not.toBeInTheDocument()
    })
  })
})
