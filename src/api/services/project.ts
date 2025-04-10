import {
  Project,
  CSQuestion,
  HistoryByDate,
} from '@/api/mocks/handlers/project'

// API 요청에 공통 헤더를 적용하는 기본 fetch 함수
const apiFetch = async (url: string, options: RequestInit = {}) => {
  // MSW 환경인지 확인
  const isMswEnabled = process.env.NEXT_PUBLIC_MSW === 'enable'

  // 기본 헤더 설정
  const headers = {
    'Content-Type': 'application/json',
    // 모의 토큰 추가 - MSW를 활성화한 경우 항상 추가
    ...(isMswEnabled ? { Authorization: 'Bearer mock-token-for-msw' } : {}),
    ...options.headers,
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    })

    return response
  } catch (error) {
    console.error('API 요청 중 오류 발생:', error)
    throw error
  }
}

/**
 * 프로젝트 상세 정보 조회
 */
export const getProjectDetail = async (projectId: string): Promise<Project> => {
  const response = await apiFetch(`/api/projects/${projectId}`)

  if (!response.ok) {
    throw new Error('프로젝트 정보를 가져오는데 실패했습니다')
  }

  return response.json()
}

/**
 * 프로젝트의 커밋 기간 조회
 */
export const getCommitPeriods = async (projectId: string) => {
  const response = await apiFetch(`/api/projects/${projectId}/commit-periods`)

  if (!response.ok) {
    throw new Error('커밋 기간 정보를 가져오는데 실패했습니다')
  }

  return response.json()
}

/**
 * 프로젝트 파일 목록 조회
 */
export const getProjectFiles = async (
  projectId: string,
  period: string = '1week',
): Promise<string[]> => {
  const response = await apiFetch(
    `/api/projects/${projectId}/files?period=${period}`,
  )

  if (!response.ok) {
    throw new Error('파일 목록을 가져오는데 실패했습니다')
  }

  return response.json()
}

/**
 * 파일 코드 조회
 */
export const getFileCode = async (
  projectId: string,
  fileName: string,
): Promise<string> => {
  const response = await apiFetch(
    `/api/projects/${projectId}/code?fileName=${encodeURIComponent(fileName)}`,
  )

  if (!response.ok) {
    throw new Error('파일 코드를 가져오는데 실패했습니다')
  }

  const data = await response.json()
  return data.code
}

/**
 * CS 질문 생성
 */
export const generateCSQuestions = async (
  projectId: string,
  code: string,
  fileName: string,
): Promise<CSQuestion[]> => {
  const response = await apiFetch('/api/cs-questions/generate', {
    method: 'POST',
    body: JSON.stringify({ projectId, code, fileName }),
  })

  if (!response.ok) {
    throw new Error('CS 질문 생성에 실패했습니다')
  }

  return response.json()
}

/**
 * CS 질문 답변 제출
 */
export const submitAnswer = async (
  questionId: number,
  answer: string,
): Promise<string> => {
  const response = await apiFetch('/api/cs-questions/answer', {
    method: 'POST',
    body: JSON.stringify({ questionId, answer }),
  })

  if (!response.ok) {
    throw new Error('답변 제출에 실패했습니다')
  }

  const data = await response.json()
  return data.feedback
}

/**
 * 질문 저장
 */
export const saveQuestion = async (questionId: number): Promise<boolean> => {
  const response = await apiFetch(`/api/cs-questions/${questionId}/save`, {
    method: 'POST',
  })

  if (!response.ok) {
    throw new Error('질문 저장에 실패했습니다')
  }

  const data = await response.json()
  return data.success
}

/**
 * 질문 북마크
 */
export const bookmarkQuestion = async (
  questionId: number,
): Promise<boolean> => {
  const response = await apiFetch(`/api/cs-questions/${questionId}/bookmark`, {
    method: 'POST',
  })

  if (!response.ok) {
    throw new Error('북마크에 실패했습니다')
  }

  const data = await response.json()
  return data.success
}

/**
 * 질문 이력 조회
 */
export const getQuestionHistory = async (
  projectId: string,
): Promise<HistoryByDate> => {
  const response = await apiFetch(`/api/projects/${projectId}/question-history`)

  if (!response.ok) {
    throw new Error('질문 이력을 가져오는데 실패했습니다')
  }

  return response.json()
}
