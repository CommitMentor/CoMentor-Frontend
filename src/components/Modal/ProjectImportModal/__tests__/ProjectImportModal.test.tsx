import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ProjectImportModal } from '../index'

// react-hook-form 모킹
const mockHandleSubmit = jest.fn((fn) => (e: any) => {
  e?.preventDefault?.()
  return fn({
    title: 'test-repo',
    description: 'Test Desc',
    role: 'Dev',
    status: 'in_progress',
  })
})

jest.mock('react-hook-form', () => ({
  useForm: () => ({
    handleSubmit: mockHandleSubmit,
    control: {},
    reset: jest.fn(),
  }),
}))

// 자식 컴포넌트 모킹
jest.mock('../TitleSelect', () => ({
  TitleSelect: ({ field, repositories, isLoading }: any) => (
    <div>
      <label htmlFor={field.name}>프로젝트 제목</label>
      <select {...field} id={field.name} data-testid="title-select">
        {repositories.map((repo: any) => (
          <option key={repo.value} value={repo.label}>
            {repo.label}
          </option>
        ))}
      </select>
      {isLoading && <span>로딩 중...</span>}
    </div>
  ),
  ProjectFormValues: {},
}))

jest.mock('../TextareaField', () => ({
  TextareaField: ({ field, label }: any) => (
    <div>
      <label htmlFor={field.name}>{label}</label>
      <textarea
        {...field}
        id={field.name}
        data-testid={`textarea-${field.name}`}
      />
    </div>
  ),
}))

jest.mock('../StatusRadioGroup', () => ({
  StatusRadioGroup: ({ field, options }: any) => (
    <div>
      {options.map((opt: any) => (
        <label key={opt.id}>
          <input type="radio" {...field} value={opt.value} />
          {opt.label}
        </label>
      ))}
    </div>
  ),
  StatusOption: {},
}))

jest.mock('../ModalButtons', () => ({
  ModalButtons: ({ onClose, isSubmitting }: any) => (
    <div>
      <button onClick={onClose} disabled={isSubmitting}>
        취소
      </button>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? '제출 중...' : '완료'}
      </button>
    </div>
  ),
}))

jest.mock('@/components/ui/form', () => ({
  Form: ({ children }: any) => <div role="form">{children}</div>, // form 태그 대신 div 사용하여 중첩 문제 방지
  FormField: ({ name, render }: any) => {
    const field = {
      name: name || 'test',
      onChange: jest.fn(),
      onBlur: jest.fn(),
      value: '',
      ref: jest.fn(),
    }
    return render({ field })
  },
}))

// API 훅 모킹
const refetchMock = jest.fn()
const mutateMock = jest.fn()
jest.mock('@/api', () => ({
  useGithubRepos: () => ({
    data: {
      result: [
        { id: 1, name: 'test-repo' },
        { id: 2, name: 'another-repo' },
      ],
    },
    isLoading: false,
    refetch: refetchMock,
  }),
  useProjectCreate: () => ({ mutate: mutateMock }),
  GithubRepo: {},
}))

const mockProps = {
  onClose: jest.fn(),
  onSubmit: jest.fn(),
}

// window.scrollTo는 jest.setup.ts에서 전역 모킹됨

beforeEach(() => {
  jest.clearAllMocks()
  document.body.style.position = ''
  document.body.style.top = ''
  document.body.style.width = ''
})

test('ProjectImportModal이 렌더링되고 GitHub 레포지토리 목록이 표시된다', () => {
  render(<ProjectImportModal {...mockProps} />)

  expect(screen.getByLabelText(/프로젝트 제목/i)).toBeInTheDocument()
  expect(screen.getByTestId('title-select')).toBeInTheDocument()
})

test('폼 제출 성공 시 onClose와 onSubmit이 호출된다', async () => {
  mutateMock.mockImplementation((data, { onSuccess }: any) => {
    onSuccess()
  })

  render(<ProjectImportModal {...mockProps} />)

  // "완료" 텍스트가 라디오 버튼과 제출 버튼에 모두 있어서 getByRole 사용
  const submitButton = screen.getByRole('button', { name: '완료' })
  fireEvent.click(submitButton)

  await waitFor(() => {
    expect(mutateMock).toHaveBeenCalled()
    expect(mockProps.onClose).toHaveBeenCalled()
    expect(mockProps.onSubmit).toHaveBeenCalledWith(expect.any(Object), true)
  })
})

test('레포지토리가 선택되지 않으면 에러 메시지가 표시된다', async () => {
  // handleSubmit이 빈 title을 반환하도록 모킹
  mockHandleSubmit.mockImplementationOnce((fn) => (e: any) => {
    e?.preventDefault?.()
    return fn({
      title: '',
      description: 'Test',
      role: 'Dev',
      status: 'in_progress',
    })
  })

  render(<ProjectImportModal {...mockProps} />)

  // "완료" 텍스트가 라디오 버튼과 제출 버튼에 모두 있어서 getByRole 사용
  const submitButton = screen.getByRole('button', { name: '완료' })
  fireEvent.click(submitButton)

  await waitFor(() => {
    expect(
      screen.getByText(/유효한 GitHub 레포지토리를 선택해주세요/i),
    ).toBeInTheDocument()
  })
})

test('폼 제출 실패 시 에러 메시지가 표시된다', async () => {
  mutateMock.mockImplementation((data, { onError }: any) => {
    onError({ message: '생성 실패' })
  })

  render(<ProjectImportModal {...mockProps} />)

  // "완료" 텍스트가 라디오 버튼과 제출 버튼에 모두 있어서 getByRole 사용
  const submitButton = screen.getByRole('button', { name: '완료' })
  fireEvent.click(submitButton)

  await waitFor(() => {
    expect(screen.getByText(/생성 실패/i)).toBeInTheDocument()
  })
})

test('취소 버튼 클릭 시 onClose가 호출된다', () => {
  render(<ProjectImportModal {...mockProps} />)

  const cancelButton = screen.getByText('취소')
  fireEvent.click(cancelButton)

  expect(mockProps.onClose).toHaveBeenCalled()
})

test('컴포넌트 마운트 시 refetch가 호출된다', () => {
  render(<ProjectImportModal {...mockProps} />)

  expect(refetchMock).toHaveBeenCalled()
})

test('로딩 중일 때 제출 버튼이 비활성화된다', async () => {
  mutateMock.mockImplementation((data, { onSuccess }: any) => {
    // 성공을 지연시켜 로딩 상태 확인
    setTimeout(() => onSuccess(), 100)
  })

  render(<ProjectImportModal {...mockProps} />)

  // "완료" 텍스트가 라디오 버튼과 제출 버튼에 모두 있어서 getByRole 사용
  const submitButton = screen.getByRole('button', { name: '완료' })
  fireEvent.click(submitButton)

  // 로딩 중에는 버튼이 비활성화되어야 함
  expect(submitButton).toBeDisabled()
  expect(screen.getByText(/제출 중/i)).toBeInTheDocument()
})
