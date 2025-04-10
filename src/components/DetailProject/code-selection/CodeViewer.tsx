'use client'

import React, { RefObject, useCallback } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'

interface CodeViewerProps {
  code: string
  selectedCode: string
  codeTextareaRef: RefObject<HTMLTextAreaElement | null>
  onSelectCode: (text: string) => void
  className?: string
}

export default function CodeViewer({
  code,
  selectedCode,
  codeTextareaRef,
  onSelectCode,
  className = '',
}: CodeViewerProps) {
  // 텍스트 선택 핸들러
  const handleTextSelection = useCallback(() => {
    if (codeTextareaRef?.current) {
      const textarea = codeTextareaRef.current
      const start = textarea.selectionStart
      const end = textarea.selectionEnd

      if (start !== end) {
        const selectedText = code.substring(start, end)
        onSelectCode(selectedText)
      }
    }
  }, [code, codeTextareaRef, onSelectCode])

  if (!code) {
    return (
      <div
        className={`text-muted-foreground flex h-full min-h-[200px] items-center justify-center p-6 ${className}`}
      >
        파일을 선택하여 코드를 확인하세요.
      </div>
    )
  }

  return (
    <Textarea
      ref={codeTextareaRef}
      value={code}
      readOnly
      className={`h-full min-h-[300px] resize-none font-mono text-sm ${className}`}
      onMouseUp={handleTextSelection}
      onKeyUp={handleTextSelection}
      placeholder="코드를 드래그하여 선택해주세요."
    />
  )
}
