'use client'

import { useState, useRef, useCallback } from 'react'
import { getProjectFiles, getFileCode } from '@/api/services/project'

interface UseCodeSelectionProps {
  projectId: string
}

export default function useCodeSelection({ projectId }: UseCodeSelectionProps) {
  // 날짜 범위
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: new Date(new Date().setDate(new Date().getDate() - 7)), // 기본값: 1주일 전
    to: new Date(), // 기본값: 오늘
  })

  // 파일 관련 상태
  const [files, setFiles] = useState<string[]>([])
  const [selectedFile, setSelectedFile] = useState('')
  const [code, setCode] = useState('')
  const [selectedCode, setSelectedCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 코드 텍스트 영역 참조
  const codeTextareaRef = useRef<HTMLTextAreaElement | null>(null)

  // 날짜 범위 변경 핸들러
  const handleDateRangeChange = useCallback(
    (value: { from: Date | undefined; to: Date | undefined }) => {
      setDateRange(value)
    },
    [],
  )

  // 커밋 및 파일 목록 가져오기
  const fetchCommitsAndFiles = useCallback(async () => {
    if (!projectId) return
    if (!dateRange.from || !dateRange.to) {
      setError('날짜 범위를 선택해주세요.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const startDate = dateRange.from.toISOString().split('T')[0]
      const endDate = dateRange.to.toISOString().split('T')[0]

      // 커스텀 기간 파라미터 생성
      const periodParam = `custom?startDate=${startDate}&endDate=${endDate}`

      // 프로젝트 파일 목록 가져오기
      const commitFiles = await getProjectFiles(projectId, periodParam)

      // 파일 목록 설정
      setFiles(commitFiles as string[])

      // 파일이 없는 경우 에러 메시지 표시
      if (commitFiles.length === 0) {
        setError('선택한 기간에 커밋된 파일이 없습니다.')
      } else {
        setError(null)
      }
    } catch (err) {
      console.error('커밋 목록을 가져오는 중 오류 발생:', err)
      setError('파일 목록을 가져오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }, [projectId, dateRange])

  // 파일 선택 핸들러
  const handleSelectFile = useCallback(
    async (fileName: string) => {
      if (!projectId || !fileName) return

      setSelectedFile(fileName)
      setLoading(true)
      setError(null)

      try {
        const fileContent = await getFileCode(projectId, fileName)
        setCode(fileContent)
        setSelectedCode('') // 새 파일 선택 시 코드 선택 초기화
      } catch (err) {
        console.error('파일 내용을 가져오는 중 오류 발생:', err)
        setError('파일 내용을 가져오는데 실패했습니다.')
        setCode('')
      } finally {
        setLoading(false)
      }
    },
    [projectId],
  )

  // 코드 선택 핸들러
  const handleSelectCode = useCallback((text: string) => {
    setSelectedCode(text)
  }, [])

  return {
    dateRange,
    handleDateRangeChange,
    files,
    selectedFile,
    handleSelectFile,
    code,
    selectedCode,
    handleSelectCode,
    codeTextareaRef,
    loading,
    error,
    fetchCommitsAndFiles,
  }
}
