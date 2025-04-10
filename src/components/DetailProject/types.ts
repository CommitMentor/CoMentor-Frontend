import {
  Project,
  CSQuestion,
  HistoryByDate,
  QuestionHistoryItem,
} from '@/api/mocks/handlers/project'
import { RefObject } from 'react'

// 프로젝트 데이터 타입
export interface ProjectData extends Project {}

// 프로젝트 상세 페이지 props
export interface DetailProjectProps {
  params: Promise<{
    projectId: string
  }>
}

// 프로젝트 헤더 props
export interface ProjectHeaderProps {
  project: ProjectData
  onEdit?: () => void
  onDelete?: () => void
}

// 코드 선택 탭 props
export interface CodeSelectionTabProps {
  projectId: string
  files?: string[]
  onSelectCodeSnippet: (snippet: string) => void
}

// CS 질문 관련 타입
export interface QuestionItem extends Partial<CSQuestion> {
  id: number
  question: string
  answered?: boolean
  userAnswer?: string
  feedback?: string
  codeSnippet?: string
}

// CS 질문 탭 props
export interface CSQuestionsTabProps {
  projectId: string
  codeSnippet?: string
  onAnswerSubmit?: (answer: string, questionId: number) => Promise<string>
  onSaveQuestion?: (questionId: number) => Promise<boolean | undefined>
  onChooseAnotherCode?: () => void
  onGenerateMoreQuestions?: () => void
  onFinish?: () => void
  onTabChange?: (tabId: string) => void
}

// 질문 이력 탭 props
export interface QuestionHistoryTabProps {
  projectId: string
  initialHistory?: HistoryByDate
  onBookmarkQuestion?: (questionId: number) => Promise<boolean>
}

// 재사용 가능한 UI 컴포넌트 props
export interface CodeSnippetViewerProps {
  code: string
  title?: string
  progress?: number
  total?: number
  current?: number
}

export interface QuestionCardProps {
  question: QuestionItem
  isSelected?: boolean
  isBookmarked?: boolean
  onClick?: () => void
}

// 여러 컴포넌트에서 공유하는 타입들
export type { HistoryByDate, QuestionHistoryItem }
