import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import QuestionDetail from '../QuestionDetail'
import { UIQuestionHistoryItem } from '../../types'

// 필요한 컴포넌트 및 훅 모킹
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, ...props }: any) => (
    <button onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  ),
}))

jest.mock('@/components/ui/textarea', () => ({
  Textarea: ({ value, onChange, placeholder, disabled, ...props }: any) => (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      {...props}
    />
  ),
}))

jest.mock('@/components/ui/MarkdownRenderer', () => ({
  MarkdownRenderer: ({ content }: any) => <div>{content}</div>,
}))

jest.mock('@/hooks/useBookmarkHandler', () => ({
  useBookmarkHandler: () => ({
    handleBookmarkClick: jest.fn(),
  }),
}))

describe('QuestionDetail', () => {
  const mockQuestion: UIQuestionHistoryItem = {
    id: 1,
    question: '테스트 질문 내용',
    csStack: 'React',
    folderName: 'components/test',
    relatedCode: 'const Test = () => {}',
    answered: false,
    answer: '',
    feedback: '',
    codeSnippet: '',
  }

  const mockQuestionWithAnswer: UIQuestionHistoryItem = {
    id: 2,
    question: '답변이 있는 질문',
    csStack: 'TypeScript',
    folderName: 'types/example',
    relatedCode: 'interface Props {}',
    answered: true,
    answer: '답변 내용입니다',
    feedback: '좋은 답변입니다.',
    codeSnippet: 'interface Props {}',
  }

  const onBookmarkMock = jest.fn()
  const onAnswerMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('질문이 없으면 빈 상태 메시지가 표시된다', () => {
    render(<QuestionDetail question={null} onBookmark={onBookmarkMock} />)
    expect(
      screen.getByText('왼쪽에서 질문을 선택해주세요.'),
    ).toBeInTheDocument()
  })

  test('질문 내용이 올바르게 렌더링된다', () => {
    render(
      <QuestionDetail question={mockQuestion} onBookmark={onBookmarkMock} />,
    )
    expect(screen.getByText('테스트 질문 내용')).toBeInTheDocument()
  })

  test('folderName이 있으면 표시된다', () => {
    render(
      <QuestionDetail question={mockQuestion} onBookmark={onBookmarkMock} />,
    )
    expect(screen.getByText('components/test')).toBeInTheDocument()
  })

  test('folderName이 없으면 표시되지 않는다', () => {
    const questionWithoutFolder = { ...mockQuestion, folderName: undefined }
    render(
      <QuestionDetail
        question={questionWithoutFolder}
        onBookmark={onBookmarkMock}
      />,
    )
    expect(screen.queryByText('components/test')).not.toBeInTheDocument()
  })

  test('relatedCode가 있으면 표시된다', () => {
    render(
      <QuestionDetail question={mockQuestion} onBookmark={onBookmarkMock} />,
    )
    expect(screen.getByText('const Test = () => {}')).toBeInTheDocument()
  })

  test('relatedCode가 없으면 표시되지 않는다', () => {
    const questionWithoutCode = { ...mockQuestion, relatedCode: undefined }
    render(
      <QuestionDetail
        question={questionWithoutCode}
        onBookmark={onBookmarkMock}
      />,
    )
    expect(screen.queryByText('const Test = () => {}')).not.toBeInTheDocument()
  })

  test('답변이 없고 onAnswer가 제공되면 답변 폼이 표시된다', () => {
    render(
      <QuestionDetail
        question={mockQuestion}
        onBookmark={onBookmarkMock}
        onAnswer={onAnswerMock}
      />,
    )
    expect(
      screen.getByPlaceholderText('답변을 작성해 주세요...'),
    ).toBeInTheDocument()
    expect(screen.getByText('답변 제출')).toBeInTheDocument()
  })

  test('답변이 이미 있으면 답변 폼이 표시되지 않는다', () => {
    render(
      <QuestionDetail
        question={mockQuestionWithAnswer}
        onBookmark={onBookmarkMock}
        onAnswer={onAnswerMock}
      />,
    )
    expect(
      screen.queryByPlaceholderText('답변을 작성해 주세요...'),
    ).not.toBeInTheDocument()
    expect(screen.getByText('답변 내용입니다')).toBeInTheDocument()
  })

  test('답변 제출 시 onAnswer가 호출된다', async () => {
    onAnswerMock.mockResolvedValue('피드백 내용')

    render(
      <QuestionDetail
        question={mockQuestion}
        onBookmark={onBookmarkMock}
        onAnswer={onAnswerMock}
      />,
    )

    const textarea = screen.getByPlaceholderText('답변을 작성해 주세요...')
    fireEvent.change(textarea, { target: { value: '내 답변 내용' } })

    const submitButton = screen.getByText('답변 제출')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(onAnswerMock).toHaveBeenCalledWith(mockQuestion, '내 답변 내용')
    })
  })

  test('빈 답변은 제출할 수 없다', () => {
    render(
      <QuestionDetail
        question={mockQuestion}
        onBookmark={onBookmarkMock}
        onAnswer={onAnswerMock}
      />,
    )

    const submitButton = screen.getByText('답변 제출')
    expect(submitButton).toBeDisabled()
  })

  test('답변 제출 중에는 제출 버튼이 비활성화된다', async () => {
    onAnswerMock.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000)),
    )

    render(
      <QuestionDetail
        question={mockQuestion}
        onBookmark={onBookmarkMock}
        onAnswer={onAnswerMock}
      />,
    )

    const textarea = screen.getByPlaceholderText('답변을 작성해 주세요...')
    fireEvent.change(textarea, { target: { value: '내 답변 내용' } })

    const submitButton = screen.getByText('답변 제출')
    fireEvent.click(submitButton)

    // 제출 중 상태 확인
    await waitFor(() => {
      expect(screen.getByText('제출 중...')).toBeInTheDocument()
    })

    expect(submitButton).toBeDisabled()
  })

  test('답변 제출 후 피드백이 표시된다', async () => {
    onAnswerMock.mockResolvedValue('훌륭한 답변입니다!')

    render(
      <QuestionDetail
        question={mockQuestion}
        onBookmark={onBookmarkMock}
        onAnswer={onAnswerMock}
      />,
    )

    const textarea = screen.getByPlaceholderText('답변을 작성해 주세요...')
    fireEvent.change(textarea, { target: { value: '내 답변 내용' } })

    const submitButton = screen.getByText('답변 제출')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('훌륭한 답변입니다!')).toBeInTheDocument()
    })
  })

  test('기존 피드백이 있으면 표시된다', () => {
    render(
      <QuestionDetail
        question={mockQuestionWithAnswer}
        onBookmark={onBookmarkMock}
      />,
    )
    expect(screen.getByText('좋은 답변입니다.')).toBeInTheDocument()
  })

  test('activeCSQuestionIds에 포함된 질문은 경고 메시지를 표시한다', () => {
    const activeQuestion = { ...mockQuestion, id: 1 }
    render(
      <QuestionDetail
        question={activeQuestion}
        onBookmark={onBookmarkMock}
        onAnswer={onAnswerMock}
        activeCSQuestionIds={[1]}
      />,
    )
    expect(
      screen.getByText(/이 질문은 현재 CS 질문 탭에서 답변 중인 질문입니다/i),
    ).toBeInTheDocument()
  })

  test('activeCSQuestionIds에 포함된 질문은 답변 폼이 표시되지 않는다', () => {
    const activeQuestion = { ...mockQuestion, id: 1 }
    render(
      <QuestionDetail
        question={activeQuestion}
        onBookmark={onBookmarkMock}
        onAnswer={onAnswerMock}
        activeCSQuestionIds={[1]}
      />,
    )
    expect(
      screen.queryByPlaceholderText('답변을 작성해 주세요...'),
    ).not.toBeInTheDocument()
  })

  test('답변 제출 실패 시 에러 메시지가 표시된다', async () => {
    onAnswerMock.mockRejectedValue(new Error('네트워크 오류'))

    // console.error를 모킹하여 에러 로그가 출력되지 않도록 함
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

    render(
      <QuestionDetail
        question={mockQuestion}
        onBookmark={onBookmarkMock}
        onAnswer={onAnswerMock}
      />,
    )

    const textarea = screen.getByPlaceholderText('답변을 작성해 주세요...')
    fireEvent.change(textarea, { target: { value: '내 답변 내용' } })

    const submitButton = screen.getByText('답변 제출')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(
        screen.getByText('답변 제출 중 오류가 발생했습니다.'),
      ).toBeInTheDocument()
    })

    consoleErrorSpy.mockRestore()
  })

  test('question.feedback가 있으면 답변 제출 후 보여진다', async () => {
    const questionWithFeedback = { ...mockQuestion, feedback: '기존 피드백' }
    onAnswerMock.mockResolvedValue('')

    render(
      <QuestionDetail
        question={questionWithFeedback}
        onBookmark={onBookmarkMock}
        onAnswer={onAnswerMock}
      />,
    )

    const textarea = screen.getByPlaceholderText('답변을 작성해 주세요...')
    fireEvent.change(textarea, { target: { value: '내 답변 내용' } })

    const submitButton = screen.getByText('답변 제출')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('기존 피드백')).toBeInTheDocument()
    })
  })

  test('질문이 변경되면 상태가 초기화된다', () => {
    const { rerender } = render(
      <QuestionDetail
        question={mockQuestion}
        onBookmark={onBookmarkMock}
        onAnswer={onAnswerMock}
      />,
    )

    const textarea = screen.getByPlaceholderText('답변을 작성해 주세요...')
    fireEvent.change(textarea, { target: { value: '답변 내용' } })

    expect(textarea).toHaveValue('답변 내용')

    // 다른 질문으로 변경
    rerender(
      <QuestionDetail
        question={mockQuestionWithAnswer}
        onBookmark={onBookmarkMock}
        onAnswer={onAnswerMock}
      />,
    )

    // 새 질문에는 답변 폼이 없음 (이미 답변됨)
    expect(
      screen.queryByPlaceholderText('답변을 작성해 주세요...'),
    ).not.toBeInTheDocument()
  })
})
