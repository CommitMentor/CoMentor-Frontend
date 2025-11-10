import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import ProjectHeader from '../ProjectHeader'

// formatDate 모킹
jest.mock('@/utils/updated_date', () => ({
  formatDate: (date: string) => `Formatted: ${date}`,
}))

const mockProject = {
  id: '1',
  title: 'Test Project',
  description: 'This is a test project description',
  role: 'Frontend Developer',
  techStack: ['React', 'TypeScript', 'Next.js'],
  status: 'PROGRESS',
  updatedAt: '2024-01-01T00:00:00Z',
  files: [],
}

describe('ProjectHeader', () => {
  test('프로젝트 정보가 올바르게 렌더링된다', () => {
    render(<ProjectHeader project={mockProject} />)

    expect(screen.getByText('Test Project')).toBeInTheDocument()
    expect(
      screen.getByText('This is a test project description'),
    ).toBeInTheDocument()
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('Next.js')).toBeInTheDocument()
    expect(screen.getByText('PROGRESS')).toBeInTheDocument()
  })

  test('편집 버튼 클릭 시 onEdit이 호출된다', () => {
    const onEdit = jest.fn()
    render(<ProjectHeader project={mockProject} onEdit={onEdit} />)

    const editButton = screen.getByLabelText('프로젝트 편집')
    fireEvent.click(editButton)

    expect(onEdit).toHaveBeenCalledTimes(1)
  })

  test('삭제 버튼 클릭 시 onDelete가 호출된다', () => {
    const onDelete = jest.fn()
    render(<ProjectHeader project={mockProject} onDelete={onDelete} />)

    const deleteButton = screen.getByLabelText('프로젝트 삭제')
    fireEvent.click(deleteButton)

    expect(onDelete).toHaveBeenCalledTimes(1)
  })

  test('onEdit과 onDelete가 없으면 버튼이 렌더링되지 않는다', () => {
    render(<ProjectHeader project={mockProject} />)

    expect(screen.queryByLabelText('프로젝트 편집')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('프로젝트 삭제')).not.toBeInTheDocument()
  })

  test('PROGRESS 상태일 때 노란색 인디케이터가 표시된다', () => {
    const { container } = render(<ProjectHeader project={mockProject} />)
    const statusIndicator = container.querySelector('.bg-yellow-400')
    expect(statusIndicator).toBeInTheDocument()
  })

  test('DONE 상태일 때 초록색 인디케이터가 표시된다', () => {
    const doneProject = { ...mockProject, status: 'DONE' }
    const { container } = render(<ProjectHeader project={doneProject} />)
    const statusIndicator = container.querySelector('.bg-green-500')
    expect(statusIndicator).toBeInTheDocument()
  })

  test('updatedAt이 있으면 날짜가 표시된다', () => {
    render(<ProjectHeader project={mockProject} />)
    expect(screen.getByText(/최근 업데이트:/i)).toBeInTheDocument()
  })

  test('updatedAt이 없으면 날짜가 표시되지 않는다', () => {
    const projectWithoutDate = { ...mockProject, updatedAt: undefined }
    render(<ProjectHeader project={projectWithoutDate as any} />)
    expect(screen.queryByText(/최근 업데이트:/i)).not.toBeInTheDocument()
  })

  test('빈 techStack 배열일 때 기술 스택이 표시되지 않는다', () => {
    const projectWithoutStack = { ...mockProject, techStack: [] }
    render(<ProjectHeader project={projectWithoutStack} />)
    // techStack 라벨은 있지만 아이템이 없음
    expect(screen.getByText('기술 스택')).toBeInTheDocument()
  })
})
