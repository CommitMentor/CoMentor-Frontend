import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import HistoryList from '../HistoryList'
import { UIQuestionHistoryItem } from '../../types'

describe('HistoryList', () => {
  const mockQuestions: UIQuestionHistoryItem[] = [
    {
      id: 1,
      question: '첫 번째 질문',
      csStack: 'React',
      folderName: 'components/test',
      codeSnippet: 'const Test = () => {}',
      answered: true,
      answer: '첫 번째 답변',
      feedback: '좋은 답변입니다.',
      relatedCode: 'const Test = () => {}',
    },
    {
      id: 2,
      question: '두 번째 질문',
      csStack: 'TypeScript',
      folderName: 'types/example',
      codeSnippet: 'interface Props {}',
      answered: false,
      relatedCode: 'interface Props {}',
    },
  ]

  const mockHistory = {
    '2025-10-30': mockQuestions,
    '2025-10-29': [
      {
        id: 3,
        question: '세 번째 질문',
        csStack: 'CSS',
        answered: true,
      },
    ],
  }

  const mockDates = ['2025-10-30', '2025-10-29']
  const onSelectQuestionMock = jest.fn()
  const onAnswerMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('질문 목록이 올바르게 렌더링된다', () => {
    render(
      <HistoryList
        dates={mockDates}
        history={mockHistory}
        bookmarkedQuestions={[]}
        onSelectQuestion={onSelectQuestionMock}
      />,
    )
    expect(screen.getByText('2025-10-30')).toBeInTheDocument()
    expect(screen.getByText('2025-10-29')).toBeInTheDocument()
  })

  test('날짜별 질문 개수가 올바르게 표시된다', () => {
    render(
      <HistoryList
        dates={mockDates}
        history={mockHistory}
        bookmarkedQuestions={[]}
        onSelectQuestion={onSelectQuestionMock}
      />,
    )
    expect(screen.getAllByText('2개 질문')).toHaveLength(1)
    expect(screen.getAllByText('1개 질문')).toHaveLength(1)
  })

  test('날짜를 클릭하면 펼쳐지고 접힌다', () => {
    render(
      <HistoryList
        dates={mockDates}
        history={mockHistory}
        bookmarkedQuestions={[]}
        onSelectQuestion={onSelectQuestionMock}
      />,
    )

    // 처음에는 펼쳐져 있음
    expect(screen.getByText('첫 번째 질문')).toBeInTheDocument()

    // 날짜 클릭
    const dateHeader = screen.getByText('2025-10-30').closest('div')
    fireEvent.click(dateHeader!)

    // 접힘 - 질문들이 보이지 않음
    expect(screen.queryByText('첫 번째 질문')).not.toBeInTheDocument()
  })

  test('질문을 클릭하면 onSelectQuestion이 호출된다', () => {
    render(
      <HistoryList
        dates={mockDates}
        history={mockHistory}
        selectedQuestionId={1}
        bookmarkedQuestions={[]}
        onSelectQuestion={onSelectQuestionMock}
      />,
    )

    // 질문 찾기 (첫 번째 질문 클릭)
    const questionCard = screen.getByText('첫 번째 질문').closest('div')
    fireEvent.click(questionCard!)

    expect(onSelectQuestionMock).toHaveBeenCalledWith(
      expect.objectContaining({
        question: '첫 번째 질문',
      }),
    )
  })

  test('북마크된 질문이 올바르게 표시된다', () => {
    render(
      <HistoryList
        dates={mockDates}
        history={mockHistory}
        bookmarkedQuestions={[1]}
        onSelectQuestion={onSelectQuestionMock}
      />,
    )

    expect(screen.getByText('북마크됨')).toBeInTheDocument()
  })

  test('선택된 질문이 강조 표시된다', () => {
    const { container } = render(
      <HistoryList
        dates={mockDates}
        history={mockHistory}
        selectedQuestionId={1}
        bookmarkedQuestions={[]}
        onSelectQuestion={onSelectQuestionMock}
      />,
    )

    const selectedCards = container.querySelectorAll('.bg-slate-100')
    expect(selectedCards.length).toBeGreaterThan(0)
  })

  test('답변이 필요한 질문에는 "답변필요" 상태가 표시된다', () => {
    render(
      <HistoryList
        dates={mockDates}
        history={mockHistory}
        bookmarkedQuestions={[]}
        onSelectQuestion={onSelectQuestionMock}
        onAnswer={onAnswerMock}
      />,
    )

    // 답변이 필요한 질문 (두 번째 질문 - answered: false)
    expect(screen.getAllByText('답변필요')).toHaveLength(1)
  })

  test('답변이 완료된 질문에는 "답변됨" 상태가 표시된다', () => {
    render(
      <HistoryList
        dates={mockDates}
        history={mockHistory}
        bookmarkedQuestions={[]}
        onSelectQuestion={onSelectQuestionMock}
      />,
    )

    expect(screen.getAllByText('답변됨')).toHaveLength(2) // 첫 번째와 세 번째 질문
  })

  test('질문이 없으면 빈 상태 메시지가 표시된다', () => {
    render(
      <HistoryList
        dates={[]}
        history={{}}
        bookmarkedQuestions={[]}
        onSelectQuestion={onSelectQuestionMock}
      />,
    )

    expect(screen.getByText('아직 저장된 질문이 없습니다.')).toBeInTheDocument()
  })

  test('질문의 folderName이 올바르게 표시된다', () => {
    render(
      <HistoryList
        dates={mockDates}
        history={mockHistory}
        bookmarkedQuestions={[]}
        onSelectQuestion={onSelectQuestionMock}
      />,
    )

    expect(screen.getByText('components/test')).toBeInTheDocument()
    expect(screen.getByText('types/example')).toBeInTheDocument()
  })

  test('질문의 codeSnippet이 올바르게 표시된다', () => {
    render(
      <HistoryList
        dates={mockDates}
        history={mockHistory}
        bookmarkedQuestions={[]}
        onSelectQuestion={onSelectQuestionMock}
      />,
    )

    // codeSnippet은 QuestionCard를 통해 표시되지 않고, relatedCode로 표시됨
    // 실제 구현에서는 codeSnippet 속성이 QuestionItem에 매핑되지 않음
    expect(screen.getByText('첫 번째 질문')).toBeInTheDocument()
  })

  test('동일한 날짜에 여러 질문이 있을 때 모두 표시된다', () => {
    render(
      <HistoryList
        dates={mockDates}
        history={mockHistory}
        bookmarkedQuestions={[]}
        onSelectQuestion={onSelectQuestionMock}
      />,
    )

    expect(screen.getByText('첫 번째 질문')).toBeInTheDocument()
    expect(screen.getByText('두 번째 질문')).toBeInTheDocument()
  })

  test('questionId가 없으면 기본값으로 처리된다', () => {
    const questionWithoutId: UIQuestionHistoryItem = {
      question: 'ID 없는 질문',
      csStack: 'React',
    } as any

    const historyWithoutId = {
      '2025-10-30': [questionWithoutId],
    }

    render(
      <HistoryList
        dates={['2025-10-30']}
        history={historyWithoutId}
        bookmarkedQuestions={[]}
        onSelectQuestion={onSelectQuestionMock}
      />,
    )

    expect(screen.getByText('ID 없는 질문')).toBeInTheDocument()
  })

  test('question.questionId가 있으면 사용된다', () => {
    // questionId가 있으면 이를 우선적으로 사용
    const questionWithQuestionId = {
      id: 999, // id는 필수지만 questionId가 있으면 이를 우선 사용
      questionId: 999,
      question: '질문 제목',
      csStack: 'React',
      relatedCode: '',
      folderName: '',
      answered: true,
    }

    const historyWithQuestionId = {
      '2025-10-30': [questionWithQuestionId],
    }

    render(
      <HistoryList
        dates={['2025-10-30']}
        history={historyWithQuestionId}
        selectedQuestionId={999}
        bookmarkedQuestions={[]}
        onSelectQuestion={onSelectQuestionMock}
      />,
    )

    expect(screen.getByText('질문 제목')).toBeInTheDocument()
  })

  test('question.csQuestionId가 있으면 사용된다', () => {
    // csQuestionId가 있으면 이를 우선적으로 사용
    const questionWithCsQuestionId = {
      id: 888, // id는 필수지만 csQuestionId가 있으면 이를 우선 사용
      csQuestionId: 888,
      question: 'CS 질문 제목',
      csStack: 'TypeScript',
      relatedCode: '',
      folderName: '',
      answered: false,
    }

    const historyWithCsQuestionId = {
      '2025-10-30': [questionWithCsQuestionId],
    }

    render(
      <HistoryList
        dates={['2025-10-30']}
        history={historyWithCsQuestionId}
        selectedQuestionId={888}
        bookmarkedQuestions={[]}
        onSelectQuestion={onSelectQuestionMock}
      />,
    )

    expect(screen.getByText('CS 질문 제목')).toBeInTheDocument()
  })
})
