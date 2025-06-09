import { serverFetcher } from '@/api/lib/serverFetcher'
import { CSQuestionDetailResponse, CSQuestionResponse } from '../model'

export const fetchCSQuestion = async (questionId: number) => {
  return await serverFetcher<CSQuestionDetailResponse>(
    `/question?csQuestionId=${questionId}`,
  )
}

export const fetchCSQuestionList = async (page: number) => {
  return await serverFetcher<CSQuestionResponse>(`/question/list?page=${page}`)
}
