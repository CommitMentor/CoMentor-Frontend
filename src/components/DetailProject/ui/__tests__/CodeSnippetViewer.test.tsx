import React from 'react'
import { render, screen } from '@testing-library/react'
import CodeSnippetViewer from '../CodeSnippetViewer'

describe('CodeSnippetViewer', () => {
  const defaultCode = 'const example = "Hello World";'

  test('코드가 올바르게 렌더링된다', () => {
    render(<CodeSnippetViewer code={defaultCode} />)
    expect(screen.getByText(defaultCode)).toBeInTheDocument()
  })

  test('기본 제목이 표시된다', () => {
    render(<CodeSnippetViewer code={defaultCode} />)
    expect(screen.getByText('선택된 코드')).toBeInTheDocument()
  })

  test('커스텀 제목이 표시된다', () => {
    render(<CodeSnippetViewer code={defaultCode} title="커스텀 제목" />)
    expect(screen.getByText('커스텀 제목')).toBeInTheDocument()
  })

  test('코드가 없을 때 기본 메시지가 표시된다', () => {
    render(<CodeSnippetViewer code="" />)
    expect(screen.getByText('코드가 선택되지 않았습니다.')).toBeInTheDocument()
  })

  test('current와 total이 제공되면 진행 표시가 나타난다', () => {
    render(<CodeSnippetViewer code={defaultCode} current={2} total={5} />)
    expect(screen.getByText('2 / 5')).toBeInTheDocument()
  })

  test('current만 제공되면 진행 표시가 나타나지 않는다', () => {
    render(<CodeSnippetViewer code={defaultCode} current={2} />)
    expect(screen.queryByText('2 /')).not.toBeInTheDocument()
  })

  test('total만 제공되면 진행 표시가 나타나지 않는다', () => {
    render(<CodeSnippetViewer code={defaultCode} total={5} />)
    expect(screen.queryByText('/ 5')).not.toBeInTheDocument()
  })

  test('progress가 제공되면 진행률 바가 나타난다', () => {
    const { container } = render(
      <CodeSnippetViewer code={defaultCode} progress={60} />,
    )
    const progressBar = container.querySelector('.bg-zinc-400')
    expect(progressBar).toBeInTheDocument()
    expect(progressBar).toHaveStyle({ width: '60%' })
  })

  test('progress가 undefined이면 진행률 바가 나타나지 않는다', () => {
    const { container } = render(<CodeSnippetViewer code={defaultCode} />)
    const progressBar = container.querySelector('.bg-zinc-400')
    expect(progressBar).not.toBeInTheDocument()
  })

  test('모든 props가 제공되면 모두 렌더링된다', () => {
    const { container } = render(
      <CodeSnippetViewer
        code={defaultCode}
        title="전체 기능 테스트"
        progress={75}
        current={3}
        total={4}
      />,
    )
    expect(screen.getByText('전체 기능 테스트')).toBeInTheDocument()
    expect(screen.getByText(defaultCode)).toBeInTheDocument()
    expect(screen.getByText('3 / 4')).toBeInTheDocument()
    const progressBar = container.querySelector('.bg-zinc-400')
    expect(progressBar).toBeInTheDocument()
    expect(progressBar).toHaveStyle({ width: '75%' })
  })
})
