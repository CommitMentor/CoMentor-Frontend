'use client'

import React from 'react'
import { Code } from 'lucide-react'
import { CodeSnippetViewerProps } from '../types'

/**
 * 코드 스니펫을 표시하는 재사용 가능한 컴포넌트
 */
const CodeSnippetViewer: React.FC<CodeSnippetViewerProps> = ({
  code,
  title = '선택된 코드',
  progress,
  total,
  current,
}) => {
  return (
    <div className="mb-6 rounded-md border border-slate-200 p-4">
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center space-x-2">
          <Code className="h-4 w-4 text-zinc-600" />
          <span className="text-xs font-medium text-zinc-900">{title}</span>
        </div>
        {current !== undefined && total !== undefined && (
          <span className="text-xs text-slate-500">
            {current} / {total}
          </span>
        )}
      </div>

      <div className="relative">
        <div className="max-h-[260px] overflow-auto rounded-md bg-slate-50 p-4">
          <pre className="text-sm whitespace-pre-wrap text-slate-700">
            {code || '코드가 선택되지 않았습니다.'}
          </pre>
        </div>
        {progress !== undefined && (
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-zinc-400"
              style={{
                width: `${progress}%`,
              }}
            ></div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CodeSnippetViewer
