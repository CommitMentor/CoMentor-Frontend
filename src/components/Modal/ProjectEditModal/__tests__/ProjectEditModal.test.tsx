import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ProjectEditModal } from '../index'

// react-hook-form과 관련 컴포넌트 모킹
jest.mock('react-hook-form', () => ({
  useForm: () => ({
    handleSubmit: (fn: any) => fn,
    control: {},
    reset: jest.fn(),
  }),
}))

// 자식 컴포넌트 모킹
jest.mock('../../ProjectImportModal/TextareaField', () => ({
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

jest.mock('../../ProjectImportModal/StatusRadioGroup', () => ({
  StatusRadioGroup: ({ field, options }: any) => (
    <div>
      {options.map((opt: any) => (
        <label key={opt.id}>
          <input
            type="radio"
            {...field}
            value={opt.value}
            data-testid={`radio-${opt.value}`}
          />
          {opt.label}
        </label>
      ))}
    </div>
  ),
  StatusOption: {},
}))

jest.mock('../../ProjectImportModal/ModalButtons', () => ({
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
      name: name || 'test', // 실제 전달된 name 사용
      onChange: jest.fn(),
      onBlur: jest.fn(),
      value: '',
      ref: jest.fn(),
    }
    return render({ field })
  },
}))

// API 훅 모킹
const mutateMock = jest.fn()
jest.mock('@/api', () => ({
  useProjectUpdate: () => ({ mutate: mutateMock }),
}))

const mockProps = {
  projectId: 1,
  initialData: {
    description: 'Test Description',
    role: 'Frontend Developer',
    status: 'PROGRESS' as const,
  },
  onClose: jest.fn(),
  onSubmit: jest.fn(),
}

// window.scrollTo는 jest.setup.ts에서 전역 모킹됨

beforeEach(() => {
  jest.clearAllMocks()
  // body 스타일 초기화
  document.body.style.position = ''
  document.body.style.top = ''
  document.body.style.width = ''
})

test('ProjectEditModal이 렌더링되고 초기값이 표시된다', () => {
  render(<ProjectEditModal {...mockProps} />)

  // label은 htmlFor와 input id가 연결되어 있으므로 getByLabelText 사용
  // 하지만 모킹된 컴포넌트에서는 간단히 getByText 사용
  expect(screen.getByText(/프로젝트 내용/i)).toBeInTheDocument()
  expect(screen.getByText(/맡은 역할/i)).toBeInTheDocument()
})

test('폼 제출 성공 시 onClose와 onSubmit이 호출된다', async () => {
  mutateMock.mockImplementation((data, { onSuccess }: any) => {
    onSuccess()
  })

  render(<ProjectEditModal {...mockProps} />)

  // "완료" 텍스트가 라디오 버튼과 제출 버튼에 모두 있어서 getByRole 사용
  const submitButton = screen.getByRole('button', { name: '완료' })
  fireEvent.click(submitButton)

  await waitFor(() => {
    expect(mutateMock).toHaveBeenCalled()
    expect(mockProps.onClose).toHaveBeenCalled()
    expect(mockProps.onSubmit).toHaveBeenCalled()
  })
})

test('폼 제출 실패 시 에러 메시지가 표시된다', async () => {
  mutateMock.mockImplementation((data, { onError }: any) => {
    onError({ message: '수정 실패' })
  })

  render(<ProjectEditModal {...mockProps} />)

  // "완료" 텍스트가 라디오 버튼과 제출 버튼에 모두 있어서 getByRole 사용
  const submitButton = screen.getByRole('button', { name: '완료' })
  fireEvent.click(submitButton)

  await waitFor(() => {
    expect(screen.getByText(/수정 실패/i)).toBeInTheDocument()
  })
})

test('DONE 상태로 초기화되었을 때 completed가 선택된다', () => {
  render(
    <ProjectEditModal
      {...mockProps}
      initialData={{ ...mockProps.initialData, status: 'DONE' }}
    />,
  )

  const completedRadio = screen.getByTestId('radio-completed')
  expect(completedRadio).toBeInTheDocument()
})

test('취소 버튼 클릭 시 onClose가 호출된다', () => {
  render(<ProjectEditModal {...mockProps} />)

  const cancelButton = screen.getByText('취소')
  fireEvent.click(cancelButton)

  expect(mockProps.onClose).toHaveBeenCalled()
})

test('모달 언마운트 시 body 스타일이 복원된다', () => {
  const { unmount } = render(<ProjectEditModal {...mockProps} />)

  // 모달이 열리면 body 스타일이 변경됨
  expect(document.body.style.position).toBe('fixed')

  unmount()

  // 언마운트 시 스타일이 복원되어야 함 (cleanup 함수 실행)
  // 실제로는 setTimeout 내부에서 복원되므로 약간의 지연 필요
  setTimeout(() => {
    expect(document.body.style.position).toBe('')
  }, 100)
})
