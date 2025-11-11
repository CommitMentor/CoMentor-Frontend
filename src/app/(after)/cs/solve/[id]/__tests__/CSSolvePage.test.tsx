import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useBookmarkHandler } from '@/hooks/useBookmarkHandler'
import { useGetCSQuestionDetail } from '@/api'
import { CSQuestionDetail } from '@/api'
import { CSCategory, QuestionStatus, Stack } from '@/api/types/common'
import { ClientSolvePage } from '@/components/CS/ClientSolvePage'

// ✅ Mocking hooks
jest.mock('@/hooks/useBookmarkHandler', () => ({
  useBookmarkHandler: jest.fn(),
}))

jest.mock('@/api', () => ({
  useGetCSQuestionDetail: jest.fn(),
}))

// ✅ Mock CSSolve (자식 컴포넌트)
jest.mock('@/components/CS/Solve', () => ({
  CSSolve: jest.fn(() => <div data-testid="cssolve">CSSolve</div>),
}))

describe('ClientSolvePage', () => {
  const mockQuestion: CSQuestionDetail = {
    csQuestionId: 1,
    fileName: undefined,
    stack: Stack.프론트엔드,
    question: '테스트 질문입니다.',
    answers: [],
    questionStatus: QuestionStatus.TODO,
    csCategory: CSCategory.NETWORKING,
  }

  beforeEach(() => {
    ;(useBookmarkHandler as jest.Mock).mockReturnValue({
      handleBookmarkClick: jest.fn(),
    })
    ;(useGetCSQuestionDetail as jest.Mock).mockReturnValue({
      data: undefined,
      refetch: jest.fn(),
    })
  })

  it('제목과 북마크 버튼, Solve 컴포넌트가 렌더링된다', () => {
    render(<ClientSolvePage question={mockQuestion} />)

    expect(screen.getByText('CS 연습')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByTestId('cssolve')).toBeInTheDocument()
  })

  it('북마크 버튼 클릭 시 handleBookmarkClick이 호출된다', () => {
    const mockHandle = jest.fn()
    ;(useBookmarkHandler as jest.Mock).mockReturnValueOnce({
      handleBookmarkClick: mockHandle,
    })

    render(<ClientSolvePage question={mockQuestion} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(mockHandle).toHaveBeenCalled()
  })
})
