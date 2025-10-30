import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { DetailProject } from '../index'

// next/navigation 모킹
const mockRouterPush = jest.fn()
jest.mock('next/navigation', () => ({
  useParams: () => ({ projectId: '1' }),
  useSearchParams: () => ({ get: () => null }),
  useRouter: () => ({ push: mockRouterPush }),
}))

// API 모킹
const mockGetProjectDetail = jest.fn()
const mockGetCSQuestionHistory = jest.fn()
const mockSubmitCSAnswer = jest.fn()
const mockSaveCSQuestion = jest.fn()
const mockBookmarkCSQuestion = jest.fn()
const mockDeleteProject = jest.fn()

jest.mock('@/api', () => ({
  getProjectDetail: (...args: any[]) => mockGetProjectDetail(...args),
  getCSQuestionHistory: (...args: any[]) => mockGetCSQuestionHistory(...args),
  submitCSAnswer: (...args: any[]) => mockSubmitCSAnswer(...args),
  saveCSQuestion: (...args: any[]) => mockSaveCSQuestion(...args),
  bookmarkCSQuestion: (...args: any[]) => mockBookmarkCSQuestion(...args),
  useProjectDelete: () => ({ mutateAsync: mockDeleteProject }),
}))

// 하위 컴포넌트 모킹
jest.mock('../ui/ProjectHeader', () => ({
  __esModule: true,
  default: ({ project, onEdit, onDelete }: any) => (
    <div>
      <h1>{project.title}</h1>
      <button onClick={onEdit} aria-label="편집">
        편집
      </button>
      <button onClick={onDelete} aria-label="삭제">
        삭제
      </button>
    </div>
  ),
}))

jest.mock('../code-selection', () => ({
  __esModule: true,
  default: ({ onSelectCodeSnippet }: any) => (
    <div>
      <div>CODE_SELECTION_TAB</div>
      <button
        onClick={() => onSelectCodeSnippet('test code', 'folder1')}
        data-testid="code-select-button"
      >
        코드 선택하기
      </button>
    </div>
  ),
}))

jest.mock('../cs-questions', () => ({
  __esModule: true,
  default: ({ folderName, onAnswerSubmit }: any) => (
    <div>
      <div>CS_QUESTIONS_TAB</div>
      <div>folder: {folderName}</div>
      <button onClick={() => onAnswerSubmit('answer', 1)}>답변 제출</button>
    </div>
  ),
}))

jest.mock('../question-history', () => ({
  __esModule: true,
  default: ({ onBookmarkQuestion }: any) => (
    <div data-testid="question-history">
      <div>QUESTION_HISTORY_TAB</div>
      <button onClick={() => onBookmarkQuestion(1)}>북마크</button>
    </div>
  ),
}))

jest.mock('../../Modal/ProjectEditModal', () => ({
  ProjectEditModal: ({ projectId, initialData, onClose, onSubmit }: any) => (
    <div data-testid="edit-modal">
      EDIT_MODAL
      <button onClick={onClose}>닫기</button>
      <button onClick={onSubmit}>저장</button>
    </div>
  ),
}))

jest.mock('../../Dashboard/DashboardCard/DeleteConfirmDialog', () => ({
  DeleteConfirmDialog: ({ isOpen, onConfirm }: any) =>
    isOpen ? (
      <div>
        <div>DELETE_DIALOG</div>
        <button onClick={onConfirm}>삭제 확인</button>
      </div>
    ) : null,
}))

const mockProjectData = {
  id: '1',
  title: 'Test Project',
  description: 'Test Description',
  role: 'Frontend Developer',
  techStack: ['React', 'TypeScript'],
  status: 'PROGRESS',
  updatedAt: new Date().toISOString(),
  files: ['file1.ts', 'file2.ts'],
}

describe('DetailProject', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetProjectDetail.mockResolvedValue(mockProjectData)
    mockGetCSQuestionHistory.mockResolvedValue({})
    mockSubmitCSAnswer.mockResolvedValue('Good answer!')
    mockSaveCSQuestion.mockResolvedValue(true)
    mockBookmarkCSQuestion.mockResolvedValue(true)
    mockDeleteProject.mockResolvedValue(undefined)
  })

  test('로딩 중일 때 로딩 메시지를 표시한다', async () => {
    mockGetProjectDetail.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000)),
    )

    render(<DetailProject />)

    expect(screen.getByText(/프로젝트 로딩 중/i)).toBeInTheDocument()
  })

  test('프로젝트 데이터를 성공적으로 로드한다', async () => {
    render(<DetailProject />)

    await waitFor(() => {
      expect(screen.getByText('Test Project')).toBeInTheDocument()
    })
  })

  test('에러 발생 시 에러 메시지를 표시한다', async () => {
    mockGetProjectDetail.mockRejectedValue(new Error('Failed to load'))

    // console.error를 모킹하여 에러 로그가 출력되지 않도록 함
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

    render(<DetailProject />)

    await waitFor(() => {
      expect(screen.getByText(/Failed to load/i)).toBeInTheDocument()
    })

    consoleErrorSpy.mockRestore()
  })

  test('프로젝트가 없을 때 에러 메시지를 표시한다', async () => {
    mockGetProjectDetail.mockResolvedValue(null)

    render(<DetailProject />)

    await waitFor(() => {
      expect(
        screen.getByText(/프로젝트를 찾을 수 없습니다/i),
      ).toBeInTheDocument()
    })
  })

  test('코드 선택 탭에서 코드를 선택하면 CS 질문 탭으로 전환한다', async () => {
    render(<DetailProject />)

    await waitFor(() => {
      expect(screen.getByText('CODE_SELECTION_TAB')).toBeInTheDocument()
    })

    // 모킹된 CodeSelectionTab 내부의 버튼 찾기
    const codeSelectButton = screen.getByTestId('code-select-button')
    fireEvent.click(codeSelectButton)

    await waitFor(() => {
      expect(screen.getByText('CS_QUESTIONS_TAB')).toBeInTheDocument()
      expect(screen.getByText('folder: folder1')).toBeInTheDocument()
    })
  })

  test('편집 버튼 클릭 시 편집 모달이 열린다', async () => {
    render(<DetailProject />)

    await waitFor(() => {
      expect(screen.getByLabelText('편집')).toBeInTheDocument()
    })

    const editButton = screen.getByLabelText('편집')
    fireEvent.click(editButton)

    await waitFor(() => {
      expect(screen.getByText('EDIT_MODAL')).toBeInTheDocument()
    })
  })

  test('삭제 버튼 클릭 시 삭제 확인 대화상자가 열린다', async () => {
    render(<DetailProject />)

    await waitFor(() => {
      expect(screen.getByLabelText('삭제')).toBeInTheDocument()
    })

    const deleteButton = screen.getByLabelText('삭제')
    fireEvent.click(deleteButton)

    await waitFor(() => {
      expect(screen.getByText('DELETE_DIALOG')).toBeInTheDocument()
    })
  })

  test('삭제 확인 시 프로젝트가 삭제된다', async () => {
    render(<DetailProject />)

    await waitFor(() => {
      expect(screen.getByLabelText('삭제')).toBeInTheDocument()
    })

    // 삭제 버튼 클릭
    const deleteButton = screen.getByLabelText('삭제')
    fireEvent.click(deleteButton)

    // 삭제 확인 버튼 클릭
    await waitFor(() => {
      expect(screen.getByText('삭제 확인')).toBeInTheDocument()
    })

    const confirmButton = screen.getByText('삭제 확인')
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(mockDeleteProject).toHaveBeenCalled()
    })
  })

  test('CS 질문 탭에서 답변 제출 시 handleAnswerSubmit이 호출된다', async () => {
    render(<DetailProject />)

    // 먼저 코드 선택 탭에서 코드 선택
    await waitFor(() => {
      expect(screen.getByTestId('code-select-button')).toBeInTheDocument()
    })

    const codeSelectButton = screen.getByTestId('code-select-button')
    fireEvent.click(codeSelectButton)

    // CS 질문 탭으로 전환됨
    await waitFor(() => {
      expect(screen.getByText('답변 제출')).toBeInTheDocument()
    })

    const submitButton = screen.getByText('답변 제출')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockSubmitCSAnswer).toHaveBeenCalledWith(1, 'answer')
    })
  })

  test('편집 성공 시 프로젝트 데이터가 업데이트된다', async () => {
    mockGetProjectDetail
      .mockResolvedValueOnce(mockProjectData)
      .mockResolvedValueOnce({ ...mockProjectData, title: 'Updated Title' })

    render(<DetailProject />)

    // 편집 버튼 클릭하여 모달 열기
    await waitFor(() => {
      expect(screen.getByLabelText('편집')).toBeInTheDocument()
    })

    const editButton = screen.getByLabelText('편집')
    fireEvent.click(editButton)

    // 모달이 열렸는지 확인
    await waitFor(() => {
      expect(screen.getByTestId('edit-modal')).toBeInTheDocument()
    })

    // 저장 버튼 클릭하여 onSubmit 호출
    const saveButton = screen.getByText('저장')
    fireEvent.click(saveButton)

    // handleEditSuccess에서 getProjectDetail이 다시 호출되는지 확인
    await waitFor(() => {
      expect(mockGetProjectDetail).toHaveBeenCalledTimes(2)
    })
  })

  test('질문 이력 로드 실패 시 에러가 발생하지 않고 계속 진행한다', async () => {
    mockGetCSQuestionHistory.mockRejectedValue(
      new Error('Failed to load history'),
    )
    // console.error를 모킹하여 실제 로그가 출력되지 않도록
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

    render(<DetailProject />)

    // 프로젝트는 성공적으로 로드되어야 함
    await waitFor(() => {
      expect(screen.getByText('Test Project')).toBeInTheDocument()
    })

    consoleErrorSpy.mockRestore()
  })
})
