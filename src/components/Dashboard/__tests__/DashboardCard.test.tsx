import React from 'react'
import { render, screen } from '@testing-library/react'
import { DashboardCard } from '../DashboardCard/DashboardCard'

// next/navigation 라우터 모킹 (CardContent에서 사용)
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}))

// API 훅 모킹 (삭제 mutate 사용 방지)
jest.mock('@/api', () => ({
  useProjectDelete: () => ({ mutate: jest.fn() }),
}))

const mockCard = {
  id: 1,
  title: 'Test Title',
  personal_stack: ['React'],
  description: 'Test Description',
  status: 'PROGRESS',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  role: 'Frontend',
}

test('DashboardCard 기본 정보가 렌더링된다', () => {
  render(<DashboardCard card={mockCard} onRefresh={jest.fn()} />)
  expect(screen.getByText('Test Title')).toBeInTheDocument()
  expect(screen.getByText('Test Description')).toBeInTheDocument()
  expect(screen.getByText('Progress')).toBeInTheDocument()
})
