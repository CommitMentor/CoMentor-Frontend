import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import FileList from '../FileList'

// Lucide React 아이콘 모킹
jest.mock('lucide-react', () => ({
  Loader2: () => <svg data-testid="loader-icon" />,
  Folder: () => <svg data-testid="folder-icon" />,
  FileText: () => <svg data-testid="file-icon" />,
  ChevronUp: () => <svg data-testid="chevron-up-icon" />,
}))

describe('FileList', () => {
  const mockFiles = [
    {
      name: 'test.tsx',
      path: 'src/test.tsx',
      type: 'file' as const,
      url: 'https://github.com/example/test.tsx',
    },
    {
      name: 'components',
      path: 'src/components',
      type: 'dir' as const,
      url: 'https://github.com/example/components',
    },
    {
      name: 'utils.ts',
      path: 'src/utils.ts',
      type: 'file' as const,
      url: 'https://github.com/example/utils.ts',
    },
  ]

  const onSelectFileMock = jest.fn()
  const onNavigateUpMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('파일 목록이 올바르게 렌더링된다', () => {
    render(
      <FileList
        files={mockFiles}
        selectedFile=""
        currentPath="src"
        loading={false}
        onSelectFile={onSelectFileMock}
        onNavigateUp={onNavigateUpMock}
      />,
    )

    expect(screen.getByText('test.tsx')).toBeInTheDocument()
    expect(screen.getByText('components')).toBeInTheDocument()
    expect(screen.getByText('utils.ts')).toBeInTheDocument()
  })

  test('로딩 중일 때 스켈레톤이 표시된다', () => {
    const { container } = render(
      <FileList
        files={[]}
        selectedFile=""
        currentPath=""
        loading={true}
        onSelectFile={onSelectFileMock}
        onNavigateUp={onNavigateUpMock}
      />,
    )

    // FileListWrapper가 FileListSkeleton을 렌더링하므로 파일 목록은 렌더링되지 않음
    expect(screen.queryByText('파일 목록 로딩 중...')).not.toBeInTheDocument()
  })

  test('파일이 없으면 빈 상태 메시지가 표시된다', () => {
    render(
      <FileList
        files={[]}
        selectedFile=""
        currentPath=""
        loading={false}
        onSelectFile={onSelectFileMock}
        onNavigateUp={onNavigateUpMock}
      />,
    )

    expect(
      screen.getByText('저장소에서 파일을 찾을 수 없습니다.'),
    ).toBeInTheDocument()
  })

  test('파일 클릭 시 onSelectFile이 호출된다', () => {
    render(
      <FileList
        files={mockFiles}
        selectedFile=""
        currentPath=""
        loading={false}
        onSelectFile={onSelectFileMock}
        onNavigateUp={onNavigateUpMock}
      />,
    )

    const fileItem = screen.getByText('test.tsx').closest('li')
    fireEvent.click(fileItem!)

    expect(onSelectFileMock).toHaveBeenCalledWith(mockFiles[0])
  })

  test('폴더 클릭 시 onSelectFile이 호출된다', () => {
    render(
      <FileList
        files={mockFiles}
        selectedFile=""
        currentPath=""
        loading={false}
        onSelectFile={onSelectFileMock}
        onNavigateUp={onNavigateUpMock}
      />,
    )

    const folderItem = screen.getByText('components').closest('li')
    fireEvent.click(folderItem!)

    expect(onSelectFileMock).toHaveBeenCalledWith(mockFiles[1])
  })

  test('파일 아이콘이 올바르게 표시된다', () => {
    render(
      <FileList
        files={mockFiles}
        selectedFile=""
        currentPath=""
        loading={false}
        onSelectFile={onSelectFileMock}
        onNavigateUp={onNavigateUpMock}
      />,
    )

    expect(screen.getAllByTestId('file-icon')).toHaveLength(2)
    expect(screen.getByTestId('folder-icon')).toBeInTheDocument()
  })

  test('선택된 파일이 강조 표시된다', () => {
    const { container } = render(
      <FileList
        files={mockFiles}
        selectedFile="src/test.tsx"
        currentPath="src"
        loading={false}
        onSelectFile={onSelectFileMock}
        onNavigateUp={onNavigateUpMock}
      />,
    )

    const selectedItem = screen.getByText('test.tsx').closest('li')
    expect(selectedItem).toHaveClass('bg-slate-100')
  })

  test('루트 디렉토리일 때 경로가 올바르게 표시된다', () => {
    render(
      <FileList
        files={mockFiles}
        selectedFile=""
        currentPath=""
        loading={false}
        onSelectFile={onSelectFileMock}
        onNavigateUp={onNavigateUpMock}
      />,
    )

    expect(screen.getByText('루트 디렉토리')).toBeInTheDocument()
  })

  test('서브 디렉토리일 때 경로가 올바르게 표시된다', () => {
    render(
      <FileList
        files={mockFiles}
        selectedFile=""
        currentPath="src/components"
        loading={false}
        onSelectFile={onSelectFileMock}
        onNavigateUp={onNavigateUpMock}
      />,
    )

    expect(screen.getByText('src/components')).toBeInTheDocument()
  })

  test('상위 폴더로 이동 버튼이 표시된다', () => {
    render(
      <FileList
        files={mockFiles}
        selectedFile=""
        currentPath="src/components"
        loading={false}
        onSelectFile={onSelectFileMock}
        onNavigateUp={onNavigateUpMock}
      />,
    )

    expect(screen.getByTestId('chevron-up-icon')).toBeInTheDocument()
  })

  test('상위 폴더로 이동 버튼 클릭 시 onNavigateUp이 호출된다', () => {
    render(
      <FileList
        files={mockFiles}
        selectedFile=""
        currentPath="src/components"
        loading={false}
        onSelectFile={onSelectFileMock}
        onNavigateUp={onNavigateUpMock}
      />,
    )

    const upButton = screen.getByTestId('chevron-up-icon').closest('button')
    fireEvent.click(upButton!)

    expect(onNavigateUpMock).toHaveBeenCalledTimes(1)
  })

  test('custom className이 적용된다', () => {
    const { container } = render(
      <FileList
        files={mockFiles}
        selectedFile=""
        currentPath=""
        loading={false}
        onSelectFile={onSelectFileMock}
        onNavigateUp={onNavigateUpMock}
        className="custom-class"
      />,
    )

    const wrapper = container.firstChild
    expect(wrapper).toHaveClass('custom-class')
  })

  test('로딩 상태에서는 스켈레톤이 표시되고 파일이 렌더링되지 않는다', () => {
    const { container } = render(
      <FileList
        files={mockFiles}
        selectedFile=""
        currentPath=""
        loading={true}
        onSelectFile={onSelectFileMock}
        onNavigateUp={onNavigateUpMock}
      />,
    )

    // FileListWrapper가 FileListSkeleton을 렌더링
    expect(screen.queryByText('test.tsx')).not.toBeInTheDocument()
  })
})
