'use client'

import React from 'react'
import { Loader2, Folder, FileText } from 'lucide-react'

interface FileListProps {
  files: string[]
  selectedFile: string
  loading: boolean
  onSelectFile: (file: string) => void
}

/**
 * 파일 목록 컴포넌트
 */
const FileList: React.FC<FileListProps> = ({
  files,
  selectedFile,
  loading,
  onSelectFile,
}) => {
  // 파일 아이콘 결정 함수
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()

    // 폴더 이름은 보통 확장자가 없음
    if (!extension) {
      return <Folder className="h-4 w-4 text-slate-500" />
    }

    return <FileText className="h-4 w-4 text-slate-500" />
  }

  if (loading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
        <span className="ml-2 text-sm text-slate-600">
          파일 목록 로딩 중...
        </span>
      </div>
    )
  }

  if (files.length === 0) {
    return (
      <div className="rounded-md bg-slate-50 p-4 text-center text-slate-500">
        선택한 기간에 커밋된 파일이 없습니다.
      </div>
    )
  }

  return (
    <div className="h-64 overflow-y-auto rounded-md border border-slate-200">
      <ul className="divide-y divide-slate-100">
        {files.map((file) => (
          <li
            key={file}
            className={`cursor-pointer p-2 hover:bg-slate-50 ${
              selectedFile === file ? 'bg-slate-100' : ''
            }`}
            onClick={() => onSelectFile(file)}
          >
            <div className="flex items-center space-x-2">
              {getFileIcon(file)}
              <span className="text-sm text-slate-700">{file}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default FileList
