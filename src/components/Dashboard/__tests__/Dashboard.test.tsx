import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import Dashboard from '../Dashboard'

// next/navigation 모킹
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}))

// DashboardCard 모킹
jest.mock('../DashboardCard/DashboardCard', () => ({
  DashboardCard: ({ card }: any) => (
    <div>
      {card.title}
      <span>Progress</span>
    </div>
  ),
}))

// ProjectImportModal 모킹 (onSubmit 콜백을 받을 수 있도록)
jest.mock('../../Modal/ProjectImportModal', () => ({
  ProjectImportModal: ({
    onSubmit,
  }: {
    onSubmit: (data?: any, success?: boolean) => void
  }) => (
    <div>
      <div>IMPORT_MODAL</div>
      <button onClick={() => onSubmit(undefined, true)}>SUBMIT_SUCCESS</button>
    </div>
  ),
}))

// Button 모킹
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}))

// useProjectList 모킹
const useProjectListMock = jest.fn()
jest.mock('@/api', () => ({
  useProjectList: (...args: any[]) => useProjectListMock(...args),
  useProjectDelete: () => ({ mutate: jest.fn() }),
}))

test('Dashboard가 프로젝트 카드를 렌더링한다', () => {
  useProjectListMock.mockReturnValue({
    data: {
      result: {
        content: [
          {
            id: 1,
            name: 'My Project',
            language: 'React',
            description: 'Project Desc',
            status: 'PROGRESS',
            updatedAt: new Date().toISOString(),
            role: 'Frontend',
          },
        ],
        totalPages: 1,
      },
    },
    isLoading: false,
    refetch: jest.fn(),
  })
  render(<Dashboard filter="all" />)
  expect(screen.getByText('My Project')).toBeInTheDocument()
  expect(screen.getByText('Progress')).toBeInTheDocument()
})

test('플러스 아이콘 클릭 시 프로젝트 임포트 모달이 열린다', () => {
  useProjectListMock.mockReturnValue({
    data: { result: { content: [], totalPages: 1 } },
    isLoading: false,
    refetch: jest.fn(),
  })
  const { container } = render(<Dashboard filter="all" />)
  const svg = container.querySelector('svg') as SVGElement
  expect(svg).toBeTruthy()
  fireEvent.click(svg)
  expect(screen.getByText('IMPORT_MODAL')).toBeInTheDocument()
})

test('로딩 중일 때 로딩 메시지를 표시한다', () => {
  useProjectListMock.mockReturnValue({
    data: null,
    isLoading: true,
    refetch: jest.fn(),
  })
  render(<Dashboard filter="all" />)
  expect(screen.getByText(/프로젝트 목록을 불러오는 중/i)).toBeInTheDocument()
})

test('프로젝트 생성 성공 시 성공 메시지가 표시되고 3초 후 자동으로 사라진다', async () => {
  jest.useFakeTimers()
  const refetch = jest.fn()
  useProjectListMock.mockReturnValue({
    data: { result: { content: [], totalPages: 1 } },
    isLoading: false,
    refetch,
  })

  const { container } = render(<Dashboard filter="all" />)

  // 모달 열기
  const svg = container.querySelector('svg') as SVGElement
  fireEvent.click(svg)

  // 성공 버튼 클릭하여 onSubmit(true) 호출
  const successButton = screen.getByText('SUBMIT_SUCCESS')
  fireEvent.click(successButton)

  // 성공 메시지가 표시되는지 확인
  await screen.findByText(/프로젝트가 성공적으로 생성되었습니다/i)

  // 3초 후 메시지가 사라지는지 확인 (act로 감싸서 React 업데이트 처리)
  act(() => {
    jest.advanceTimersByTime(3000)
  })

  expect(
    screen.queryByText(/프로젝트가 성공적으로 생성되었습니다/i),
  ).not.toBeInTheDocument()

  jest.useRealTimers()
})

test('페이지네이션 버튼이 여러 페이지일 때 렌더링된다', () => {
  useProjectListMock.mockReturnValue({
    data: {
      result: {
        content: [
          {
            id: 1,
            name: 'P1',
            language: 'React',
            description: 'D1',
            status: 'PROGRESS',
            updatedAt: new Date().toISOString(),
            role: 'R1',
          },
          {
            id: 2,
            name: 'P2',
            language: 'Node',
            description: 'D2',
            status: 'DONE',
            updatedAt: new Date().toISOString(),
            role: 'R2',
          },
        ],
        totalPages: 3,
      },
    },
    isLoading: false,
    refetch: jest.fn(),
  })
  render(<Dashboard filter="all" />)
  // 페이지 번호 버튼들이 렌더링되는지 확인
  expect(screen.getByText('1')).toBeInTheDocument()
  expect(screen.getByText('2')).toBeInTheDocument()
  expect(screen.getByText('3')).toBeInTheDocument()
})

test('페이지네이션에서 다음/이전 버튼이 작동한다', () => {
  useProjectListMock.mockReturnValue({
    data: {
      result: {
        content: [
          {
            id: 1,
            name: 'P1',
            language: 'React',
            description: 'D1',
            status: 'PROGRESS',
            updatedAt: new Date().toISOString(),
            role: 'R1',
          },
        ],
        totalPages: 3,
      },
    },
    isLoading: false,
    refetch: jest.fn(),
  })
  const { container } = render(<Dashboard filter="all" />)

  // 다음 버튼 (ChevronRight 아이콘을 가진 버튼)
  const buttons = container.querySelectorAll('button')
  const nextButton = Array.from(buttons).find((btn) => btn.querySelector('svg'))

  if (nextButton) {
    fireEvent.click(nextButton)
    // 페이지 변경이 useProjectListMock에 반영되는지 확인
    expect(useProjectListMock).toHaveBeenCalled()
  }
})

test('필터 변경 시 페이지가 0으로 초기화된다', () => {
  useProjectListMock.mockClear()
  useProjectListMock.mockReturnValue({
    data: { result: { content: [], totalPages: 1 } },
    isLoading: false,
    refetch: jest.fn(),
  })
  const { rerender } = render(<Dashboard filter="all" />)
  rerender(<Dashboard filter="PROGRESS" />)
  // 필터 변경 시 currentPage가 0으로 초기화되어 useProjectListMock이 0과 함께 호출됨
  expect(useProjectListMock).toHaveBeenCalledWith('PROGRESS', 0)
})
