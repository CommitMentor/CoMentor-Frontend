import { fetcher, useGetQuery, usePostMutation } from '@/api/lib/fetcher'
import {
  CSDontknowFeedback,
  CSFeedback,
  CSFeedbackResponse,
  CSQuestionDetailResponse,
  CSQuestionResponse,
} from './model'
import { useInfiniteQuery } from '@tanstack/react-query'
import { CSCategory } from '@/api/types/common'

export const useGetCSQuestion = (
  page: number,
  initialData?: CSQuestionResponse,
) => {
  return useGetQuery<CSQuestionResponse>(
    ['CS Dashboard', page.toString()],
    `/question/list?page=${page}`,
    {
      enabled: page !== undefined,
      ...(initialData !== undefined ? { initialData } : {}),
    },
  )
}

export const useGetCSQuestionDetail = (csQuestionId: number) => {
  return useGetQuery<CSQuestionDetailResponse>(
    ['cs-question', csQuestionId.toString()],
    `/question?csQuestionId=${csQuestionId}`,
    {
      refetchOnMount: true,
    },
  )
}

export const useInfiniteQuestions = (
  category?: CSCategory | null,
  initialData?: CSQuestionResponse | null,
) => {
  return useInfiniteQuery<CSQuestionResponse>({
    queryKey: ['cs-question-infinite', category],
    queryFn: async ({ pageParam = 0 }) => {
      const query = new URLSearchParams({
        page: pageParam as string,
      })
      if (category) query.append('csCategory', category)

      return await fetcher<CSQuestionResponse>(`/question/list?${query}`, {
        method: 'GET',
      })
    },

    // 무한스크롤 다음 page 계산
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage.result
      return currentPage < totalPages - 1 ? currentPage + 1 : undefined
    },

    initialPageParam: 0,

    // key가 바뀌면 초기 데이터 주입, category가 바뀌면 자동 무효화됨
    initialData:
      (category === null || category === undefined) && initialData
        ? { pageParams: [0], pages: [initialData] }
        : undefined,
    staleTime: 1000 * 60,
    refetchOnMount: true,
  })
}

export const useCSFeedback = () => {
  return usePostMutation<CSFeedbackResponse, CSFeedback>('/feedback/CS')
}

export const useCSRetryFeedback = () => {
  return usePostMutation<CSFeedbackResponse, CSFeedback>('/feedback/CS/retry')
}

export const useCSDontknowFeedback = (csQuestionId: number) => {
  return usePostMutation<CSFeedbackResponse, CSDontknowFeedback>(
    `/feedback/CS/commentary?csQuestionId=${csQuestionId}`,
  )
}
