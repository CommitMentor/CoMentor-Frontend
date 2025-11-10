import React, { useRef } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import CodeViewer from '../CodeViewer'

// Textarea 모킹
jest.mock('@/components/ui/textarea', () => ({
  Textarea: React.forwardRef(
    ({ value, onChange, onMouseUp, onKeyUp, ...props }: any, ref: any) => (
      <textarea
        ref={ref}
        value={value}
        onChange={onChange}
        onMouseUp={onMouseUp}
        onKeyUp={onKeyUp}
        {...props}
      />
    ),
  ),
}))

// generateSkeleton 모킹
jest.mock('@/lib/skeleton-generator', () => ({
  generateSkeleton: (component: any) => component,
}))

describe('CodeViewer', () => {
  const onSelectCodeMock = jest.fn()
  let codeTextareaRef: React.RefObject<HTMLTextAreaElement | null>

  const TestWrapper: React.FC<{ code: string }> = ({ code }) => {
    codeTextareaRef = useRef<HTMLTextAreaElement | null>(null)

    return (
      <CodeViewer
        code={code}
        selectedCode=""
        codeTextareaRef={codeTextareaRef}
        onSelectCode={onSelectCodeMock}
      />
    )
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('코드가 있으면 올바르게 렌더링된다', () => {
    const code = 'const example = "Hello World";'
    const { container } = render(<TestWrapper code={code} />)

    const textarea = container.querySelector('textarea')
    expect(textarea).toHaveValue(code)
  })

  test('코드가 없으면 안내 메시지가 표시된다', () => {
    render(<TestWrapper code="" />)

    expect(
      screen.getByText('파일을 선택하여 코드를 확인하세요.'),
    ).toBeInTheDocument()
  })

  test('코드가 없으면 textarea가 렌더링되지 않는다', () => {
    const { container } = render(<TestWrapper code="" />)

    expect(container.querySelector('textarea')).not.toBeInTheDocument()
  })

  test('텍스트 선택 시 onSelectCode가 호출된다', () => {
    const code = 'const example = "Hello World";'
    const { container } = render(<TestWrapper code={code} />)

    const textarea = container.querySelector('textarea') as HTMLTextAreaElement
    expect(textarea).toBeTruthy()

    // 텍스트 선택 시뮬레이션
    Object.defineProperty(textarea, 'selectionStart', {
      value: 6,
      configurable: true,
      writable: true,
    })
    Object.defineProperty(textarea, 'selectionEnd', {
      value: 13,
      configurable: true,
      writable: true,
    })

    // mouseUp 이벤트 발생
    fireEvent.mouseUp(textarea)

    expect(onSelectCodeMock).toHaveBeenCalledWith('example')
  })

  test('텍스트가 선택되지 않으면 onSelectCode가 호출되지 않는다', () => {
    const code = 'const example = "Hello World";'
    const { container } = render(<TestWrapper code={code} />)

    const textarea = container.querySelector('textarea') as HTMLTextAreaElement

    // selectionStart와 selectionEnd가 같을 때
    Object.defineProperty(textarea, 'selectionStart', {
      value: 6,
      configurable: true,
      writable: true,
    })
    Object.defineProperty(textarea, 'selectionEnd', {
      value: 6,
      configurable: true,
      writable: true,
    })

    fireEvent.mouseUp(textarea)

    expect(onSelectCodeMock).not.toHaveBeenCalled()
  })

  test('keyUp 이벤트에도 텍스트 선택이 작동한다', () => {
    const code = 'const example = "Hello World";'
    const { container } = render(<TestWrapper code={code} />)

    const textarea = container.querySelector('textarea') as HTMLTextAreaElement

    Object.defineProperty(textarea, 'selectionStart', {
      value: 6,
      configurable: true,
      writable: true,
    })
    Object.defineProperty(textarea, 'selectionEnd', {
      value: 13,
      configurable: true,
      writable: true,
    })

    fireEvent.keyUp(textarea)

    expect(onSelectCodeMock).toHaveBeenCalledWith('example')
  })

  test('textarea가 ref로 전달된다', () => {
    const code = 'const example = "Hello World";'
    const { container } = render(<TestWrapper code={code} />)

    const textarea = container.querySelector('textarea') as HTMLTextAreaElement

    expect(codeTextareaRef.current).toBe(textarea)
  })

  test('custom className이 적용된다', () => {
    const code = 'const example = "Hello World";'
    render(
      <CodeViewer
        code={code}
        selectedCode=""
        codeTextareaRef={{ current: null }}
        onSelectCode={onSelectCodeMock}
        className="custom-class"
      />,
    )

    const textarea = screen.getByDisplayValue(code)
    expect(textarea).toHaveClass('custom-class')
  })

  test('readonly 속성이 설정된다', () => {
    const code = 'const example = "Hello World";'
    render(
      <CodeViewer
        code={code}
        selectedCode=""
        codeTextareaRef={{ current: null }}
        onSelectCode={onSelectCodeMock}
      />,
    )

    const textarea = screen.getByDisplayValue(code)
    expect(textarea).toHaveAttribute('readonly')
  })
})
