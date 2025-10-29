import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { DashboardCard } from '../DashboardCard/DashboardCard'

// next/navigation 모킹
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}))

// ProjectEditModal을 센티넬로 모킹 (열림 여부 검증)
jest.mock('@/components/Modal/ProjectEditModal', () => ({
  ProjectEditModal: () => <div>EDIT_MODAL_OPEN</div>,
}))

// DeleteConfirmDialog 모킹
jest.mock('../DashboardCard/DeleteConfirmDialog', () => ({
  DeleteConfirmDialog: ({ isOpen, onConfirm }: any) =>
    isOpen ? <button onClick={onConfirm}>CONFIRM_DELETE</button> : null,
}))

// useProjectDelete 모킹
const mutateMock = jest.fn()
jest.mock('@/api', () => ({
  useProjectDelete: () => ({ mutate: mutateMock }),
}))

const mockCard = {
  id: 1,
  title: 'Card Title',
  personal_stack: ['React'],
  description: 'Card Desc',
  status: 'PROGRESS',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  role: 'Frontend',
}

test('편집 아이콘 클릭 시 수정 모달이 열린다', () => {
  const { container } = render(
    <DashboardCard card={mockCard} onRefresh={jest.fn()} />,
  )
  const editButton = container.querySelector(
    'button[aria-label="Edit"]',
  ) as HTMLButtonElement
  expect(editButton).toBeTruthy()
  fireEvent.click(editButton)
  expect(screen.getByText('EDIT_MODAL_OPEN')).toBeInTheDocument()
})

test('삭제 플로우 성공 시 onRefresh가 호출된다', () => {
  jest.useFakeTimers()
  const onRefresh = jest.fn()

  mutateMock.mockImplementation((_undef, { onSuccess }: any) => {
    onSuccess()
  })

  const { container } = render(
    <DashboardCard card={mockCard} onRefresh={onRefresh} />,
  )

  const deleteButton = container.querySelector(
    'button[aria-label="Delete"]',
  ) as HTMLButtonElement
  expect(deleteButton).toBeTruthy()
  fireEvent.click(deleteButton)

  fireEvent.click(screen.getByText('CONFIRM_DELETE'))

  act(() => {
    jest.advanceTimersByTime(1000)
  })

  expect(onRefresh).toHaveBeenCalled()
  jest.useRealTimers()
})
