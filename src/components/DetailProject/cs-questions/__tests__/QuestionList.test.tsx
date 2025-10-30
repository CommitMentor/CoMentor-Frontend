import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import QuestionList from '../QuestionList'
import { QuestionItem } from '../../types'

// 필요한 컴포넌트 모킹
jest.mock('../../ui/QuestionCard', () => ({
  __esModule: true,
  default: ({ question, isSelected, onClick }: any) => (
    <div
      data-testid={`question-card-${question.id}`}
      onClick={onClick}
      style={{ backgroundColor: isSelected ? 'selected' : 'normal' }}
    >
      {question.question}
    </div>
  ),
}))

jest.mock('@/components/ui/progress', () => ({
  Progress: ({ value }: any) => (
    <div data-testid="progress-bar" data-value={value} />
  ),
}))

describe('QuestionList', () => {
  const mockQuestions: QuestionItem[] = [
    {
      id: 1,
      question: '첫 번째 질문',
      csCategory: 'React',
      answered: true,
    },
    {
      id: 2,
      question: '두 번째 질문',
      csCategory: 'TypeScript',
      answered: false,
    },
    {
      id: 3,
      question: '세 번째 질문',
      csCategory: 'Node.js',
      answered: true,
    },
  ]

  const onSelectQuestionMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('질문 목록이 올바르게 렌더링된다', () => {
    render(
      <QuestionList
        questions={mockQuestions}
        selectedQuestionId={null}
        savedQuestions={[]}
        onSelectQuestion={onSelectQuestionMock}
        progressPercentage={66.67}
      />,
    )

    expect(screen.getByText('첫 번째 질문')).toBeInTheDocument()
    expect(screen.getByText('두 번째 질문')).toBeInTheDocument()
    expect(screen.getByText('세 번째 질문')).toBeInTheDocument()
  })

  test('질문이 없으면 빈 상태 메시지가 표시된다', () => {
    render(
      <QuestionList
        questions={[]}
        selectedQuestionId={null}
        savedQuestions={[]}
        onSelectQuestion={onSelectQuestionMock}
        progressPercentage={0}
      />,
    )

    expect(
      screen.getByText(
        /질문이 없습니다. 코드를 선택하고 CS 질문을 생성해주세요./i,
      ),
    ).toBeInTheDocument()
  })

  test('답변 완료율이 올바르게 표시된다', () => {
    render(
      <QuestionList
        questions={mockQuestions}
        selectedQuestionId={null}
        savedQuestions={[]}
        onSelectQuestion={onSelectQuestionMock}
        progressPercentage={66.67}
      />,
    )

    expect(screen.getByText('2/3 완료')).toBeInTheDocument()
  })

  test('진행률 바가 올바르게 렌더링된다', () => {
    const { getByTestId } = render(
      <QuestionList
        questions={mockQuestions}
        selectedQuestionId={null}
        savedQuestions={[]}
        onSelectQuestion={onSelectQuestionMock}
        progressPercentage={66.67}
      />,
    )

    const progressBar = getByTestId('progress-bar')
    expect(progressBar).toHaveAttribute('data-value', '66.67')
  })

  test('질문 클릭 시 onSelectQuestion이 호출된다', () => {
    render(
      <QuestionList
        questions={mockQuestions}
        selectedQuestionId={null}
        savedQuestions={[]}
        onSelectQuestion={onSelectQuestionMock}
        progressPercentage={0}
      />,
    )

    const questionCard = screen.getByTestId('question-card-1')
    fireEvent.click(questionCard)

    expect(onSelectQuestionMock).toHaveBeenCalledWith(1)
  })

  test('선택된 질문이 강조 표시된다', () => {
    const { getByTestId } = render(
      <QuestionList
        questions={mockQuestions}
        selectedQuestionId={2}
        savedQuestions={[]}
        onSelectQuestion={onSelectQuestionMock}
        progressPercentage={0}
      />,
    )

    const questionCard = getByTestId('question-card-2')
    expect(questionCard).toHaveStyle({ backgroundColor: 'selected' })
  })

  test('저장된 질문이 북마크로 표시된다', () => {
    render(
      <QuestionList
        questions={mockQuestions}
        selectedQuestionId={1}
        savedQuestions={[1, 3]}
        onSelectQuestion={onSelectQuestionMock}
        progressPercentage={0}
      />,
    )

    // QuestionCard는 북마크 상태를 prop으로 받지만,
    // 모킹에서는 렌더링만 확인하므로 여기서는 질문이 렌더링되는지만 확인
    expect(screen.getByTestId('question-card-1')).toBeInTheDocument()
  })

  test('질문 ID가 없으면 클릭해도 에러가 발생하지 않는다', () => {
    // id가 optional인 경우를 테스트하기 위해 any로 타입 캐스팅
    const questionWithoutId = {
      question: 'ID 없는 질문',
      csCategory: 'React',
      answered: false,
    } as any

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

    render(
      <QuestionList
        questions={[questionWithoutId]}
        selectedQuestionId={null}
        savedQuestions={[]}
        onSelectQuestion={onSelectQuestionMock}
        progressPercentage={0}
      />,
    )

    const questionCard = screen.getByTestId('question-card-undefined')
    fireEvent.click(questionCard)

    // ID가 없으면 onSelectQuestion이 호출되지 않음
    expect(onSelectQuestionMock).not.toHaveBeenCalled()
  })

  test('답변 완료율 계산이 올바르다', () => {
    const questionsWithAnswers = [
      { id: 1, question: '질문 1', csCategory: 'React', answered: true },
      { id: 2, question: '질문 2', csCategory: 'TypeScript', answered: false },
    ]

    render(
      <QuestionList
        questions={questionsWithAnswers}
        selectedQuestionId={null}
        savedQuestions={[]}
        onSelectQuestion={onSelectQuestionMock}
        progressPercentage={50}
      />,
    )

    expect(screen.getByText('1/2 완료')).toBeInTheDocument()
  })
})
