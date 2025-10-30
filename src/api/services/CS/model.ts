import { CSCategory, QuestionStatus, Stack } from '@/api/types/common'

export interface CSQuestionList {
  csQuestionId: number
  question: string
  stack: Stack
  csCategory: CSCategory
  questionStatus: QuestionStatus
  fileName?: string
}

export interface CSDateGroup {
  date: string
  questions: CSQuestionList[]
}

export interface CSQuestionResult {
  content: CSDateGroup[]
  currentPage: number
  totalPages: number
  totalElements: number
}

export interface CSQuestionResponse {
  code: number
  message: string
  result: CSQuestionResult
}

export interface CSAnswer {
  content: string
  author: string
}

export interface CSQuestionDetail {
  csQuestionId: number
  question: string
  questionStatus: QuestionStatus
  stack: Stack
  csCategory: CSCategory
  answers: CSAnswer[]
  fileName?: string
}

export interface CSQuestionDetailResponse {
  code: number
  message: string
  result: CSQuestionDetail
}

export interface CSFeedback {
  answer: string
  csQuestionId: number
}

export interface CSDontknowFeedback {
  csQuestionId: number
}

export interface CSFeedbackResponse {
  code: number
  message: string
  result: string
}
