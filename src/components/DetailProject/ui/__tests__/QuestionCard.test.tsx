import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import QuestionCard from '../QuestionCard'

describe('QuestionCard', () => {
  const mockQuestion = {
    question: '테스트 질문 내용',
    id: 1,
    csStack: 'React',
    folderName: 'components/test',
    codeSnippet: 'const Test = () => {}',
    answered: true,
  }

  const onClickMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('질문 내용이 올바르게 렌더링된다', () => {
    render(<QuestionCard question={mockQuestion} onClick={onClickMock} />)
    expect(screen.getByText('테스트 질문 내용')).toBeInTheDocument()
  })

  test('onClick 콜백이 호출된다', () => {
    render(<QuestionCard question={mockQuestion} onClick={onClickMock} />)
    const card = screen.getByText('테스트 질문 내용').closest('div')
    fireEvent.click(card!)
    expect(onClickMock).toHaveBeenCalledTimes(1)
  })

  test('isSelected가 true일 때 배경색이 변경된다', () => {
    const { container } = render(
      <QuestionCard
        question={mockQuestion}
        isSelected={true}
        onClick={onClickMock}
      />,
    )
    const card = container.querySelector('.bg-slate-100')
    expect(card).toBeInTheDocument()
  })

  test('isSelected가 false일 때 hover 스타일이 적용된다', () => {
    const { container } = render(
      <QuestionCard
        question={mockQuestion}
        isSelected={false}
        onClick={onClickMock}
      />,
    )
    const card = container.querySelector('.hover\\:bg-slate-50')
    expect(card).toBeInTheDocument()
  })

  test('isBookmarked가 true일 때 북마크 뱃지가 표시된다', () => {
    render(
      <QuestionCard
        question={mockQuestion}
        isBookmarked={true}
        onClick={onClickMock}
      />,
    )
    expect(screen.getByText('북마크됨')).toBeInTheDocument()
  })

  test('isBookmarked가 false일 때 북마크 뱃지가 표시되지 않는다', () => {
    render(
      <QuestionCard
        question={mockQuestion}
        isBookmarked={false}
        onClick={onClickMock}
      />,
    )
    expect(screen.queryByText('북마크됨')).not.toBeInTheDocument()
  })

  test('folderName이 제공되면 표시된다', () => {
    render(<QuestionCard question={mockQuestion} onClick={onClickMock} />)
    expect(screen.getByText('components/test')).toBeInTheDocument()
  })

  test('folderName이 없으면 표시되지 않는다', () => {
    const questionWithoutFolder = { ...mockQuestion, folderName: undefined }
    render(
      <QuestionCard question={questionWithoutFolder} onClick={onClickMock} />,
    )
    expect(screen.queryByText('components/test')).not.toBeInTheDocument()
  })

  test('codeSnippet이 제공되면 표시된다', () => {
    render(<QuestionCard question={mockQuestion} onClick={onClickMock} />)
    expect(screen.getByText('const Test = () => {}')).toBeInTheDocument()
  })

  test('codeSnippet이 없으면 표시되지 않는다', () => {
    const questionWithoutSnippet = { ...mockQuestion, codeSnippet: undefined }
    render(
      <QuestionCard question={questionWithoutSnippet} onClick={onClickMock} />,
    )
    expect(screen.queryByText('const Test = () => {}')).not.toBeInTheDocument()
  })

  test('answered가 true이고 statusText가 없으면 "답변됨"이 표시된다', () => {
    render(<QuestionCard question={mockQuestion} onClick={onClickMock} />)
    expect(screen.getByText('답변됨')).toBeInTheDocument()
  })

  test('answered가 false이고 statusText가 없으면 상태 텍스트가 표시되지 않는다', () => {
    const unansweredQuestion = { ...mockQuestion, answered: false }
    render(<QuestionCard question={unansweredQuestion} onClick={onClickMock} />)
    expect(screen.queryByText('답변됨')).not.toBeInTheDocument()
  })

  test('statusText가 제공되면 해당 텍스트가 표시된다', () => {
    render(
      <QuestionCard
        question={mockQuestion}
        statusText="커스텀 상태"
        onClick={onClickMock}
      />,
    )
    expect(screen.getByText('커스텀 상태')).toBeInTheDocument()
  })

  test('statusText가 있으면 answered보다 우선한다', () => {
    render(
      <QuestionCard
        question={mockQuestion}
        statusText="커스텀 상태"
        onClick={onClickMock}
      />,
    )
    expect(screen.getByText('커스텀 상태')).toBeInTheDocument()
    expect(screen.queryByText('답변됨')).not.toBeInTheDocument()
  })

  test('기본 statusColor는 green이다', () => {
    const { container } = render(
      <QuestionCard question={mockQuestion} onClick={onClickMock} />,
    )
    const statusBadge = screen.getByText('답변됨')
    expect(statusBadge).toHaveClass('bg-green-100', 'text-green-600')
  })

  test('statusColor가 yellow일 때 올바른 스타일이 적용된다', () => {
    render(
      <QuestionCard
        question={mockQuestion}
        statusColor="yellow"
        statusText="대기 중"
        onClick={onClickMock}
      />,
    )
    const statusBadge = screen.getByText('대기 중')
    expect(statusBadge).toHaveClass('bg-yellow-100', 'text-yellow-600')
  })

  test('statusColor가 red일 때 올바른 스타일이 적용된다', () => {
    render(
      <QuestionCard
        question={mockQuestion}
        statusColor="red"
        statusText="오류"
        onClick={onClickMock}
      />,
    )
    const statusBadge = screen.getByText('오류')
    expect(statusBadge).toHaveClass('bg-red-100', 'text-red-600')
  })

  test('statusColor가 blue일 때 올바른 스타일이 적용된다', () => {
    render(
      <QuestionCard
        question={mockQuestion}
        statusColor="blue"
        statusText="진행 중"
        onClick={onClickMock}
      />,
    )
    const statusBadge = screen.getByText('진행 중')
    expect(statusBadge).toHaveClass('bg-blue-100', 'text-blue-600')
  })

  test('모든 props가 제공되면 모두 렌더링된다', () => {
    render(
      <QuestionCard
        question={mockQuestion}
        isSelected={true}
        isBookmarked={true}
        statusText="완료"
        statusColor="green"
        onClick={onClickMock}
      />,
    )
    expect(screen.getByText('테스트 질문 내용')).toBeInTheDocument()
    expect(screen.getByText('북마크됨')).toBeInTheDocument()
    expect(screen.getByText('components/test')).toBeInTheDocument()
    expect(screen.getByText('const Test = () => {}')).toBeInTheDocument()
    expect(screen.getByText('완료')).toBeInTheDocument()
  })
})
